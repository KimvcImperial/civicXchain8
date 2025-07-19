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

    // LOCAL CONTRACTS (deployed locally) - LATEST DEPLOYMENT
    GOVERNANCE_CONTRACT: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
    PM25_ORACLE_LOCAL: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    CO2_ORACLE_LOCAL: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    FOREST_ORACLE_LOCAL: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',

    // Legacy compatibility
    CIVIC_CONTRACT: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
    ENVIRONMENTAL_ORACLE: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788', // Working Oracle
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
              "name": "_title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_officialName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_officialRole",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_targetValue",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_deadline",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_metricType",
              "type": "string"
            }
          ],
          "name": "createCommitment",
          "outputs": [],
          "stateMutability": "payable",
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