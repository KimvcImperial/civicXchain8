const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔗 DEPLOYING CHAINLINK ENVIRONMENTAL ORACLE FOR SEPOLIA");
  console.log("🌍 Fetches real data from NASA API, OpenAQ, etc. via Chainlink");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  try {
    // Deploy Chainlink Environmental Oracle
    console.log("🔗 Deploying Chainlink Environmental Oracle...");
    const ChainlinkOracle = await ethers.getContractFactory("ChainlinkEnvironmentalOracle");
    const chainlinkOracle = await ChainlinkOracle.deploy();
    await chainlinkOracle.deployed();
    console.log("✅ Chainlink Environmental Oracle deployed to:", chainlinkOracle.address);

    // Deploy CivicXChain Governance with Chainlink oracles
    console.log("\n🏛️ Deploying CivicXChain Governance with Chainlink Environmental Oracles...");
    const GovernanceContract = await ethers.getContractFactory("CivicXChainGovernance");

    // Use the Chainlink environmental oracle for all three feeds
    const governance = await GovernanceContract.deploy(
      chainlinkOracle.address, // PM2.5 feed (Chainlink → OpenAQ API)
      chainlinkOracle.address, // AQI feed (Chainlink → NASA API)
      chainlinkOracle.address  // Forest cover feed (Chainlink → NASA Earth API)
    );
    await governance.deployed();
    console.log("✅ CivicXChain Governance deployed to:", governance.address);

    // Test the Chainlink oracle
    console.log("\n🧪 Testing Chainlink Environmental Oracle...");
    try {
      // Test basic functionality
      const pm25Value = await chainlinkOracle.getLatestPM25Data();
      const co2Value = await chainlinkOracle.getLatestCO2Data();
      const forestValue = await chainlinkOracle.getLatestForestCoverData();

      console.log("✅ PM2.5 Data:", (pm25Value / 100).toFixed(2), "μg/m³");
      console.log("✅ CO2 Data:", (co2Value / 100).toFixed(2), "ppm");
      console.log("✅ Forest Cover:", (forestValue / 100).toFixed(2), "%");

      // Test governance contract
      const nextId = await governance.nextCommitmentId();
      console.log("✅ Governance test: Next commitment ID =", nextId.toString());

      // Test environmental data access through governance
      const currentPM25 = await governance.getCurrentEnvironmentalValue("pm25");
      console.log("✅ Governance environmental access: PM2.5 =", (currentPM25 / 100).toFixed(2), "μg/m³");

    } catch (testError) {
      console.log("⚠️ Test warning:", testError.message);
      console.log("💡 Oracle needs LINK tokens to fetch live data from APIs");
    }

    // Save deployment info
    const deploymentInfo = {
      CHAINLINK_ENVIRONMENTAL_ORACLE: chainlinkOracle.address,
      ENVIRONMENTAL_ORACLE: chainlinkOracle.address, // For compatibility
      GOVERNANCE_CONTRACT: governance.address,
      COMMITMENT_CONTRACT: governance.address,
      CIVIC_TOKEN: governance.address,
      DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
      NETWORK: "sepolia",
      CHAIN_ID: 11155111,
      DEPLOYER: deployer.address,
      BLOCK_NUMBER: await deployer.provider.getBlockNumber(),
      ORACLE_TX: chainlinkOracle.deployTransaction.hash,
      GOVERNANCE_TX: governance.deployTransaction.hash,
      ORACLE_TYPE: "ChainlinkEnvironmentalOracle",
      DATA_SOURCES: {
        PM25: "OpenAQ API via Chainlink",
        CO2: "NASA POWER API via Chainlink",
        FOREST_COVER: "NASA Earth API via Chainlink"
      },
      CHAINLINK_CONFIG: {
        LINK_TOKEN: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        ORACLE: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
        JOB_ID: "ca98366cc7314957b8c012c72f05aeeb",
        FEE: "0.1 LINK per request"
      }
    };

    // Update frontend config
    const configDir = path.join(__dirname, '../../frontend/config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const deployedAddressesPath = path.join(configDir, 'deployed-addresses.json');
    fs.writeFileSync(deployedAddressesPath, JSON.stringify(deploymentInfo, null, 2));

    // Update .env file
    const envPath = path.join(__dirname, '../../.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update contract addresses
    const envUpdates = [
      `GOVERNANCE_CONTRACT=${governance.address}`,
      `ENVIRONMENTAL_ORACLE=${chainlinkOracle.address}`,
      `CHAINLINK_ENVIRONMENTAL_ORACLE=${chainlinkOracle.address}`,
      `NETWORK=sepolia`
    ];

    envUpdates.forEach(update => {
      const [key, value] = update.split('=');
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, update);
      } else {
        envContent += `\n${update}`;
      }
    });

    fs.writeFileSync(envPath, envContent);

    console.log("\n🎉 CHAINLINK ENVIRONMENTAL ORACLE DEPLOYMENT COMPLETE!");
    console.log("=====================================");
    console.log("🔗 Chainlink Environmental Oracle:", chainlinkOracle.address);
    console.log("🏛️ CivicXChain Governance:", governance.address);
    console.log("📋 Config saved to:", deployedAddressesPath);
    console.log("");
    console.log("🌍 REAL DATA SOURCES VIA CHAINLINK:");
    console.log("   🌫️  PM2.5: OpenAQ API → Chainlink → Smart Contract");
    console.log("   🏭 CO2: NASA POWER API → Chainlink → Smart Contract");
    console.log("   🌳 Forest Cover: NASA Earth API → Chainlink → Smart Contract");
    console.log("");
    console.log("🔗 View on Etherscan:");
    console.log(`   Oracle: https://sepolia.etherscan.io/address/${chainlinkOracle.address}`);
    console.log(`   Governance: https://sepolia.etherscan.io/address/${governance.address}`);
    console.log("");
    console.log("💡 NEXT STEPS:");
    console.log("   1. Fund oracle with LINK tokens for API requests");
    console.log("   2. Call requestAllEnvironmentalData() to fetch live data");
    console.log("   3. Your frontend will now use real environmental data!");
    console.log("");
    console.log("🔗 LINK Token (Sepolia): 0x779877A7B0D9E8603169DdbD7836e478b4624789");
    console.log("💰 Get LINK tokens: https://faucets.chain.link/sepolia");

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
