const BoxFactoryContract = artifacts.require('BoxFactory');
const BoxContract = artifacts.require('Box');

contract('BoxFactory: deployment', () => {
  it('has been deployed', async () => {
    const boxFactory = await BoxFactoryContract.deployed();
    assert.ok(boxFactory.address);
  });
});

contract('BoxFactory: create', (accounts) => {
  let boxFactory;

  beforeEach(async () => {
    boxFactory = await BoxFactoryContract.deployed();
  });

  it('increments the box count as expected', async () => {
    const countBefore = await boxFactory.counter();
    await boxFactory.create();
    const countAfter = await boxFactory.counter();

    assert.equal(countAfter - countBefore, 1, 'count should be incremented by 1');
  });

  it('creates the box with 0 breed count', async () => {
    const [index] = await boxFactory.ownedBoxes(accounts[0]);
    const breedCount = await boxFactory.getBreedCount(index);

    assert.equal(breedCount, 0, 'breed count should be 0');
  });

  it('creates the box colors with in expected range', async () => {
    const [index] = await boxFactory.ownedBoxes(accounts[0]);
    const boxAddress = await boxFactory.get(index);
    const box = await BoxContract.at(boxAddress);

    const { r, g, b } = await box.color();
    assert.ok(r >= 0 && r <= 255, 'r should be in range');
    assert.ok(g >= 0 && g <= 255, 'g should be in range');
    assert.ok(b >= 0 && b <= 255, 'b should be in range');
  });

  it('creates the box sizes with in expected range', async () => {
    const [index] = await boxFactory.ownedBoxes(accounts[0]);
    const boxAddress = await boxFactory.get(index);
    const box = await BoxContract.at(boxAddress);

    const { x, y, z } = await box.size();
    assert.ok(x >= 100 && x <= 1000, 'x should be in range');
    assert.ok(y >= 100 && y <= 1000, 'y should be in range');
    assert.ok(z >= 100 && z <= 1000, 'z should be in range');
  });

  it('creates the box with null parents', async () => {
    const [index] = await boxFactory.ownedBoxes(accounts[0]);
    const boxAddress = await boxFactory.get(index);
    const box = await BoxContract.at(boxAddress);

    const { p1, p2 } = await box.parents();
    assert.equal(p1, 0, 'p1 should be zero address');
    assert.equal(p2, 0, 'p2 should be zero address');
  });

  it('owner of the box should be factory owner', async () => {
    const [index] = await boxFactory.ownedBoxes(accounts[0]);
    const boxAddress = await boxFactory.get(index);
    const box = await BoxContract.at(boxAddress);

    const actual = await box.owner();
    const expected = accounts[0];
    assert.equal(actual, expected, 'box should belong to factory owner');
  });
});

contract('BoxFactory: breed', (accounts) => {
  let boxFactory;

  beforeEach(async () => {
    boxFactory = await BoxFactoryContract.deployed();

    await boxFactory.create();
    await boxFactory.create();
  });

  it('fails to breed a box when parent 1 not present', async () => {
    const counter = await boxFactory.counter();

    try {
      await boxFactory.breed(counter + 1, 0);
      assert(false, 'should have thrown');
    } catch (err) {
      const expected = 'p1 index out of bounds';
      assert.ok(err.message.includes(expected), `${err.message}`);
    }
  });

  it('fails to breed a box when parent 2 not present', async () => {
    const counter = await boxFactory.counter();

    try {
      await boxFactory.breed(0, counter);
      assert(false, 'should have thrown');
    } catch (err) {
      const expected = 'p2 index out of bounds';
      assert.ok(err.message.includes(expected), `${err.message}`);
    }
  });

  it('fails to breed a box with itself', async () => {
    try {
      await boxFactory.breed(0, 0);
      assert(false, 'should have thrown');
    } catch (err) {
      const expected = 'cannot breed with self';
      assert.ok(err.message.includes(expected), `${err.message}`);
    }
  });

  it('fails to breed when value is not present', async () => {
    try {
      await boxFactory.breed(0, 1);
      assert(false, 'should have thrown');
    } catch (err) {
      const expected = 'invalid price';
      assert.ok(err.message.includes(expected), `${err.message}`);
    }
  });

  it('fails to breed when owners are different', async () => {
    try {
      const boxAddress = await boxFactory.get(0);
      const box = await BoxContract.at(boxAddress);
      await box.transferOwnership(accounts[1]);

      await boxFactory.breed(0, 1, { value: web3.utils.toWei('0.3', 'ether') });
      assert(false, 'should have thrown');
    } catch (err) {
      const expected = 'boxes are not from same owner';
      assert.ok(err.message.includes(expected), `${err.message}`);
    }
  });

  it('successfully breed when everyting is right', async () => {
    await boxFactory.create();
    const preOwnedBoxes = await boxFactory.ownedBoxes(accounts[0]);

    await boxFactory.breed(
      preOwnedBoxes[0],
      preOwnedBoxes[1],
      { value: web3.utils.toWei('0.3', 'ether') },
    );
    const postOwnedBoxes = await boxFactory.ownedBoxes(accounts[0]);

    assert.equal(
      postOwnedBoxes.length - preOwnedBoxes.length,
      1,
      'boxes owned should increment by 1',
    );
  });

  it('successfully increase breed count of p1 after breeding', async () => {
    const ownedBoxes = await boxFactory.ownedBoxes(accounts[0]);
    const actual = await boxFactory.getBreedCount(ownedBoxes[0]);

    assert.equal(
      actual,
      1,
      'breedCount should be 1 after breeding',
    );
  });

  it('successfully increase breed count of p2 after breeding', async () => {
    const ownedBoxes = await boxFactory.ownedBoxes(accounts[0]);
    const actual = await boxFactory.getBreedCount(ownedBoxes[1]);

    assert.equal(
      actual,
      1,
      'breedCount should be 1 after breeding',
    );
  });

  it('should raise when breed cap is reached', async () => {
    await boxFactory.create();
    const preOwnedBoxes = await boxFactory.ownedBoxes(accounts[0]);

    await boxFactory.breed(
      preOwnedBoxes[2],
      preOwnedBoxes[3],
      { value: web3.utils.toWei('0.3', 'ether') },
    );
    await boxFactory.breed(
      preOwnedBoxes[2],
      preOwnedBoxes[3],
      { value: web3.utils.toWei('0.3', 'ether') },
    );
    await boxFactory.breed(
      preOwnedBoxes[2],
      preOwnedBoxes[3],
      { value: web3.utils.toWei('0.3', 'ether') },
    );

    try {
      await boxFactory.breed(
        preOwnedBoxes[2],
        preOwnedBoxes[3],
        { value: web3.utils.toWei('0.3', 'ether') },
      );
      assert(false, 'should have thrown');
    } catch (err) {
      const expected = 'box1 has reached breed limit';
      assert.ok(err.message.includes(expected), `${err.message}`);
    }
  });
});
