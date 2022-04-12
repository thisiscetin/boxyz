/* eslint-disable func-names */
const BoxFactory = artifacts.require('BoxFactory');

module.exports = function (deployer) {
  deployer.deploy(BoxFactory);
};
