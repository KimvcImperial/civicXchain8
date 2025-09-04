# 🌍 CivicXChain Platform

A blockchain-based civic engagement platform that enables transparent governance, environmental monitoring, and community participation through smart contracts and decentralized oracles.

## 🏗️ Architecture

- **Smart Contracts**: Solidity contracts for governance and oracle management
- **Frontend**: Next.js with Web3 integration (Wagmi, RainbowKit)
- **Backend**: FastAPI (Python) for off-chain data management
- **Database**: PostgreSQL for satellite and environmental data
- **Network**: Deployed on Sepolia Testnet

## 🚀 Quick Start

### Prerequisites
- MetaMask wallet
- Sepolia testnet ETH

### Installation & Setup
```bash
# Clone and install dependencies
npm install

# Start the platform
npm run dev
```

This starts:
- 🌐 Frontend: http://localhost:3000
- 🔗 Backend API: http://localhost:8000

### MetaMask Configuration
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: https://eth-sepolia.public.blastapi.io

Get Sepolia ETH: https://sepoliafaucet.com/

## 📋 Deployed Contracts (Sepolia)

```
Governance Contract: 0xE16F89910DF3Bd0f1C06b667F85D2b68582BA4c4
Environmental Oracle: 0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD
```

## 🛠️ Development

### Project Structure
```
civicxchain-platform/
├── contracts/          # Smart contracts (Solidity)
├── frontend/           # Next.js web application
├── backend/            # API server
├── civicXchain-Database/ # Database schemas and scripts
└── scripts/            # Deployment and utility scripts
```

### Available Scripts
- `npm run dev` - Start development environment
- `npm run deploy` - Deploy contracts
- `npm run generate-abi` - Generate contract ABIs
- `npm run sync` - Sync contract addresses

## 📚 Documentation

- [Sepolia Setup Guide](../SEPOLIA-SETUP.md)
- [MetaMask Setup](METAMASK-SETUP.md)
- [Oracle Integration](ORACLE-INTEGRATION-FIXES.md)
- [Achievement System](ACHIEVEMENT-SYSTEM-IMPROVEMENTS.md)

## 🎯 Features

- **Environmental Commitments**: Public officials create staked commitments with deadlines
- **Oracle Integration**: Real-time environmental data from Chainlink and satellite APIs
- **Achievement Tracking**: Automated monitoring of commitment progress
- **Reward System**: Token rewards for fulfilled commitments, penalties for failures
- **Judge Verification**: Independent verification of achievements
- **Transparent Monitoring**: All commitments and progress tracked on blockchain

## 📄 License

This project is licensed under the MIT License.
