// Hardhat deployment script
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting CivicXChain deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Deploy EnvironmentalDataOracle contracts for real environmental data
  const EnvironmentalDataOracle = await ethers.getContractFactory("EnvironmentalDataOracle");
  
  console.log("\n📊 Deploying PM2.5 Oracle...");
  const pm25Feed = await EnvironmentalDataOracle.deploy();
  await pm25Feed.deployed();
  console.log("PM2.5 Oracle deployed to:", pm25Feed.address);

  console.log("\n🌍 Deploying CO2 Oracle...");
  const co2Feed = await EnvironmentalDataOracle.deploy();
  await co2Feed.deployed();
  console.log("CO2 Oracle deployed to:", co2Feed.address);

  console.log("\n🌳 Deploying Forest Cover Oracle...");
  const forestFeed = await EnvironmentalDataOracle.deploy();
  await forestFeed.deployed();
  console.log("Forest Cover Oracle deployed to:", forestFeed.address);

  // Deploy CivicXChain Governance contract
  console.log("\n🏛️ Deploying CivicXChain Governance...");
  const CivicXChainGovernance = await ethers.getContractFactory("CivicXChainGovernance");
  const governance = await CivicXChainGovernance.deploy(
    pm25Feed.address,
    co2Feed.address,
    forestFeed.address
  );
  await governance.deployed();
  console.log("CivicXChain Governance deployed to:", governance.address);

  // Test the deployments
  console.log("\n🧪 Testing deployments...");

  try {
    const pm25Data = await pm25Feed.getLatestPM25Data();
    console.log("✅ PM2.5 Oracle test:", pm25Data.toString());

    const co2Data = await co2Feed.getLatestCO2Data();
    console.log("✅ CO2 Oracle test:", co2Data.toString());

    const forestData = await forestFeed.getLatestForestCoverData();
    console.log("✅ Forest Oracle test:", forestData.toString());

    const nextId = await governance.nextCommitmentId();
    console.log("✅ Governance test:", nextId.toString(), "next commitment ID");

  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }

  console.log("\n🎉 Deployment Complete!");
  console.log("=====================================");
  console.log("🏛️ CivicXChain Governance:", governance.address);
  console.log("📊 PM2.5 Oracle:", pm25Feed.address);
  console.log("🌍 CO2 Oracle:", co2Feed.address);
  console.log("🌳 Forest Cover Oracle:", forestFeed.address);
  console.log("=====================================");
  
  // Save addresses to a file for frontend
  const addresses = {
    governance: governance.address,
    pm25Oracle: pm25Feed.address,
    co2Oracle: co2Feed.address,
    forestOracle: forestFeed.address,
    deployer: deployer.address
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
  console.log("📝 Contract addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
