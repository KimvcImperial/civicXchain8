// Quick script to check current oracle data
const { ethers } = require("hardhat");

// Set the network to localhost
require("hardhat").config.defaultNetwork = "localhost";

async function main() {
  console.log("📊 Checking Current Oracle Data...");
  console.log("=" .repeat(50));
  
  // Get contract instances
  const MockAggregator = await ethers.getContractFactory("MockAggregator");
  
  // Connect to deployed oracles
  const pm25Oracle = MockAggregator.attach("0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1");
  const co2Oracle = MockAggregator.attach("0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE");
  const forestOracle = MockAggregator.attach("0x68B1D87F95878fE05B998F19b66F4baba5De1aed");
  
  try {
    // Get current values and timestamps
    const [pm25Data, co2Data, forestData] = await Promise.all([
      pm25Oracle.latestRoundData(),
      co2Oracle.latestRoundData(),
      forestOracle.latestRoundData()
    ]);
    
    const pm25Value = pm25Data[1];
    const co2Value = co2Data[1];
    const forestValue = forestData[1];
    
    const pm25Timestamp = new Date(pm25Data[3] * 1000);
    const co2Timestamp = new Date(co2Data[3] * 1000);
    const forestTimestamp = new Date(forestData[3] * 1000);
    
    console.log("🌬️ PM2.5 Air Quality:");
    console.log(`   Value: ${(pm25Value/100).toFixed(2)} μg/m³`);
    console.log(`   Updated: ${pm25Timestamp.toLocaleString()}`);
    console.log(`   Round: ${pm25Data[0]}`);
    
    console.log("\n🌍 CO2 Levels:");
    console.log(`   Value: ${(co2Value/100).toFixed(2)} ppm`);
    console.log(`   Updated: ${co2Timestamp.toLocaleString()}`);
    console.log(`   Round: ${co2Data[0]}`);
    
    console.log("\n🌳 Forest Cover:");
    console.log(`   Value: ${(forestValue/100).toFixed(2)}%`);
    console.log(`   Updated: ${forestTimestamp.toLocaleString()}`);
    console.log(`   Round: ${forestData[0]}`);
    
    // Check if data is recent (within last 2 minutes)
    const now = Date.now();
    const isRecentPM25 = (now - pm25Timestamp.getTime()) < 120000;
    const isRecentCO2 = (now - co2Timestamp.getTime()) < 120000;
    const isRecentForest = (now - forestTimestamp.getTime()) < 120000;
    
    console.log("\n📡 Data Freshness:");
    console.log(`   PM2.5: ${isRecentPM25 ? '✅ LIVE' : '⚠️ STALE'}`);
    console.log(`   CO2: ${isRecentCO2 ? '✅ LIVE' : '⚠️ STALE'}`);
    console.log(`   Forest: ${isRecentForest ? '✅ LIVE' : '⚠️ STALE'}`);
    
    if (isRecentPM25 && isRecentCO2 && isRecentForest) {
      console.log("\n🎉 All oracle data is LIVE and updating!");
    } else {
      console.log("\n⚠️ Some oracle data may be stale. Check if live-oracle-updater.js is running.");
    }
    
  } catch (error) {
    console.error("❌ Error reading oracle data:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
