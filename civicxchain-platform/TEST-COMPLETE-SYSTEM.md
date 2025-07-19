# 🧪 Complete CivicXChain System Testing Guide

## 🎯 What We Built

✅ **Role-Based Login System**
- 🏛️ Public Officials (create commitments)
- 👥 Citizens (monitor & view)
- ⚖️ Judges (manual verification)

✅ **Automatic Verification System**
- 🤖 Real-time oracle data updates
- ⏰ Automatic commitment verification after deadlines
- 📊 Comprehensive monitoring & logging

✅ **Manual Judge Panel**
- 🏛️ Override automatic decisions
- 📝 Detailed reasoning for votes
- ⚖️ Dispute resolution

✅ **Reward System**
- 💰 Automatic token distribution
- 🎉 Claim rewards for fulfilled commitments
- ⚠️ Penalties for failed commitments

## 🚀 How to Test Everything

### Step 1: Start the Blockchain & Contracts
```bash
cd civicxchain-platform/contracts
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy-complete-system.js --network localhost
```

### Step 2: Start the Automatic Verification System
```bash
cd civicxchain-platform/contracts
node start-verification-system.js
```
This will:
- ✅ Update oracle data every 30 seconds
- ✅ Check for commitments ready for verification
- ✅ Automatically verify and distribute rewards
- ✅ Log all activities for monitoring

### Step 3: Start the Monitoring API
```bash
cd civicxchain-platform/contracts
node monitoring-api.js
```
Visit: http://localhost:3001 to see real-time verification logs

### Step 4: Start the Frontend
```bash
cd civicxchain-platform/frontend
npm run dev
```
Visit: http://localhost:3010

## 🎭 Testing Different Roles

### 🏛️ Public Official Testing
**Wallet Address:** `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266` (Hardhat Account 0)

1. **Login as Public Official**
   - Connect with the above wallet
   - You'll see: Create, Track Status, Rewards tabs

2. **Create a Commitment**
   - Go to "Create" tab
   - Fill in commitment details
   - Set a short deadline (e.g., 2 minutes from now)
   - Stake CIVIC tokens

3. **Monitor Your Commitment**
   - Go to "Track Status" tab
   - Watch your commitment progress
   - See real oracle data updates

### 👥 Citizen Testing
**Wallet Address:** Any other wallet (defaults to citizen role)

1. **Login as Citizen**
   - Connect with any wallet not in the role registry
   - You'll see: Live Feed, Auto Monitor, Track All, Penalties tabs

2. **Monitor All Commitments**
   - Go to "Track All" tab
   - See all public officials' commitments
   - Monitor their progress transparently

3. **Watch Live Feed**
   - See real-time oracle data
   - Monitor commitment activities
   - Track system status

### ⚖️ Judge Testing
**Wallet Address:** `0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc` (Hardhat Account 2)

1. **Login as Judge**
   - Connect with the above wallet
   - You'll see: Judge Panel, All Status, Penalties tabs

2. **Manual Verification**
   - Go to "Judge Panel" tab
   - Review commitments that need manual verification
   - Vote to approve or reject with reasoning

## 🔍 Monitoring the Automatic System

### Real-Time Monitoring Dashboard
1. **In Frontend:** Go to "Auto Monitor" tab
   - See system status (running/stopped)
   - View verification logs in real-time
   - Monitor success/failure rates

2. **Web Interface:** Visit http://localhost:3001
   - Comprehensive system statistics
   - Detailed logs with timestamps
   - API endpoints for integration

### What to Watch For
- ✅ **Oracle Updates:** Every 30 seconds
- ✅ **Commitment Checks:** Automatic after deadlines
- ✅ **Verification Results:** Success/failure with reasons
- ✅ **Token Distribution:** Automatic rewards/penalties

## 🧪 Complete Test Scenario

### Scenario: Mayor's Air Quality Commitment

1. **Setup (Public Official)**
   - Login as Public Official
   - Create commitment: "Reduce PM2.5 to under 15 μg/m³"
   - Set deadline: 3 minutes from now
   - Stake 1000 CIVIC tokens

2. **Monitoring (Citizen)**
   - Login as Citizen
   - Watch the commitment in "Track All"
   - Monitor live oracle data updates

3. **Automatic Verification**
   - Wait for deadline to pass
   - Watch automatic verification system:
     - Check current PM2.5 levels from oracle
     - Compare with target (15 μg/m³)
     - Automatically verify success/failure
     - Distribute rewards or apply penalties

4. **Manual Override (Judge)**
   - If needed, login as Judge
   - Review any disputed cases
   - Provide manual verification with reasoning

5. **Reward Claiming (Public Official)**
   - If successful, go to "Rewards" tab
   - Claim your tokens + bonus
   - See updated balance

## 📊 Expected Results

### Successful Commitment
- ✅ Oracle shows PM2.5 ≤ 15 μg/m³
- ✅ Automatic verification marks as fulfilled
- ✅ Tokens returned + reward bonus
- ✅ Success logged in monitoring system

### Failed Commitment
- ❌ Oracle shows PM2.5 > 15 μg/m³
- ❌ Automatic verification marks as failed
- ❌ Penalty deducted from stake
- ❌ Failure logged in monitoring system

### Manual Override
- ⚖️ Judge reviews edge cases
- ⚖️ Can override automatic decision
- ⚖️ Provides detailed reasoning
- ⚖️ Final decision recorded

## 🔧 Troubleshooting

### Verification System Not Running
```bash
# Check if the system is running
curl http://localhost:3001/api/health

# Start the system
node start-verification-system.js
```

### No Oracle Data
- Check if Hardhat node is running
- Verify contract deployment
- Check console logs for API errors

### Role Not Recognized
- Check wallet address in `RoleBasedLogin.tsx`
- Add your address to `ROLE_REGISTRY`
- Reconnect wallet

### Commitments Not Verifying
- Check if deadline has passed
- Verify automatic system is running
- Check monitoring logs for errors

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Role-based login shows correct interface for each user type
- ✅ Automatic verification system shows "RUNNING" status
- ✅ Oracle data updates every 30 seconds with real values
- ✅ Commitments automatically verify after deadlines
- ✅ Rewards are distributed correctly
- ✅ Monitoring dashboard shows real-time logs
- ✅ Judge panel allows manual overrides
- ✅ All three user roles can access their designated features

## 🚀 Next Steps

After successful testing:
1. Deploy to testnet (Sepolia)
2. Add more environmental metrics
3. Implement governance voting
4. Add social media features
5. Scale to production

---

**🎯 You now have a complete, working environmental accountability platform with:**
- Blockchain-based commitments
- Real oracle data
- Automatic verification
- Role-based access
- Manual oversight
- Comprehensive monitoring
- Token rewards/penalties
