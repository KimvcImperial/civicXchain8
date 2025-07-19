// Simple working deployment script for CivicXChain system
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CivicXChain System...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Step 1: Deploy Environmental Oracle
  console.log("\n📡 Deploying Environmental Oracle...");
  const EnvironmentalDataOracle = await ethers.getContractFactory("EnvironmentalDataOracle");
  const oracle = await EnvironmentalDataOracle.deploy();
  await oracle.deployed();
  console.log("✅ Environmental Oracle deployed to:", oracle.address);

  // Initialize with some data
  console.log("📊 Initializing oracle with data...");
  await oracle.updatePM25Data(1385); // 13.85 μg/m³
  await oracle.updateCO2Data(42165); // 421.65 ppm
  await oracle.updateForestCoverData(6850); // 68.50%
  console.log("✅ Oracle initialized with data");

  // Step 2: Deploy CIVIC Token
  console.log("\n💰 Deploying CIVIC Token...");
  const CivicToken = await ethers.getContractFactory("CivicToken");
  const token = await CivicToken.deploy();
  await token.deployed();
  console.log("✅ CIVIC Token deployed to:", token.address);

  // Step 3: Deploy Governance Contract (ETH-based staking)
  console.log("\n🏛️ Deploying Governance Contract...");
  const CivicXChainGovernance = await ethers.getContractFactory("CivicXChainGovernance");
  // Use our oracle for all three feeds (PM2.5, CO2, Forest Cover)
  const governance = await CivicXChainGovernance.deploy(oracle.address, oracle.address, oracle.address);
  await governance.deployed();
  console.log("✅ Governance Contract deployed to:", governance.address);

  // Step 4: Configure permissions
  console.log("\n🔧 Configuring permissions...");
  await token.addAuthorizedMinter(governance.address);
  console.log("✅ Token permissions configured");

  // Step 5: Test the system
  console.log("\n🧪 Testing system...");
  
  // Test oracle
  const pm25 = await oracle.getLatestPM25Data();
  const co2 = await oracle.getLatestCO2Data();
  const forest = await oracle.getLatestForestCoverData();
  console.log("📊 Oracle Data:");
  console.log("   PM2.5:", Number(pm25) / 100, "μg/m³");
  console.log("   CO2:", Number(co2) / 100, "ppm");
  console.log("   Forest:", Number(forest) / 100, "%");

  // Test token
  const balance = await token.balanceOf(deployer.address);
  console.log("💰 CIVIC Token Balance:", ethers.utils.formatEther(balance), "CIVIC");

  // Save addresses
  const addresses = {
    ENVIRONMENTAL_ORACLE: oracle.address,
    CIVIC_TOKEN: token.address,
    GOVERNANCE_CONTRACT: governance.address,
    NETWORK: "localhost",
    RPC_URL: "http://localhost:8545",
    CHAIN_ID: 31337,
    DEPLOYED_AT: new Date().toISOString()
  };

  const fs = require('fs');
  fs.writeFileSync('working-system-config.json', JSON.stringify(addresses, null, 2));

  console.log("\n📋 System Addresses:");
  console.log("ENVIRONMENTAL_ORACLE:", oracle.address);
  console.log("CIVIC_TOKEN:", token.address);
  console.log("GOVERNANCE_CONTRACT:", governance.address);

  console.log("\n🎉 CivicXChain System Deployed Successfully!");
  console.log("✅ All contracts deployed and configured");
  console.log("✅ Oracle initialized with environmental data");
  console.log("✅ Token permissions configured");
  console.log("✅ System ready for use");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
