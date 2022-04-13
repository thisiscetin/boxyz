const BoxContract = artifacts.require('Box');

contract('Box', (accounts) => {
  let box;

  const zeroAddress = '0x0000000000000000000000000000000000000000';

  const id = 1;
  const p1 = zeroAddress;
  const p2 = zeroAddress;

  const x = 100; // * /100 - [100-1000]
  const y = 1000;
  const z = 300;

  const r = 50; // [0-255]
  const g = 120;
  const b = 180;

  beforeEach(async () => {
    box = await BoxContract.new(
      id,
      { r, g, b },
      { x, y, z },
      { p1, p2 },
    );
  });

  describe('sales', () => {
    it('initializes box unlisted', async () => {
      const actual = await box.listed();
      assert.equal(actual, false, 'box should be unlisted');
    });

    it('lists the box for sale', async () => {
      await box.list(web3.utils.toWei('0.2', 'ether'));
      const actual = await box.listed();
      assert.equal(actual, true, 'box should be');
    });

    it('lists the box for sale with price', async () => {
      const price = web3.utils.toWei('0.2', 'ether');

      await box.list(price);
      const actual = await box.price();
      assert.equal(actual, price, 'box price should be 0.4 eth');
    });

    it('fails buy when not listed', async () => {
      await box.unlist();

      try {
        await box.buy({
          from: accounts[1],
          value: web3.utils.toWei('0.5', 'ether'),
        });
        assert(false, 'should have thrown');
      } catch (err) {
        const expected = 'box is not listed';
        assert.ok(err.message.includes(expected), `${err.message}`);
      }
    });

    it('fails buy when price not matching', async () => {
      const price = web3.utils.toWei('0.5', 'ether');
      await box.list(price);

      try {
        await box.buy({
          from: accounts[1],
          value: web3.utils.toWei('0.2', 'ether'),
        });
        assert(false, 'should have thrown');
      } catch (err) {
        const expected = 'invalid price';
        assert.ok(err.message.includes(expected), `${err.message}`);
      }
    });

    it('transfers ownership when listed and price matching', async () => {
      const price = web3.utils.toWei('0.5', 'ether');
      await box.list(price);

      await box.buy({
        from: accounts[1],
        value: web3.utils.toWei('0.5', 'ether'),
      });
      const newOwner = await box.owner();
      assert.equal(newOwner, accounts[1], 'owner should be accounts[1]');
    });

    it('increases seller balance when sold', async () => {
      const price = web3.utils.toWei('0.5', 'ether');
      await box.list(price);

      const preBalance = await web3.eth.getBalance(accounts[0]);
      await box.buy({
        from: accounts[1],
        value: web3.utils.toWei('0.5', 'ether'),
      });

      const postBalance = await web3.eth.getBalance(accounts[0]);
      assert.equal(
        postBalance - preBalance,
        price,
        'seller balance should increase',
      );
    });

    it('ownership transfer event emitted when sold', async () => {
      const price = web3.utils.toWei('0.5', 'ether');
      await box.list(price);

      const tx = await box.buy({
        from: accounts[1],
        value: web3.utils.toWei('0.5', 'ether'),
      });

      const expected = 'OwnershipTransferred';
      const actual = tx.logs[0].event;
      assert.equal(
        actual,
        expected,
        'events should match',
      );
    });
  });

  describe('initialization', () => {
    it('gets id', async () => {
      const actual = await box.id();
      assert.equal(actual, id, 'id is not matching.');
    });

    it('gets parent1 address', async () => {
      const { p1: actual } = await box.parents();
      assert.equal(actual, p1, 'parent1 is not matching.');
    });

    it('gets parent2 address', async () => {
      const { p2: actual } = await box.parents();
      assert.equal(actual, p2, 'parent2 is not matching.');
    });

    it('gets owner address', async () => {
      const actual = await box.owner();
      assert.equal(actual, accounts[0], 'owner is not matching.');
    });

    it('gets dimension on x', async () => {
      const { x: actual } = await box.size();
      assert.equal(actual, x, 'x dimension is not matching.');
    });

    it('gets dimension on y', async () => {
      const { y: actual } = await box.size();
      assert.equal(actual, y, 'y dimension is not matching.');
    });

    it('gets dimension on z', async () => {
      const { z: actual } = await box.size();
      assert.equal(actual, z, 'z dimension is not matching.');
    });

    it('gets r value', async () => {
      const { r: actual } = await box.color();
      assert.equal(actual, r, 'r value is not matching.');
    });

    it('gets g value', async () => {
      const { g: actual } = await box.color();
      assert.equal(actual, g, 'g value is not matching.');
    });

    it('gets b value', async () => {
      const { b: actual } = await box.color();
      assert.equal(actual, b, 'b value is not matching.');
    });

    it('gets box birthdate', async () => {
      const actual = await box.birthdate();
      const date = new Date(actual.toNumber() * 1000);

      assert.equal(date.getDay(), new Date().getDay(), 'birthdate is not matching.');
    });
  });

  describe('averages', () => {
    let box1;
    let box2;

    beforeEach(async () => {
      box1 = await BoxContract.new(
        2,
        { r: 20, g: 100, b: 255 },
        { x: 0, y: 500, z: 1000 },
        { p1: zeroAddress, p2: zeroAddress },
      );

      box2 = await BoxContract.new(
        2,
        { r: 100, g: 0, b: 30 },
        { x: 13, y: 500, z: 900 },
        { p1: zeroAddress, p2: zeroAddress },
      );
    });

    it('returns and average color', async () => {
      const expected = ['60', '50', '142'];
      const actual = await box1.avgColor(box2.address);

      assert.deepEqual(actual, expected, 'average color is not matching.');
    });

    it('returns and average size', async () => {
      const expected = ['6', '500', '950'];
      const actual = await box1.avgSize(box2.address);

      assert.deepEqual(actual, expected, 'average size is not matching.');
    });
  });
});
