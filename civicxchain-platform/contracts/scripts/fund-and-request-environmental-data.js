const { ethers } = require("hardhat");

async function main() {
  console.log("💰 FUNDING CHAINLINK ORACLE & REQUESTING ENVIRONMENTAL DATA");
  console.log("🔗 This will fund the oracle with LINK and request real API data");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);

  // Get oracle address from environment or deployment
  const oracleAddress = process.env.CHAINLINK_ENVIRONMENTAL_ORACLE || process.env.ENVIRONMENTAL_ORACLE;
  
  if (!oracleAddress) {
    console.error("❌ Oracle address not found. Please deploy the oracle first.");
    process.exit(1);
  }

  console.log("🔗 Oracle address:", oracleAddress);

  try {
    // Connect to the Chainlink Environmental Oracle
    const oracle = await ethers.getContractAt("ChainlinkEnvironmentalOracle", oracleAddress);
    console.log("✅ Connected to Chainlink Environmental Oracle");

    // Connect to LINK token contract on Sepolia
    const linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
    const linkToken = await ethers.getContractAt("LinkTokenInterface", linkTokenAddress);
    
    // Check LINK balance
    const linkBalance = await linkToken.balanceOf(deployer.address);
    console.log("💰 Your LINK balance:", ethers.utils.formatEther(linkBalance), "LINK");

    if (linkBalance.lt(ethers.utils.parseEther("1"))) {
      console.log("⚠️ Low LINK balance. You need LINK tokens to request data from APIs.");
      console.log("🔗 Get LINK tokens from: https://faucets.chain.link/sepolia");
      console.log("💡 You need at least 1 LINK to make API requests");
    }

    // Check oracle's LINK balance
    const oracleLinkBalance = await linkToken.balanceOf(oracleAddress);
    console.log("🔗 Oracle LINK balance:", ethers.utils.formatEther(oracleLinkBalance), "LINK");

    // Fund oracle with LINK if needed
    if (oracleLinkBalance.lt(ethers.utils.parseEther("0.5")) && linkBalance.gte(ethers.utils.parseEther("1"))) {
      console.log("\n💰 Funding oracle with LINK tokens...");
      const fundAmount = ethers.utils.parseEther("1"); // Send 1 LINK
      
      const fundTx = await linkToken.transfer(oracleAddress, fundAmount);
      await fundTx.wait();
      
      console.log("✅ Funded oracle with 1 LINK");
      console.log("📄 Transaction:", fundTx.hash);
    }

    // Request environmental data from APIs
    console.log("\n🌍 Requesting environmental data from real APIs...");
    
    try {
      // Request PM2.5 data from OpenAQ
      console.log("🌫️ Requesting PM2.5 data from OpenAQ API...");
      const pm25Tx = await oracle.requestPM25Data("New York");
      await pm25Tx.wait();
      console.log("✅ PM2.5 request sent:", pm25Tx.hash);

      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Request CO2 data from NASA
      console.log("🏭 Requesting CO2 data from NASA POWER API...");
      const co2Tx = await oracle.requestCO2Data("40.7128", "-74.0060"); // NYC coordinates
      await co2Tx.wait();
      console.log("✅ CO2 request sent:", co2Tx.hash);

      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Request Forest Cover data from NASA Earth
      console.log("🌳 Requesting Forest Cover data from NASA Earth API...");
      const forestTx = await oracle.requestForestCoverData("40.7128", "-74.0060");
      await forestTx.wait();
      console.log("✅ Forest Cover request sent:", forestTx.hash);

    } catch (requestError) {
      console.log("⚠️ Request error:", requestError.message);
      console.log("💡 Make sure the oracle has enough LINK tokens");
    }

    // Check current data
    console.log("\n📊 Current Environmental Data:");
    try {
      const pm25Value = await oracle.getLatestPM25Data();
      const co2Value = await oracle.getLatestCO2Data();
      const forestValue = await oracle.getLatestForestCoverData();

      console.log("   🌫️  PM2.5:", (pm25Value / 100).toFixed(2), "μg/m³");
      console.log("   🏭 CO2:", (co2Value / 100).toFixed(2), "ppm");
      console.log("   🌳 Forest Cover:", (forestValue / 100).toFixed(2), "%");
    } catch (dataError) {
      console.log("⚠️ Error reading data:", dataError.message);
    }

    console.log("\n🎉 ENVIRONMENTAL DATA REQUESTS COMPLETED!");
    console.log("=====================================");
    console.log("⏰ API responses will arrive in 1-2 minutes");
    console.log("🔄 Data will be automatically updated in the oracle");
    console.log("📊 Your frontend will show the real environmental data");
    console.log("");
    console.log("🔍 Monitor requests on Chainlink:");
    console.log("   https://sepolia.chain.link/");
    console.log("");
    console.log("📡 Data Sources:");
    console.log("   🌫️  PM2.5: OpenAQ API (Real air quality data)");
    console.log("   🏭 CO2: NASA POWER API (Real atmospheric data)");
    console.log("   🌳 Forest: NASA Earth API (Real satellite data)");

  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 You need more Sepolia ETH for gas fees");
    } else if (error.message.includes("LINK")) {
      console.log("💡 You need LINK tokens. Get them from: https://faucets.chain.link/sepolia");
    }
    
    process.exit(1);
  }
}

// Helper function to monitor oracle responses
async function monitorOracleResponses(oracleAddress) {
  console.log("\n👀 Monitoring oracle responses...");
  
  const oracle = await ethers.getContractAt("ChainlinkEnvironmentalOracle", oracleAddress);
  
  // Listen for EnvironmentalDataReceived events
  oracle.on("EnvironmentalDataReceived", (requestId, metric, value, event) => {
    console.log(`📊 ${metric.toUpperCase()} data received:`, (value / 100).toFixed(2));
    console.log(`   Request ID: ${requestId}`);
    console.log(`   Block: ${event.blockNumber}`);
  });

  console.log("✅ Listening for oracle responses...");
  console.log("⏹️  Press Ctrl+C to stop monitoring");
}

// Run monitoring if requested
if (process.argv.includes("--monitor")) {
  const oracleAddress = process.env.CHAINLINK_ENVIRONMENTAL_ORACLE || process.env.ENVIRONMENTAL_ORACLE;
  if (oracleAddress) {
    monitorOracleResponses(oracleAddress);
  }
} else {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
