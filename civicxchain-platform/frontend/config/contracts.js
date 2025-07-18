// @ts-nocheck
export const CONTRACT_CONFIG = {
    // LOCAL NETWORK FOR CONTRACTS
    NETWORK: 'localhost',
    RPC_URL: 'http://localhost:8545',
    CHAIN_ID: 31337,

    // MAINNET RPC FOR CHAINLINK ORACLES (RELIABLE FREE ENDPOINT)
    MAINNET_RPC: 'https://ethereum-rpc.publicnode.com',
    MAINNET_CHAIN_ID: 1,

    // REAL CHAINLINK ORACLE ADDRESSES (MAINNET) - FREE TO READ!
    CHAINLINK_ETH_USD: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    CHAINLINK_BTC_USD: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    CHAINLINK_LINK_USD: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c',

    // Map environmental data to price feeds (creative mapping)
    PM25_ORACLE: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // ETH/USD as PM2.5 proxy
    CO2_ORACLE: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',   // BTC/USD as CO2 proxy
    FOREST_ORACLE: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c', // LINK/USD as Forest proxy

    // LOCAL CONTRACTS (deployed locally) - WORKING ORACLE
    GOVERNANCE_CONTRACT: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    PM25_ORACLE_LOCAL: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    CO2_ORACLE_LOCAL: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    FOREST_ORACLE_LOCAL: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',

    // Legacy compatibility
    CIVIC_CONTRACT: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    ENVIRONMENTAL_ORACLE: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853', // Working Oracle
  };
  
  // CHAINLINK AGGREGATOR ABI - FOR REAL ORACLE DATA
  export const CHAINLINK_AGGREGATOR_ABI = [
    {
      "inputs": [],
      "name": "latestRoundData",
      "outputs": [
        {
          "internalType": "uint80",
          "name": "roundId",
          "type": "uint80"
        },
        {
          "internalType": "int256",
          "name": "answer",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "startedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint80",
          "name": "answeredInRound",
          "type": "uint80"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "description",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // LEGACY ABI - Keep for backward compatibility
  export const ENVIRONMENTAL_ORACLE_ABI = CHAINLINK_AGGREGATOR_ABI;

  // Copy contract ABI from smart-contracts/artifacts/
  export const CIVIC_CONTRACT_ABI = [
    [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ReentrancyGuardReentrantCall",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "commitmentId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "official",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "targetValue",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "metricType",
              "type": "string"
            }
          ],
          "name": "CommitmentCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "commitmentId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "actualValue",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isCompleted",
              "type": "bool"
            }
          ],
          "name": "CommitmentUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "commitmentId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "official",
              "type": "address"
            }
          ],
          "name": "RewardClaimed",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_commitmentId",
              "type": "uint256"
            }
          ],
          "name": "claimReward",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "commitments",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "official",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "targetValue",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "actualValue",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "metricType",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "dataSource",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isCompleted",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "rewardClaimed",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_targetValue",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_metricType",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_dataSource",
              "type": "string"
            }
          ],
          "name": "createCommitment",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_commitmentId",
              "type": "uint256"
            }
          ],
          "name": "getCommitment",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "official",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "deadline",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "targetValue",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "actualValue",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "metricType",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "dataSource",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isCompleted",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "rewardClaimed",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "createdAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct CivicCommitmentContract.Commitment",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getCurrentCommitmentId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_official",
              "type": "address"
            }
          ],
          "name": "getOfficialCommitments",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "officialCommitments",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_commitmentId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_actualValue",
              "type": "uint256"
            }
          ],
          "name": "updateProgress",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
  ];