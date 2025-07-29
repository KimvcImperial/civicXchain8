const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting Simple CivicXChain Deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy Environmental Oracle (for real environmental data)
  console.log("\n📊 Deploying Environmental Oracle...");
  const EnvironmentalOracle = await ethers.getContractFactory("EnvironmentalDataOracle");
  const oracle = await EnvironmentalOracle.deploy();
  await oracle.deployed();
  const oracleAddress = oracle.address;
  console.log("Environmental Oracle deployed to:", oracleAddress);

  // Deploy CivicXChain Governance (main contract with ETH staking)
  console.log("\n🏛️ Deploying CivicXChain Governance...");
  const CivicGovernance = await ethers.getContractFactory("CivicXChainGovernance");
  const governance = await CivicGovernance.deploy(
    oracleAddress, // PM2.5 feed
    oracleAddress, // AQI feed
    oracleAddress  // Forest cover feed
  );
  await governance.deployed();
  const governanceAddress = governance.address;
  console.log("CivicXChain Governance deployed to:", governanceAddress);

  // Test deployments
  console.log("\n🧪 Testing deployments...");
  try {
    const pm25Data = await oracle.getLatestPM25Data();
    console.log("✅ Oracle PM2.5 test:", pm25Data.toString());
    
    const nextId = await governance.nextCommitmentId();
    console.log("✅ Governance test:", nextId.toString(), "next commitment ID");
  } catch (error) {
    console.log("⚠️ Test failed but contracts deployed:", error.message);
  }

  // Save addresses to config file
  const addresses = {
    ENVIRONMENTAL_ORACLE: oracleAddress,
    GOVERNANCE_CONTRACT: governanceAddress,
    COMMITMENT_CONTRACT: governanceAddress, // Same contract handles commitments
    CIVIC_TOKEN: governanceAddress, // Same contract is also ERC20 token
    DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
    NETWORK: "localhost",
    CHAIN_ID: 31337
  };

  // Save to frontend config
  const configPath = path.join(__dirname, '../../frontend/config/deployed-addresses.json');
  fs.writeFileSync(configPath, JSON.stringify(addresses, null, 2));
  console.log("\n📝 Contract addresses saved to:", configPath);

  console.log("\n🎉 Deployment Complete!");
  console.log("=====================================");
  console.log("🏛️ CivicXChain Governance:", governanceAddress);
  console.log("📊 Environmental Oracle:", oracleAddress);
  console.log("=====================================");

  return { governance: governanceAddress, oracle: oracleAddress };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
