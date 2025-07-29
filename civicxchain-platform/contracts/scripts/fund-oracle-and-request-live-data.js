const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 FUNDING CHAINLINK ORACLE & REQUESTING LIVE ENVIRONMENTAL DATA");
  console.log("🌍 This will request real data from NASA API, OpenAQ, etc.");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);

  // Use the new Chainlink Environmental Oracle
  const oracleAddress = "0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD";
  console.log("🔗 Chainlink Oracle address:", oracleAddress);

  try {
    // Connect to the Chainlink Environmental Oracle
    const oracle = await ethers.getContractAt("ChainlinkEnvironmentalOracle", oracleAddress);
    console.log("✅ Connected to Chainlink Environmental Oracle");

    // Connect to LINK token contract on Sepolia
    const linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
    const linkABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function decimals() view returns (uint8)"
    ];
    const linkToken = new ethers.Contract(linkTokenAddress, linkABI, deployer);
    
    // Check LINK balance
    const linkBalance = await linkToken.balanceOf(deployer.address);
    console.log("💰 Your LINK balance:", ethers.utils.formatEther(linkBalance), "LINK");

    // Check oracle's LINK balance
    const oracleLinkBalance = await linkToken.balanceOf(oracleAddress);
    console.log("🔗 Oracle LINK balance:", ethers.utils.formatEther(oracleLinkBalance), "LINK");

    if (linkBalance.lt(ethers.utils.parseEther("0.1"))) {
      console.log("\n⚠️ You need LINK tokens to request data from APIs!");
      console.log("🔗 Get LINK tokens from: https://faucets.chain.link/sepolia");
      console.log("💡 You need at least 0.5 LINK to make API requests");
      console.log("📋 Steps:");
      console.log("   1. Go to https://faucets.chain.link/sepolia");
      console.log("   2. Connect your wallet");
      console.log("   3. Request LINK tokens");
      console.log("   4. Run this script again");
      
      // Still show current data even without LINK
      console.log("\n📊 Current Environmental Data (initial values):");
      const pm25Value = await oracle.getLatestPM25Data();
      const co2Value = await oracle.getLatestCO2Data();
      const forestValue = await oracle.getLatestForestCoverData();

      console.log("   🌫️  PM2.5:", (pm25Value / 100).toFixed(2), "μg/m³");
      console.log("   🏭 CO2:", (co2Value / 100).toFixed(2), "ppm");
      console.log("   🌳 Forest Cover:", (forestValue / 100).toFixed(2), "%");
      
      return;
    }

    // Fund oracle with LINK if needed
    if (oracleLinkBalance.lt(ethers.utils.parseEther("0.5")) && linkBalance.gte(ethers.utils.parseEther("1"))) {
      console.log("\n💰 Funding oracle with LINK tokens...");
      const fundAmount = ethers.utils.parseEther("1"); // Send 1 LINK
      
      const fundTx = await linkToken.transfer(oracleAddress, fundAmount);
      await fundTx.wait();
      
      console.log("✅ Funded oracle with 1 LINK");
      console.log("📄 Transaction:", fundTx.hash);
    }

    // Request environmental data from real APIs
    console.log("\n🌍 Requesting LIVE environmental data from real APIs...");
    console.log("📡 This will take 1-2 minutes to get responses from Chainlink oracles");
    
    try {
      // Request PM2.5 data from OpenAQ API
      console.log("\n🌫️ Requesting PM2.5 data from OpenAQ API...");
      console.log("   📍 Location: New York City");
      console.log("   🔗 API: https://api.openaq.org/v2/latest");
      
      const pm25Tx = await oracle.requestPM25Data("New York");
      await pm25Tx.wait();
      console.log("✅ PM2.5 request sent to Chainlink:", pm25Tx.hash);

      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Request CO2 data from NASA POWER API
      console.log("\n🏭 Requesting CO2 data from NASA POWER API...");
      console.log("   📍 Coordinates: NYC (40.7128, -74.0060)");
      console.log("   🔗 API: https://power.larc.nasa.gov/api/temporal/daily/point");
      
      const co2Tx = await oracle.requestCO2Data("40.7128", "-74.0060");
      await co2Tx.wait();
      console.log("✅ CO2 request sent to Chainlink:", co2Tx.hash);

      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Request Forest Cover data from NASA Earth API
      console.log("\n🌳 Requesting Forest Cover data from NASA Earth API...");
      console.log("   📍 Coordinates: NYC (40.7128, -74.0060)");
      console.log("   🔗 API: https://api.nasa.gov/planetary/earth/statistics");
      
      const forestTx = await oracle.requestForestCoverData("40.7128", "-74.0060");
      await forestTx.wait();
      console.log("✅ Forest Cover request sent to Chainlink:", forestTx.hash);

      console.log("\n🎉 ALL API REQUESTS SENT TO CHAINLINK!");
      console.log("=====================================");
      console.log("⏰ Chainlink oracles are now fetching data from:");
      console.log("   🌫️  OpenAQ API (Real PM2.5 air quality data)");
      console.log("   🏭 NASA POWER API (Real atmospheric data)");
      console.log("   🌳 NASA Earth API (Real satellite vegetation data)");
      console.log("");
      console.log("📡 Responses will arrive in 1-2 minutes");
      console.log("🔄 Your React frontend will automatically show updated data");
      console.log("🔍 Monitor on Chainlink: https://sepolia.chain.link/");

    } catch (requestError) {
      console.log("⚠️ Request error:", requestError.message);
      console.log("💡 Make sure the oracle has enough LINK tokens");
      
      if (requestError.message.includes("insufficient funds")) {
        console.log("💰 Need more LINK tokens for API requests");
      }
    }

    // Show current data
    console.log("\n📊 Current Environmental Data:");
    try {
      const pm25Value = await oracle.getLatestPM25Data();
      const co2Value = await oracle.getLatestCO2Data();
      const forestValue = await oracle.getLatestForestCoverData();

      console.log("   🌫️  PM2.5:", (pm25Value / 100).toFixed(2), "μg/m³");
      console.log("   🏭 CO2:", (co2Value / 100).toFixed(2), "ppm");
      console.log("   🌳 Forest Cover:", (forestValue / 100).toFixed(2), "%");
      console.log("");
      console.log("🔄 Data will update automatically when Chainlink responses arrive");
    } catch (dataError) {
      console.log("⚠️ Error reading data:", dataError.message);
    }

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

// Monitor oracle responses
async function monitorResponses() {
  console.log("\n👀 Monitoring for Chainlink oracle responses...");
  console.log("⏹️  Press Ctrl+C to stop monitoring\n");
  
  const oracleAddress = "0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD";
  const oracle = await ethers.getContractAt("ChainlinkEnvironmentalOracle", oracleAddress);
  
  // Listen for EnvironmentalDataReceived events
  oracle.on("EnvironmentalDataReceived", (requestId, metric, value, event) => {
    console.log(`🎉 ${metric.toUpperCase()} data received from API!`);
    console.log(`   📊 Value: ${(value / 100).toFixed(2)}`);
    console.log(`   🔗 Request ID: ${requestId}`);
    console.log(`   📦 Block: ${event.blockNumber}`);
    console.log(`   ⏰ ${new Date().toLocaleTimeString()}\n`);
  });

  console.log("✅ Listening for real-time oracle responses...");
}

// Run monitoring if requested
if (process.argv.includes("--monitor")) {
  monitorResponses();
} else {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
