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
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    hardhat: {
      chainId: 31337,
      // Enable state persistence
      saveDeployments: true,
      // Use a persistent data directory
      mining: {
        auto: true,
        interval: 0
      }
    },
    // Sepolia testnet - PERMANENT persistence!
    sepolia: {
      url: "https://sepolia.infura.io/v3/demo", // Public RPC - replace with your own for better reliability
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
