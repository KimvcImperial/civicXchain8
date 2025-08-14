const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 DEPLOYING DUAL ORACLE SYSTEM");
  console.log("🔗 Chainlink Primary + Fallback Architecture");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  // Existing fallback oracle address (already deployed)
  const EXISTING_FALLBACK_ORACLE = "0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD";
  console.log("📊 Using existing fallback oracle:", EXISTING_FALLBACK_ORACLE);

  try {
    // Step 1: Deploy ChainlinkEnvironmentalOracle
    console.log("🔗 Deploying ChainlinkEnvironmentalOracle...");
    const ChainlinkOracle = await ethers.getContractFactory("ChainlinkEnvironmentalOracle");
    const chainlinkOracle = await ChainlinkOracle.deploy();
    await chainlinkOracle.deployed();
    console.log("✅ ChainlinkEnvironmentalOracle deployed to:", chainlinkOracle.address);

    // Step 2: Deploy OracleManager
    console.log("\n🎯 Deploying OracleManager...");
    const OracleManager = await ethers.getContractFactory("OracleManager");
    const oracleManager = await OracleManager.deploy(
      chainlinkOracle.address,  // Chainlink oracle (primary)
      EXISTING_FALLBACK_ORACLE  // RealEnvironmentalOracle (fallback)
    );
    await oracleManager.deployed();
    console.log("✅ OracleManager deployed to:", oracleManager.address);

    // Step 3: Test the dual oracle system
    console.log("\n🧪 Testing Dual Oracle System...");
    
    // Test Chainlink oracle
    try {
      console.log("🔗 Testing Chainlink oracle...");
      const chainlinkPM25 = await chainlinkOracle.getLatestPM25Data();
      const chainlinkCO2 = await chainlinkOracle.getLatestCO2Data();
      const chainlinkForest = await chainlinkOracle.getLatestForestCoverData();
      
      console.log("✅ Chainlink Oracle Data:");
      console.log(`   🌫️ PM2.5: ${(chainlinkPM25 / 100).toFixed(2)} μg/m³`);
      console.log(`   🏭 CO2: ${(chainlinkCO2 / 100).toFixed(2)} ppm`);
      console.log(`   🌳 Forest Cover: ${(chainlinkForest / 100).toFixed(2)}%`);
    } catch (error) {
      console.log("⚠️ Chainlink oracle not ready yet (normal for fresh deployment)");
    }

    // Test fallback oracle
    try {
      console.log("\n📊 Testing Fallback oracle...");
      const fallbackOracle = await ethers.getContractAt("RealEnvironmentalOracle", EXISTING_FALLBACK_ORACLE);
      const fallbackPM25 = await fallbackOracle.getLatestPM25Data();
      const fallbackCO2 = await fallbackOracle.getLatestCO2Data();
      const fallbackForest = await fallbackOracle.getLatestForestCoverData();
      
      console.log("✅ Fallback Oracle Data:");
      console.log(`   🌫️ PM2.5: ${(fallbackPM25 / 100).toFixed(2)} μg/m³`);
      console.log(`   🏭 CO2: ${(fallbackCO2 / 100).toFixed(2)} ppm`);
      console.log(`   🌳 Forest Cover: ${(fallbackForest / 100).toFixed(2)}%`);
    } catch (error) {
      console.log("⚠️ Error testing fallback oracle:", error.message);
    }

    // Test OracleManager
    try {
      console.log("\n🎯 Testing OracleManager smart switching...");
      const managerPM25 = await oracleManager.getEnvironmentalData("pm25");
      const managerCO2 = await oracleManager.getEnvironmentalData("co2");
      const managerForest = await oracleManager.getEnvironmentalData("forest_cover");
      
      console.log("✅ OracleManager Data (with smart fallback):");
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

    // Step 4: Generate deployment summary
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("=====================================");
    console.log("📋 Contract Addresses:");
    console.log(`   🔗 ChainlinkEnvironmentalOracle: ${chainlinkOracle.address}`);
    console.log(`   📊 RealEnvironmentalOracle (Fallback): ${EXISTING_FALLBACK_ORACLE}`);
    console.log(`   🎯 OracleManager: ${oracleManager.address}`);
    
    console.log("\n📝 Next Steps:");
    console.log("1. 💰 Fund ChainlinkOracle with LINK tokens:");
    console.log(`   - Get LINK from: https://faucets.chain.link/sepolia`);
    console.log(`   - Send LINK to: ${chainlinkOracle.address}`);
    console.log("2. 🔄 Update frontend config with OracleManager address");
    console.log("3. 🧪 Test Chainlink requests with real API calls");
    console.log("4. 📊 Monitor oracle health via getOracleStatus()");

    // Step 5: Save deployment info
    const deploymentInfo = {
      network: "sepolia",
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        ChainlinkEnvironmentalOracle: chainlinkOracle.address,
        RealEnvironmentalOracle: EXISTING_FALLBACK_ORACLE,
        OracleManager: oracleManager.address
      },
      chainlinkConfig: {
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        oracle: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
        jobId: "ca98366cc7314957b8c012c72f05aeeb",
        fee: "100000000000000000" // 0.1 LINK
      }
    };

    console.log("\n💾 Deployment Info:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
