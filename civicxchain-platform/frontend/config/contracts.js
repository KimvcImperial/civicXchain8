export const CONTRACT_CONFIG = {
    NETWORK: 'localhost',
    RPC_URL: 'http://localhost:8545',
    CHAIN_ID: 31337,
    CIVIC_CONTRACT: '0x5FbDB2315678afecb367f032d93F642f64180aa3', //deployed address
  };
  
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