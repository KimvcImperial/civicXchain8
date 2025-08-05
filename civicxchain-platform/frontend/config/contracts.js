export const CONTRACT_CONFIG = {
    // SEPOLIA NETWORK
    NETWORK: 'sepolia',
    RPC_URL: 'https://eth-sepolia.public.blastapi.io',
    CHAIN_ID: 11155111,

    // UPDATED GOVERNANCE CONTRACT (NO TOKEN REQUIREMENT) - DEPLOYED 2025-01-08
    GOVERNANCE_CONTRACT: '0xE16F89910DF3Bd0f1C06b667F85D2b68582BA4c4',
    COMMITMENT_CONTRACT: '0xE16F89910DF3Bd0f1C06b667F85D2b68582BA4c4',
    CIVIC_TOKEN: '0xE16F89910DF3Bd0f1C06b667F85D2b68582BA4c4',
    CIVIC_CONTRACT: '0xE16F89910DF3Bd0f1C06b667F85D2b68582BA4c4',

    // REAL ENVIRONMENTAL ORACLE - Fetches from NASA, OpenAQ, NOAA APIs
    REAL_ENVIRONMENTAL_ORACLE: '0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD',
    ENVIRONMENTAL_ORACLE: '0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD',

    // ENVIRONMENTAL DATA HISTORY CONTRACT - For trend analysis
    ENVIRONMENTAL_HISTORY: '0x0000000000000000000000000000000000000000' // Placeholder - will be deployed
};
  
  // CHAINLINK ORACLE ABI - FOR ENVIRONMENTAL DATA
  export const ENVIRONMENTAL_ORACLE_ABI = [
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
    }
  ];

  // CORRECT ABI FOR DEPLOYED SEPOLIA CONTRACT
  export const CIVIC_CONTRACT_ABI = [
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
      "inputs": [],
      "name": "nextCommitmentId",
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
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "officialAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "officialName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "officialRole",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "targetValue",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "metricType",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isFulfilled",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "rewardClaimed",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "stakeAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenReward",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "oracleJobId",
              "type": "bytes32"
            }
          ],
          "internalType": "struct CivicXChainGovernance.EnvironmentalCommitment",
          "name": "",
          "type": "tuple"
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
          "internalType": "uint256",
          "name": "_commitmentId",
          "type": "uint256"
        }
      ],
      "name": "claimEnvironmentalReward",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "ethRewarded",
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
      "name": "checkFulfillment",
      "outputs": [
        {
          "internalType": "bool",
          "name": "fulfilled",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "currentValue",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "dataSource",
          "type": "string"
        }
      ],
      "stateMutability": "view",
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
      "name": "applyPenalty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // CHAINLINK AGGREGATOR ABI - Standard Chainlink price feed interface
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
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_commitmentId",
          "type": "uint256"
        }
      ],
      "name": "judgeApproveCommitment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
