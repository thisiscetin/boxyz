const BoxContract = artifacts.require("Box");

contract("Box", accounts => {
  let box;

  const id = 1;
  const parent1 = "0x0000000000000000000000000000000000000000";
  const parent2 = "0x0000000000000000000000000000000000000000";

  const x = 100; // * /100 - [100-1000]
  const y = 1000;
  const z = 300;

  const r = 50; // [0-255]
  const g = 120;
  const b = 180;

  beforeEach(async () => {
    box = await BoxContract.new(
      id,
      parent1,
      parent2,
      x,
      y,
      z,
      r,
      g,
      b
    );
  });

  describe("initialization", () => {
    it("gets id", async () => {
      const actual = await box.id();
      assert.equal(actual, id, "parent1 is not matching.");
    });

    it("gets parent1 address", async () => {
      const { parent1_: actual } = await box.parents();
      assert.equal(actual, parent1, "parent1 is not matching.");
    });

    it("gets parent2 address", async () => {
      const { parent2_: actual } = await box.parents();
      assert.equal(actual, parent2, "parent2 is not matching.");
    });

    it("gets owner address", async () => {
      const actual = await box.owner();
      assert.equal(actual, accounts[0], "owner is not matching.");
    });

    it("gets dimension on x", async () => {
      const { x_: actual } = await box.dimensions();
      assert.equal(actual, x, "x dimension is not matching.");
    });

    it("gets dimension on y", async () => {
      const { y_: actual } = await box.dimensions();
      assert.equal(actual, y, "y dimension is not matching.");
    });

    it("gets dimension on z", async () => {
      const { z_: actual } = await box.dimensions();
      assert.equal(actual, z, "z dimension is not matching.");
    });

    it("gets r value", async () => {
      const { r_: actual } = await box.color();
      assert.equal(actual, r, "r value is not matching.");
    });

    it("gets g value", async () => {
      const { g_: actual } = await box.color();
      assert.equal(actual, g, "g value is not matching.");
    });

    it("gets b value", async () => {
      const { b_: actual } = await box.color();
      assert.equal(actual, b, "b value is not matching.");
    });

    it('gets box birthdate', async () => {
      const actual = await box.birthdate();
      const date = new Date(actual.toNumber() * 1000);

      assert.equal(date.getDay(), new Date().getDay(), "birthdate is not matching.");
    })
  })
});