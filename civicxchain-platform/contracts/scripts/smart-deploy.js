const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function smartDeploy() {
  console.log("🧠 Smart Contract Deployment - Only deploy if needed...");
  
  const deployedAddressesPath = path.join(__dirname, '../../frontend/config/deployed-addresses.json');
  
  // Check if we have existing deployment info
  let existingDeployment = null;
  if (fs.existsSync(deployedAddressesPath)) {
    try {
      existingDeployment = JSON.parse(fs.readFileSync(deployedAddressesPath, 'utf8'));
      console.log("📋 Found existing deployment:", existingDeployment);
    } catch (error) {
      console.log("⚠️ Could not read existing deployment file");
    }
  }
  
  // Test if existing contracts are still working
  if (existingDeployment) {
    console.log("🔍 Testing existing contracts...");
    
    try {
      // Test if governance contract is working
      const governance = await ethers.getContractAt("CivicXChainGovernance", existingDeployment.GOVERNANCE_CONTRACT);
      const nextId = await governance.nextCommitmentId();
      console.log("✅ Governance contract working - Next ID:", nextId.toString());
      
      // Test if oracle contract is working  
      const oracle = await ethers.getContractAt("EnvironmentalDataOracle", existingDeployment.ENVIRONMENTAL_ORACLE);
      const pm25Data = await oracle.getLatestPM25Data();
      console.log("✅ Oracle contract working - PM2.5:", pm25Data.toString());
      
      console.log("🎉 EXISTING CONTRACTS ARE WORKING! No need to redeploy.");
      console.log("=====================================");
      console.log("🏛️ CivicXChain Governance:", existingDeployment.GOVERNANCE_CONTRACT);
      console.log("📊 Environmental Oracle:", existingDeployment.ENVIRONMENTAL_ORACLE);
      console.log("=====================================");
      
      return existingDeployment;
      
    } catch (error) {
      console.log("❌ Existing contracts not working:", error.message);
      console.log("🔄 Will deploy fresh contracts...");
    }
  }
  
  // Deploy fresh contracts
  console.log("🚀 Deploying fresh contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Deploy Environmental Oracle
  console.log("\n📊 Deploying Environmental Oracle...");
  const EnvironmentalOracle = await ethers.getContractFactory("EnvironmentalDataOracle");
  const oracle = await EnvironmentalOracle.deploy();
  await oracle.deployed();
  console.log("Environmental Oracle deployed to:", oracle.address);

  // Deploy CivicXChain Governance (needs oracle feed addresses)
  console.log("\n🏛️ Deploying CivicXChain Governance...");
  const CivicXChainGovernance = await ethers.getContractFactory("CivicXChainGovernance");

  // Use the oracle address for all three feeds (simplified setup)
  const governance = await CivicXChainGovernance.deploy(
    oracle.address, // PM2.5 feed
    oracle.address, // AQI feed
    oracle.address  // Forest cover feed
  );
  await governance.deployed();
  console.log("CivicXChain Governance deployed to:", governance.address);

  // Test deployments
  console.log("\n🧪 Testing deployments...");
  try {
    // Test oracle with some initial data
    await oracle.updatePM25Data(988); // Set initial PM2.5 value
    const pm25Test = await oracle.getLatestPM25Data();
    console.log("✅ Oracle PM2.5 test:", pm25Test.toString());

    // Test governance
    const nextIdTest = await governance.nextCommitmentId();
    console.log("✅ Governance test:", nextIdTest.toString(), "next commitment ID");
  } catch (error) {
    console.error("❌ Contract testing failed:", error.message);
    throw error;
  }

  // Save deployment info
  const deploymentInfo = {
    ENVIRONMENTAL_ORACLE: oracle.address,
    GOVERNANCE_CONTRACT: governance.address,
    COMMITMENT_CONTRACT: governance.address, // Same contract
    CIVIC_TOKEN: governance.address, // Same contract  
    DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
    NETWORK: "localhost",
    CHAIN_ID: 31337
  };

  // Ensure directory exists
  const configDir = path.dirname(deployedAddressesPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(deployedAddressesPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📝 Contract addresses saved to:", deployedAddressesPath);

  console.log("\n🎉 Deployment Complete!");
  console.log("=====================================");
  console.log("🏛️ CivicXChain Governance:", governance.address);
  console.log("📊 Environmental Oracle:", oracle.address);
  console.log("=====================================");
  
  return deploymentInfo;
}

// Run deployment
smartDeploy()
  .then((deployment) => {
    console.log("✅ Smart deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Smart deployment failed:", error);
    process.exit(1);
  });
