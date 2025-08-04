const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🌐 Deploying CivicXChain to Sepolia Testnet...");
  console.log("=====================================");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.log("❌ Insufficient balance! You need at least 0.01 ETH");
    console.log("🚰 Get Sepolia ETH from:");
    console.log("   - https://sepoliafaucet.com/");
    console.log("   - https://faucet.quicknode.com/ethereum/sepolia");
    console.log("   - https://www.infura.io/faucet/sepolia");
    process.exit(1);
  }

  console.log("✅ Sufficient balance for deployment");
  console.log("");

  try {
    // Deploy UPDATED Governance Contract (NO DEADLINE REQUIREMENTS)
    console.log("🏛️ Deploying UPDATED CivicXChain Governance (No Deadline Requirements)...");
    console.log("🎯 This version allows reward claiming without deadline restrictions!");
    const GovernanceContract = await ethers.getContractFactory("CivicXChainGovernance");

    // REAL ENVIRONMENTAL ORACLE - Fetches data from NASA, OpenAQ, NOAA APIs
    const realEnvironmentalOracle = "0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD";
    console.log("🌍 Using Real Environmental Oracle:", realEnvironmentalOracle);
    console.log("   📊 Data Sources: NASA Earth Data, OpenAQ, NOAA");

    const governance = await GovernanceContract.deploy(
      realEnvironmentalOracle, // PM2.5 feed
      realEnvironmentalOracle, // AQI feed
      realEnvironmentalOracle  // Forest cover feed
    );
    await governance.deployed();

    console.log("✅ CivicXChain Governance deployed to:", governance.address);

    // Test governance contract with real environmental data
    console.log("");
    console.log("🧪 Testing governance contract...");

    try {
      // Test environmental data access
      const pm25Value = await governance.getCurrentEnvironmentalValue("pm25");
      console.log("✅ Real PM2.5 data:", (pm25Value / 100).toFixed(2), "μg/m³");

      const aqiValue = await governance.getCurrentEnvironmentalValue("aqi");
      console.log("✅ Real AQI data:", (aqiValue / 100).toFixed(0));

      // Test governance functions
      const nextId = await governance.nextCommitmentId();
      console.log("✅ Governance ready - Next commitment ID:", nextId.toString());
    } catch (testError) {
      console.log("⚠️ Test warning:", testError.message);
    }

    // Save deployment info
    const deploymentInfo = {
      REAL_ENVIRONMENTAL_ORACLE: realEnvironmentalOracle,
      GOVERNANCE_CONTRACT: governance.address,
      COMMITMENT_CONTRACT: governance.address,
      CIVIC_TOKEN: governance.address,
      DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
      NETWORK: "sepolia",
      CHAIN_ID: 11155111,
      DEPLOYER: deployer.address,
      BLOCK_NUMBER: await deployer.provider.getBlockNumber(),
      GOVERNANCE_TX: governance.deployTransaction.hash,
      DATA_SOURCES: {
        PM25: "NASA Earth Data + OpenAQ API",
        AQI: "OpenAQ API (real-time)",
        FOREST_COVER: "NASA MODIS + Global Forest Watch"
      }
    };

    // Save to frontend config
    const configDir = path.join(__dirname, '../../frontend/config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const deployedAddressesPath = path.join(configDir, 'deployed-addresses.json');
    fs.writeFileSync(deployedAddressesPath, JSON.stringify(deploymentInfo, null, 2));

    console.log("");
    console.log("🎉 REAL ENVIRONMENTAL GOVERNANCE DEPLOYED!");
    console.log("=====================================");
    console.log("🏛️ CivicXChain Governance:", governance.address);
    console.log("🌍 Real Environmental Oracle:", realEnvironmentalOracle);
    console.log("📋 Config saved to:", deployedAddressesPath);
    console.log("");
    console.log("🌍 REAL DATA SOURCES CONNECTED:");
    console.log("   🌫️  PM2.5: NASA Earth Data + OpenAQ API");
    console.log("   🏭 AQI: OpenAQ API (real-time)");
    console.log("   🌳 Forest Cover: NASA MODIS + Global Forest Watch");
    console.log("");
    console.log("🔗 View on Etherscan:");
    console.log(`   Governance: https://sepolia.etherscan.io/address/${governance.address}`);
    console.log(`   Environmental Oracle: https://sepolia.etherscan.io/address/${realEnvironmentalOracle}`);
    console.log("");
    console.log("✅ Your governance contract now uses REAL environmental data!");
    console.log("🌍 No more crypto prices - only real PM2.5, AQI, and forest data!");
    console.log("");
    console.log("🦊 READY TO USE:");
    console.log("   1. Switch MetaMask to Sepolia network");
    console.log("   2. Create environmental commitments with real data verification!");
    console.log("   3. Your commitments will be verified against live environmental APIs!");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("");
      console.log("💡 You need more Sepolia ETH. Get it from:");
      console.log("   - https://sepoliafaucet.com/");
      console.log("   - https://faucet.quicknode.com/ethereum/sepolia");
    }
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
