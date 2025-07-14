# 🧪 CivicXChain Complete Testing Guide

## 🎯 Overview
This guide will walk you through testing the complete CivicXChain workflow from wallet connection to reward claiming.

## 📋 Prerequisites
- ✅ Local blockchain running (localhost:8545)
- ✅ Smart contracts deployed
- ✅ Frontend running (localhost:3000)
- ✅ MetaMask installed

## 🔗 Step 1: Connect Your Wallet

### Import Test Account
1. Open MetaMask
2. Click "Import Account"
3. Use one of these private keys:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   ```

### Add Local Network
1. MetaMask → Networks → Add Network
2. Configure:
   - **Network Name:** Localhost
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH

### Connect to Dashboard
1. Visit http://localhost:3000
2. Click "🦊 Connect MetaMask to Start"
3. Approve connection in MetaMask

## 📊 Step 2: Explore the Dashboard

### Overview Tab
- View live environmental data
- Check your token balance (should be 0 initially)
- See contract reserves (100M CIVIC tokens)
- Review the test commitment status

### Commitments Tab
- View Mayor Sarah Johnson's commitment
- Check current progress (PM2.5: 12.03 → Target: 9.62 μg/m³)
- Note the "⏳ In Progress" status

## ➕ Step 3: Create Your Own Commitment

### Navigate to Create New Tab
1. Click "Create New" tab
2. Fill out the form:
   - **Title:** "Reduce CO2 Emissions by 10%"
   - **Description:** "Implement green energy initiatives to reduce carbon footprint"
   - **Official Name:** Your name
   - **Role:** "Environmental Coordinator"
   - **Metric:** CO2 Emissions
   - **Target:** 375.0 ppm (10% reduction from ~416 ppm)
   - **Deadline:** 30 days from now
   - **Stake:** 0.2 ETH

3. Click "🚀 Create Commitment"
4. Approve transaction in MetaMask
5. Wait for confirmation

## 🎯 Step 4: Simulate Environmental Improvement

### Run Improvement Script
```bash
cd civicxchain-platform/contracts
npx hardhat run simulate-improvement.js --network localhost
```

This will:
- Reduce PM2.5 from 12.03 to 9.50 μg/m³ (below target!)
- Improve other environmental metrics
- Make the test commitment eligible for rewards

## 🏆 Step 5: Claim Your Rewards

### Check Fulfillment Status
1. Refresh the dashboard (F5)
2. Go to "Commitments" tab
3. You should see "🎯 Ready to Claim" status
4. Progress bar should show 100%

### Claim Rewards
1. Click "🏆 Claim Reward" button
2. Approve transaction in MetaMask
3. Wait for confirmation
4. Check "My Rewards" tab for updated balance

## 📈 Step 6: Monitor Your Progress

### My Rewards Tab
- View your CIVIC token balance (should be ~150 CIVIC)
- Check transaction history
- Explore token utility options

### Real-Time Updates
- Environmental data updates every 30 seconds
- Oracle contracts provide live feeds
- Smart contracts automatically verify achievements

## 🔧 Troubleshooting

### Common Issues

**MetaMask Connection Issues:**
- Ensure you're on the correct network (localhost:8545)
- Check that the account has ETH for gas fees
- Try refreshing the page

**Transaction Failures:**
- Increase gas limit in MetaMask
- Ensure sufficient ETH balance
- Check console for error messages

**Data Not Updating:**
- Wait 30 seconds for automatic refresh
- Manually refresh the page
- Check that oracles are responding

### Reset Environment
If you need to start fresh:
```bash
# Stop and restart blockchain
# Redeploy contracts
cd civicxchain-platform/contracts
npx hardhat run deploy-local.js --network localhost
```

## 🎉 Success Criteria

You've successfully tested CivicXChain when you can:
- ✅ Connect wallet and view dashboard
- ✅ See live environmental data
- ✅ Create new environmental commitments
- ✅ Simulate environmental improvements
- ✅ Claim CIVIC token rewards
- ✅ View updated token balance

## 🚀 Next Steps

### Advanced Testing
1. Create multiple commitments with different metrics
2. Test deadline expiration scenarios
3. Experiment with different stake amounts
4. Test the governance voting features (coming soon)

### Production Deployment
1. Deploy to Sepolia testnet
2. Connect to real Chainlink oracles
3. Integrate with real environmental data APIs
4. Add more sophisticated reward mechanisms

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Review the terminal output for contract logs
3. Ensure all services are running correctly
4. Test with a fresh MetaMask account

---

**🌍 Congratulations! You've built and tested a complete blockchain-based environmental governance system!** 🎉
