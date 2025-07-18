// Simple deployment script for mock oracle contracts
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Mock Oracle Contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Deploy Mock Oracle Contracts
  console.log("\n📊 Deploying Mock Oracle Contracts...");
  
  const MockAggregator = await ethers.getContractFactory("MockAggregator");
  
  // Deploy PM2.5 Oracle with realistic data (14.50 μg/m³)
  console.log("Deploying PM2.5 Oracle...");
  const pm25Oracle = await MockAggregator.deploy(1450, 8);
  await pm25Oracle.deployed();
  console.log("✅ PM2.5 Oracle deployed to:", pm25Oracle.address);
  
  // Deploy CO2 Oracle with realistic data (415.20 ppm)
  console.log("Deploying CO2 Oracle...");
  const co2Oracle = await MockAggregator.deploy(41520, 8);
  await co2Oracle.deployed();
  console.log("✅ CO2 Oracle deployed to:", co2Oracle.address);
  
  // Deploy Forest Oracle with realistic data (68.50%)
  console.log("Deploying Forest Oracle...");
  const forestOracle = await MockAggregator.deploy(6850, 8);
  await forestOracle.deployed();
  console.log("✅ Forest Oracle deployed to:", forestOracle.address);

  // Test the deployments
  console.log("\n🧪 Testing Oracle Deployments...");
  
  try {
    const pm25Data = await pm25Oracle.latestRoundData();
    console.log("✅ PM2.5 Oracle test:", (Number(pm25Data.answer) / 100).toFixed(2), "μg/m³");
    
    const co2Data = await co2Oracle.latestRoundData();
    console.log("✅ CO2 Oracle test:", (Number(co2Data.answer) / 100).toFixed(2), "ppm");
    
    const forestData = await forestOracle.latestRoundData();
    console.log("✅ Forest Oracle test:", (Number(forestData.answer) / 100).toFixed(2), "%");
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }

  // Output contract addresses for frontend configuration
  console.log("\n📋 Contract Addresses for Frontend Configuration:");
  console.log("PM25_ORACLE:", pm25Oracle.address);
  console.log("CO2_ORACLE:", co2Oracle.address);
  console.log("FOREST_ORACLE:", forestOracle.address);
  
  console.log("\n✅ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
