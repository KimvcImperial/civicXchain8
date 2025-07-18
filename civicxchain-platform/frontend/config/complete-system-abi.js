// Complete system ABIs for CivicXChain

export const GOVERNANCE_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string", "name": "_officialName", "type": "string"},
      {"internalType": "string", "name": "_officialRole", "type": "string"},
      {"internalType": "uint256", "name": "_targetValue", "type": "uint256"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"},
      {"internalType": "string", "name": "_metricType", "type": "string"}
    ],
    "name": "createCommitment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "verifyCommitment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_official", "type": "address"}],
    "name": "getOfficialCommitments",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "getCommitment",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "address", "name": "official", "type": "address"},
          {"internalType": "string", "name": "officialName", "type": "string"},
          {"internalType": "string", "name": "role", "type": "string"},
          {"internalType": "uint256", "name": "targetValue", "type": "uint256"},
          {"internalType": "uint256", "name": "deadline", "type": "uint256"},
          {"internalType": "uint256", "name": "stakeAmount", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "bool", "name": "isFulfilled", "type": "bool"},
          {"internalType": "bool", "name": "isVerified", "type": "bool"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "uint256", "name": "verifiedAt", "type": "uint256"},
          {"internalType": "string", "name": "metricType", "type": "string"},
          {"internalType": "uint256", "name": "actualValue", "type": "uint256"},
          {"internalType": "uint256", "name": "baselineValue", "type": "uint256"}
        ],
        "internalType": "struct CivicXChainComplete.Commitment",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextCommitmentId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStats",
    "outputs": [
      {"internalType": "uint256", "name": "total", "type": "uint256"},
      {"internalType": "uint256", "name": "fulfilled", "type": "uint256"},
      {"internalType": "uint256", "name": "failed", "type": "uint256"},
      {"internalType": "uint256", "name": "active", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const ENVIRONMENTAL_ORACLE_ABI = [
  {
    "inputs": [],
    "name": "getLatestPM25Data",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLatestCO2Data", 
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLatestForestCoverData",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "int256", "name": "_value", "type": "int256"}],
    "name": "updatePM25Data",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "int256", "name": "_value", "type": "int256"}],
    "name": "updateCO2Data",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "int256", "name": "_value", "type": "int256"}],
    "name": "updateForestCoverData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const CIVIC_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "getStakedBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];
