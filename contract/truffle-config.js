const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');

const mnemonic = process.env.MNEMONIC || fs.readFileSync('.secret').toString().trim();

module.exports = {
  networks: {
    pluto: {
      provider() {
        return new HDWalletProvider(mnemonic, 'http://10.10.10.113:8545');
      },
      network_id: 1,
    },
  },
  mocha: {},
  compilers: {
    solc: {
      version: '0.8.1',
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
  },
};
