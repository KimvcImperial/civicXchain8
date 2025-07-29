# 🦊 MetaMask Setup for CivicXChain Local Development

## 🚨 **AFTER COMPUTER RESTART - FOLLOW THIS GUIDE**

### **1. 🌐 Add Local Network to MetaMask**

1. **Open MetaMask Extension**
2. **Click Network Dropdown** (top center)
3. **Click "Add Network"** or "Add a network manually"
4. **Enter Network Details**:
   ```
   Network Name: Localhost 8545
   New RPC URL: http://localhost:8545
   Chain ID: 31337
   Currency Symbol: ETH
   Block Explorer URL: (leave empty)
   ```
5. **Click "Save"**
6. **Switch to "Localhost 8545" network**

### **2. 🔑 Import Test Account**

**Use Hardhat's first test account** (has 10,000 ETH):

1. **Click Account Icon** (top right)
2. **Click "Import Account"**
3. **Select "Private Key"**
4. **Paste this private key**:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
5. **Click "Import"**

**Account Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

### **3. 🔄 Fix "Nonce Too High" Errors**

If you get transaction errors after restart:

1. **Go to MetaMask Settings** (click profile icon → Settings)
2. **Click "Advanced"**
3. **Scroll down to "Reset Account"**
4. **Click "Reset Account"**
5. **Confirm the reset**

This clears the transaction history for the local network.

### **4. ✅ Verify Setup**

1. **Check Network**: Should show "Localhost 8545"
2. **Check Balance**: Should show ~10,000 ETH
3. **Visit**: http://localhost:3000
4. **Click "Connect Wallet"**
5. **Should connect successfully**

---

## 🛠️ **TROUBLESHOOTING**

### **Problem: "Failed to fetch" errors**
**Solution**: 
- Make sure Hardhat network is running: `./start-civicxchain.sh`
- Check if localhost:8545 is accessible

### **Problem: "Nonce too high" errors**
**Solution**: 
- Reset MetaMask account (see step 3 above)
- This happens because local blockchain restarted but MetaMask remembers old transactions

### **Problem: "Network not found" errors**
**Solution**: 
- Re-add the localhost network (see step 1 above)
- Make sure Chain ID is exactly 31337

### **Problem: "Insufficient funds" errors**
**Solution**: 
- Import the test account with 10,000 ETH (see step 2 above)
- Make sure you're on the correct account

### **Problem: Contract addresses don't match**
**Solution**: 
- Run: `node sync-addresses.js`
- Restart frontend: `npm run dev`

---

## 🎯 **QUICK RESTART CHECKLIST**

After computer restart, do this in order:

1. ✅ **Start CivicXChain**: `./start-civicxchain.sh`
2. ✅ **Check MetaMask network**: Switch to "Localhost 8545"
3. ✅ **Reset MetaMask account** if needed
4. ✅ **Visit**: http://localhost:3000
5. ✅ **Connect wallet**
6. ✅ **Test commitment creation**

---

## 📋 **Test Account Details**

**Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
**Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
**Balance**: 10,000 ETH (on local network)

⚠️ **NEVER use this private key on mainnet or testnets!** This is only for local development.

---

## 🆘 **Still Having Issues?**

Run the recovery script:
```bash
./restart-recovery.sh
```

This will diagnose and guide you through fixing any remaining issues.
