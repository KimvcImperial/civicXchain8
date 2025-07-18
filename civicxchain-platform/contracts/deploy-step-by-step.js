// Step by step deployment to debug the issue
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  const MockAggregator = await ethers.getContractFactory("MockAggregator");
  
  // Deploy PM2.5 Oracle
  console.log("\n📊 Deploying PM2.5 Oracle...");
  const pm25Value = 1400; // 14.00 μg/m³ with 2 decimal places
  const pm25Feed = await MockAggregator.deploy(pm25Value, 8);
  await pm25Feed.deployed();
  console.log("PM2.5 Oracle deployed at:", pm25Feed.address);
  
  // Test PM2.5 Oracle immediately
  try {
    const pm25Data = await pm25Feed.latestRoundData();
    console.log("✅ PM2.5 Oracle test successful:", pm25Data.answer.toString());
  } catch (error) {
    console.log("❌ PM2.5 Oracle test failed:", error.message);
  }
  
  // Deploy CO2 Oracle
  console.log("\n🌍 Deploying CO2 Oracle...");
  const co2Value = 42000; // 420.00 ppm with 2 decimal places
  const co2Feed = await MockAggregator.deploy(co2Value, 8);
  await co2Feed.deployed();
  console.log("CO2 Oracle deployed at:", co2Feed.address);
  
  // Test CO2 Oracle immediately
  try {
    const co2Data = await co2Feed.latestRoundData();
    console.log("✅ CO2 Oracle test successful:", co2Data.answer.toString());
  } catch (error) {
    console.log("❌ CO2 Oracle test failed:", error.message);
  }
  
  // Test PM2.5 Oracle again to see if it's still working
  try {
    const pm25Data = await pm25Feed.latestRoundData();
    console.log("✅ PM2.5 Oracle still working:", pm25Data.answer.toString());
  } catch (error) {
    console.log("❌ PM2.5 Oracle stopped working:", error.message);
  }
  
  // Deploy Forest Oracle
  console.log("\n🌳 Deploying Forest Oracle...");
  const forestValue = 7500; // 75.00% with 2 decimal places
  const forestFeed = await MockAggregator.deploy(forestValue, 8);
  await forestFeed.deployed();
  console.log("Forest Oracle deployed at:", forestFeed.address);
  
  // Test Forest Oracle immediately
  try {
    const forestData = await forestFeed.latestRoundData();
    console.log("✅ Forest Oracle test successful:", forestData.answer.toString());
  } catch (error) {
    console.log("❌ Forest Oracle test failed:", error.message);
  }
  
  // Test all oracles again
  console.log("\n🧪 Final test of all oracles...");
  
  try {
    const pm25Data = await pm25Feed.latestRoundData();
    console.log("✅ PM2.5 Oracle final test:", pm25Data.answer.toString());
  } catch (error) {
    console.log("❌ PM2.5 Oracle final test failed:", error.message);
  }
  
  try {
    const co2Data = await co2Feed.latestRoundData();
    console.log("✅ CO2 Oracle final test:", co2Data.answer.toString());
  } catch (error) {
    console.log("❌ CO2 Oracle final test failed:", error.message);
  }
  
  try {
    const forestData = await forestFeed.latestRoundData();
    console.log("✅ Forest Oracle final test:", forestData.answer.toString());
  } catch (error) {
    console.log("❌ Forest Oracle final test failed:", error.message);
  }
  
  console.log("\n📋 Contract addresses:");
  console.log("PM2.5 Oracle:", pm25Feed.address);
  console.log("CO2 Oracle:", co2Feed.address);
  console.log("Forest Oracle:", forestFeed.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
