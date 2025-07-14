# 🏛️ CivicXChain: Blockchain Environmental Governance

## Overview

CivicXChain binds public officials to environmental commitments using Ethereum smart contracts, Chainlink oracles, and NFT rewards. Officials stake ETH on their environmental promises and receive NFT rewards for fulfillment or face penalties for non-compliance.

## 🔧 How It Works

### 1. **Smart Contract Architecture**
- **Main Contract**: `CivicXChainGovernance.sol`
- **NFT Standard**: ERC-721 for achievement rewards
- **Oracle Integration**: Chainlink for real environmental data
- **Staking Mechanism**: ETH stakes for commitment accountability

### 2. **Commitment Lifecycle**

```
1. Official Creates Commitment → Stakes ETH
2. Chainlink Oracle Monitors → Real environmental data
3. Target Achievement Check → Oracle verification
4. Reward/Penalty → NFT mint or stake forfeiture
```

### 3. **Environmental Metrics Supported**
- **PM2.5 Air Quality**: Target < 15 μg/m³
- **CO2 Emissions**: Target reduction levels
- **Forest Coverage**: Target percentage increase
- **Water Quality Index**: Target improvement scores

## 🚀 Deployment Guide

### Prerequisites
```bash
npm install -g hardhat
cd civicxchain-platform/contracts
npm install
```

### 1. Configure Hardhat
Create `hardhat.config.js`:
```javascript
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  },
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY"
  }
};
```

### 2. Deploy Contract
```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to mainnet (production)
npm run deploy:mainnet
```

### 3. Update Frontend
Update the contract address in `frontend/app/page.tsx`:
```javascript
const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS';
```

## 🔍 Using the Platform

### For Public Officials:

#### 1. **Create Environmental Commitment**
- Connect MetaMask wallet
- Fill commitment form (title, target, deadline)
- Stake ETH (minimum 0.1 ETH recommended)
- Submit to blockchain

#### 2. **Monitor Progress**
- Click "Check Fulfillment via Oracle"
- View real-time environmental data
- Track progress toward target

#### 3. **Claim NFT Reward**
- When target is achieved (verified by oracle)
- Click "Claim NFT Reward"
- Receive achievement NFT + stake return + bonus

### For Citizens/Oversight:

#### 1. **Monitor Officials**
- View all active commitments
- Check fulfillment status
- Verify oracle data

#### 2. **Apply Penalties**
- After deadline passes without fulfillment
- Call `applyPenalty()` function
- Official loses staked ETH

## 🌐 Chainlink Oracle Integration

### Environmental Data Sources:
1. **Air Quality APIs**: Real-time PM2.5, CO2 data
2. **Satellite Data**: Forest cover, deforestation alerts
3. **Government APIs**: Official environmental statistics
4. **IoT Sensors**: Ground-truth environmental measurements

### Oracle Job Examples:
```javascript
// PM2.5 Air Quality Check
const pm25Job = {
  jobId: "7da2702f37fd48e5b1b9a5715e3509b6",
  url: "https://api.openweathermap.org/data/2.5/air_pollution",
  path: "list.0.components.pm2_5"
};

// Forest Cover Satellite Data
const forestJob = {
  jobId: "50fc4215f89443d185b061e5d7a69dc1", 
  url: "https://api.globalforestwatch.org/v1/forest-change",
  path: "data.forest_cover_percentage"
};
```

## 🏆 NFT Reward System

### Achievement NFTs Include:
- **Metadata**: Commitment details, achievement date
- **Proof**: Oracle verification data
- **Rarity**: Based on difficulty and impact
- **Utility**: Governance voting rights, reputation score

### Example NFT Metadata:
```json
{
  "name": "Environmental Achievement #1234",
  "description": "PM2.5 reduction below 15 μg/m³ achieved by Mayor John Smith",
  "image": "ipfs://QmYourImageHash",
  "attributes": [
    {"trait_type": "Official", "value": "Mayor John Smith"},
    {"trait_type": "Metric", "value": "PM2.5"},
    {"trait_type": "Target", "value": "15 μg/m³"},
    {"trait_type": "Achievement", "value": "12.3 μg/m³"},
    {"trait_type": "Oracle Verified", "value": "Yes"}
  ]
}
```

## ⚡ Testing the System

### 1. **Local Testing**
```bash
# Start local blockchain
npx hardhat node

# Deploy to local network
npx hardhat run deploy.js --network localhost

# Run tests
npx hardhat test
```

### 2. **Frontend Integration**
```bash
cd ../frontend
npm run dev
# Visit http://localhost:3000
```

### 3. **Test Scenarios**
1. Create commitment with MetaMask
2. Check fulfillment status
3. Simulate oracle data updates
4. Claim rewards or apply penalties

## 🔐 Security Considerations

### Smart Contract Security:
- **Reentrancy Protection**: OpenZeppelin's ReentrancyGuard
- **Access Control**: Only commitment creators can claim rewards
- **Oracle Validation**: Multiple data sources for verification
- **Emergency Controls**: Owner can pause in emergencies

### Oracle Security:
- **Multiple Feeds**: Cross-reference environmental data
- **Reputation System**: Track oracle accuracy
- **Dispute Resolution**: Manual override for edge cases

## 📊 Current Implementation Status

### ✅ **Implemented Features:**
- Smart contract architecture
- NFT reward system
- Basic oracle integration
- Frontend wallet connection
- Commitment creation/tracking

### 🚧 **Next Steps:**
1. Deploy to Ethereum testnet
2. Integrate real Chainlink environmental feeds
3. Add IPFS for NFT metadata storage
4. Implement governance voting system
5. Add penalty enforcement mechanisms

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

## 📞 Support

For technical support or questions:
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)
- Documentation: [Full Docs](https://docs.civicxchain.org)
- Community: [Discord](https://discord.gg/civicxchain)
