require("@nomicfoundation/hardhat-toolbox");
const path = require("path");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Sepolia testnet - PERMANENT persistence!
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io", // Public RPC endpoint
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
      gas: 6000000,
      timeout: 60000
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    // Add deployments path for persistence
    deployments: "./deployments"
  },
  // Add deployment configuration
  namedAccounts: {
    deployer: {
      default: 0, // Use first account as deployer
    },
  }
};
