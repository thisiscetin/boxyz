const BoxFactoryContract = artifacts.require("BoxFactory");

contract("BoxFactory: deployment", () => {
  it("has been deployed", async () => {
    const boxFactory = BoxFactoryContract.deployed();

    assert(boxFactory, "box factory was not deployed");
  });
});

contract("BoxFactory: createBox", (accounts) => {
  let boxFactory;

  const [x, y, z] = [100, 1000, 300];
  const [r, g, b] = [50, 120, 180];

  it("increments the boxCount as expected", async () => {
    boxFactory = await BoxFactoryContract.deployed();
    const currentBoxCount = await boxFactory.boxCount();
    await boxFactory.createBox(
      x,
      y,
      z,
      r,
      g,
      b);

    const newBoxCount = await boxFactory.boxCount();
    assert.equal(
      newBoxCount - currentBoxCount,
      1,
      "should increment box count by 1"
    );
  });

  it("emits the OwnershipTransferred event", async () => {
    boxFactory = await BoxFactoryContract.deployed();
    const tx = await boxFactory.createBox(
      x,
      y,
      z,
      r,
      g,
      b);

    const expectedEvent = "OwnershipTransferred";
    const actualEvent = tx.logs[0].event;

    assert.equal(
      actualEvent,
      expectedEvent,
      "events should match"
    );
  })

  it("emits the BoxCreated event", async () => {
    boxFactory = await BoxFactoryContract.deployed();
    const tx = await boxFactory.createBox(
      x,
      y,
      z,
      r,
      g,
      b);

    const expectedEvent = "BoxCreated";
    const actualEvent = tx.logs[2].event;

    assert.equal(
      actualEvent,
      expectedEvent,
      "events should match"
    );
  })
});

contract("BoxFactory: breed", (accounts) => {
  describe("breed cap is configurable", () => {
    let boxFactory;

    beforeEach(async () => {
      boxFactory = await BoxFactoryContract.deployed();
    });

    it("gets default breed cap if not set", async () => {
      const actual = await boxFactory.breedCap();
      assert.equal(actual, 3, "breed cap should be 3");
    });

    it("sets breed to a value", async () => {
      await boxFactory.setBreedCap(5);
      const actual = await boxFactory.breedCap();
      assert.equal(actual, 5, "breed cap should be 5");
    });

    it("only owner should be able to set breed to a value", async () => {
      try {
        await boxFactory.setBreedCap.call(6, { from: accounts[2] });
        assert.fail("error was not raised")
      } catch (err) {
        const expected = "caller is not the owner";
        assert.ok(err.message.includes(expected), `${err.message}`);
      }
    });
  })

  describe("when two boxes breed, it should produce a box", () => {
    let boxFactory;

    beforeEach(async () => {
      boxFactory = await BoxFactoryContract.deployed();

      await boxFactory.createBox(
        100,
        200,
        1000,
        10,
        50,
        100);

      await boxFactory.createBox(
        150,
        250,
        800,
        20,
        100,
        200);
    });

    it("increments the boxCount as expected after breed", async () => {
      const currentBoxCount = await boxFactory.boxCount();

      await boxFactory.breed(0, 1, {
        from: accounts[0],
        value: web3.utils.toWei("0.3", "ether")
      });

      const newBoxCount = await boxFactory.boxCount();
      assert.equal(
        newBoxCount - currentBoxCount,
        1,
        "should increment box count by 1"
      );
    });

    it("getBoxesOf returns all boxes of an address", async () => {
      await boxFactory.breed(0, 1, {
        from: accounts[0],
        value: web3.utils.toWei("0.3", "ether")
      });

      const boxes = await boxFactory.getBoxesOf(accounts[0]);
      assert.equal(
        boxes.length,
        4,
        "should return 3 boxes"
      );
    });

    it("raises error when breeding cap is reached", async () => {
      const breedCount = await boxFactory.getBreedCount(0);
      await boxFactory.setBreedCap(2 + breedCount.toNumber());

      await boxFactory.breed(0, 1, {
        from: accounts[0],
        value: web3.utils.toWei("0.3", "ether")
      });

      await boxFactory.breed(0, 1, {
        from: accounts[0],
        value: web3.utils.toWei("0.3", "ether")
      });

      try {
        await boxFactory.breed(0, 1, {
          from: accounts[0],
          value: web3.utils.toWei("0.3", "ether")
        });
        assert.fail("error was not raised")
      } catch (err) {
        const expected = "Parent 1 has reached its breeding cap";
        assert.ok(err.message.includes(expected), `${err.message}`);
      }
    });
  });
});
