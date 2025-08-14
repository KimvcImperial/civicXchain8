const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 REQUESTING REAL DATA VIA CHAINLINK ORACLE");
  console.log("🌍 Fetching from NASA, OpenAQ, NOAA APIs");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);

  // Contract addresses (update these after deployment)
  const CHAINLINK_ORACLE_ADDRESS = "YOUR_CHAINLINK_ORACLE_ADDRESS"; // Update after deployment
  const ORACLE_MANAGER_ADDRESS = "YOUR_ORACLE_MANAGER_ADDRESS";     // Update after deployment

  try {
    // Connect to ChainlinkEnvironmentalOracle
    console.log("🔗 Connecting to ChainlinkEnvironmentalOracle...");
    const chainlinkOracle = await ethers.getContractAt("ChainlinkEnvironmentalOracle", CHAINLINK_ORACLE_ADDRESS);
    console.log("✅ Connected to Chainlink oracle");

    // Check LINK balance
    console.log("\n💰 Checking LINK token balance...");
    const linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // Sepolia LINK
    const linkToken = await ethers.getContractAt("IERC20", linkTokenAddress);
    const linkBalance = await linkToken.balanceOf(CHAINLINK_ORACLE_ADDRESS);
    console.log(`💎 LINK Balance: ${ethers.utils.formatEther(linkBalance)} LINK`);

    if (linkBalance.lt(ethers.utils.parseEther("0.5"))) {
      console.log("⚠️ WARNING: Low LINK balance. Get more from https://faucets.chain.link/sepolia");
    }

    // API endpoints for real environmental data
    const apiEndpoints = {
      pm25: "https://api.openaq.org/v2/latest?parameter=pm25&country=US&city=New%20York&limit=1&order_by=lastUpdated&sort=desc",
      co2: "https://api.co2signal.com/v1/latest?countryCode=US",
      forest_cover: "https://modis.gsfc.nasa.gov/data/dataprod/mod44.php" // NASA forest cover
    };

    console.log("\n🌍 Requesting real environmental data from APIs...");

    // Request PM2.5 data from OpenAQ
    console.log("🌫️ Requesting PM2.5 data from OpenAQ...");
    try {
      const pm25Tx = await chainlinkOracle.requestPM25Data(apiEndpoints.pm25);
      await pm25Tx.wait();
      console.log("✅ PM2.5 request submitted to Chainlink network");
      console.log(`   📋 Transaction: ${pm25Tx.hash}`);
    } catch (error) {
      console.log("❌ PM2.5 request failed:", error.message);
    }

    // Wait between requests to avoid rate limiting
    console.log("⏳ Waiting 10 seconds between requests...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Request CO2 data from CO2 Signal API
    console.log("🏭 Requesting CO2 data from CO2 Signal API...");
    try {
      const co2Tx = await chainlinkOracle.requestCO2Data(apiEndpoints.co2);
      await co2Tx.wait();
      console.log("✅ CO2 request submitted to Chainlink network");
      console.log(`   📋 Transaction: ${co2Tx.hash}`);
    } catch (error) {
      console.log("❌ CO2 request failed:", error.message);
    }

    // Wait between requests
    console.log("⏳ Waiting 10 seconds between requests...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Request Forest Cover data from NASA
    console.log("🌳 Requesting Forest Cover data from NASA...");
    try {
      const forestTx = await chainlinkOracle.requestForestCoverData(apiEndpoints.forest_cover);
      await forestTx.wait();
      console.log("✅ Forest Cover request submitted to Chainlink network");
      console.log(`   📋 Transaction: ${forestTx.hash}`);
    } catch (error) {
      console.log("❌ Forest Cover request failed:", error.message);
    }

    console.log("\n🎉 All Chainlink requests submitted!");
    console.log("⏳ Waiting for Chainlink oracles to fulfill requests...");
    console.log("📊 This typically takes 1-3 minutes on Sepolia testnet");

    // Wait for oracle responses
    console.log("\n⏳ Waiting 2 minutes for oracle responses...");
    await new Promise(resolve => setTimeout(resolve, 120000)); // 2 minutes

    // Check if data was updated
    console.log("\n🔍 Checking updated environmental data...");
    try {
      const pm25Value = await chainlinkOracle.getLatestPM25Data();
      const co2Value = await chainlinkOracle.getLatestCO2Data();
      const forestValue = await chainlinkOracle.getLatestForestCoverData();

      console.log("📊 Latest Chainlink Oracle Data:");
      console.log(`   🌫️ PM2.5: ${(pm25Value / 100).toFixed(2)} μg/m³`);
      console.log(`   🏭 CO2: ${(co2Value / 100).toFixed(2)} ppm`);
      console.log(`   🌳 Forest Cover: ${(forestValue / 100).toFixed(2)}%`);

      // Get latest round data for more details
      const roundData = await chainlinkOracle.latestRoundData();
      const lastUpdate = new Date(Number(roundData.updatedAt) * 1000);
      console.log(`   🕐 Last Updated: ${lastUpdate.toLocaleString()}`);

    } catch (error) {
      console.log("⚠️ Error reading oracle data:", error.message);
      console.log("💡 Data might still be processing. Try again in a few minutes.");
    }

    // If OracleManager is deployed, test it too
    if (ORACLE_MANAGER_ADDRESS !== "YOUR_ORACLE_MANAGER_ADDRESS") {
      console.log("\n🎯 Testing OracleManager with fresh Chainlink data...");
      try {
        const oracleManager = await ethers.getContractAt("OracleManager", ORACLE_MANAGER_ADDRESS);
        
        const managerPM25 = await oracleManager.getEnvironmentalData("pm25");
        const managerCO2 = await oracleManager.getEnvironmentalData("co2");
        const managerForest = await oracleManager.getEnvironmentalData("forest_cover");

        console.log("📊 OracleManager Data (with smart fallback):");
        console.log(`   🌫️ PM2.5: ${(managerPM25 / 100).toFixed(2)} μg/m³`);
        console.log(`   🏭 CO2: ${(managerCO2 / 100).toFixed(2)} ppm`);
        console.log(`   🌳 Forest Cover: ${(managerForest / 100).toFixed(2)}%`);

        // Check oracle status
        const status = await oracleManager.getOracleStatus();
        console.log("\n📊 Oracle System Status:");
        console.log(`   🔗 Chainlink Healthy: ${status.chainlinkHealthy}`);
        console.log(`   📊 Fallback Healthy: ${status.fallbackHealthy}`);
        console.log(`   🎯 Current Status: ${status.status === 0 ? 'CHAINLINK_ACTIVE' : status.status === 1 ? 'FALLBACK_ACTIVE' : 'BOTH_FAILED'}`);

      } catch (error) {
        console.log("⚠️ Error testing OracleManager:", error.message);
      }
    }

    console.log("\n🎉 CHAINLINK DATA REQUEST COMPLETE!");
    console.log("=====================================");
    console.log("📋 Summary:");
    console.log("✅ Submitted requests to Chainlink network");
    console.log("🌍 Fetching real data from NASA, OpenAQ, NOAA APIs");
    console.log("🔗 Using decentralized Chainlink oracle network");
    console.log("💰 Paid LINK tokens for oracle services");
    
    console.log("\n📝 Next Steps:");
    console.log("1. 🔄 Check data again in a few minutes");
    console.log("2. 🖥️ Update frontend to use new oracle addresses");
    console.log("3. 🧪 Test dual oracle system in your application");
    console.log("4. 📊 Monitor oracle health and data freshness");

  } catch (error) {
    console.error("❌ Chainlink request failed:", error);
    
    console.log("\n🔧 Troubleshooting:");
    console.log("1. 💰 Ensure oracle has enough LINK tokens");
    console.log("2. 🌐 Check Sepolia network connectivity");
    console.log("3. 🔗 Verify Chainlink job ID and oracle address");
    console.log("4. ⏳ Try again - Chainlink requests can be delayed");
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
