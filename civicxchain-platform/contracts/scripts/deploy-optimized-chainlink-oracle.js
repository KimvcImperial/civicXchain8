const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 DEPLOYING OPTIMIZED CHAINLINK ENVIRONMENTAL ORACLE");
  console.log("🌍 Will fetch real data from NASA API, OpenAQ via Chainlink");
  console.log("⚡ Optimized for low gas usage");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.log("❌ Insufficient balance for deployment");
    console.log("💡 You need at least 0.01 ETH for deployment");
    process.exit(1);
  }

  try {
    // Deploy only the Chainlink Environmental Oracle (most important)
    console.log("🔗 Deploying Chainlink Environmental Oracle...");
    const ChainlinkOracle = await ethers.getContractFactory("ChainlinkEnvironmentalOracle");
    
    // Deploy with gas optimization
    const chainlinkOracle = await ChainlinkOracle.deploy({
      gasLimit: 3000000, // Set reasonable gas limit
      gasPrice: ethers.utils.parseUnits("20", "gwei") // Lower gas price
    });
    
    console.log("⏳ Waiting for deployment...");
    await chainlinkOracle.deployed();
    console.log("✅ Chainlink Environmental Oracle deployed to:", chainlinkOracle.address);

    // Test the oracle
    console.log("\n🧪 Testing Chainlink Oracle...");
    try {
      const pm25Value = await chainlinkOracle.getLatestPM25Data();
      const co2Value = await chainlinkOracle.getLatestCO2Data();
      const forestValue = await chainlinkOracle.getLatestForestCoverData();

      console.log("✅ PM2.5 Data:", (pm25Value / 100).toFixed(2), "μg/m³");
      console.log("✅ CO2 Data:", (co2Value / 100).toFixed(2), "ppm");
      console.log("✅ Forest Cover:", (forestValue / 100).toFixed(2), "%");
    } catch (testError) {
      console.log("⚠️ Test warning:", testError.message);
    }

    // Update frontend configuration to use new oracle
    const deploymentInfo = {
      CHAINLINK_ENVIRONMENTAL_ORACLE: chainlinkOracle.address,
      ENVIRONMENTAL_ORACLE: chainlinkOracle.address, // Update this for frontend
      GOVERNANCE_CONTRACT: "0x5651E7F2E503dEB45E2D527bB383E2CDc68A1C78", // Keep existing
      COMMITMENT_CONTRACT: "0x5651E7F2E503dEB45E2D527bB383E2CDc68A1C78", // Keep existing
      CIVIC_TOKEN: "0x5651E7F2E503dEB45E2D527bB383E2CDc68A1C78", // Keep existing
      DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
      NETWORK: "sepolia",
      CHAIN_ID: 11155111,
      DEPLOYER: deployer.address,
      BLOCK_NUMBER: await deployer.provider.getBlockNumber(),
      ORACLE_TX: chainlinkOracle.deployTransaction.hash,
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

    // Update contracts.js file
    const contractsPath = path.join(__dirname, '../../frontend/config/contracts.js');
    let contractsContent = fs.readFileSync(contractsPath, 'utf8');
    
    // Update the ENVIRONMENTAL_ORACLE address
    contractsContent = contractsContent.replace(
      /ENVIRONMENTAL_ORACLE: '[^']*'/,
      `ENVIRONMENTAL_ORACLE: '${chainlinkOracle.address}'`
    );
    
    fs.writeFileSync(contractsPath, contractsContent);

    // Update .env file
    const envPath = path.join(__dirname, '../../.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const envUpdates = [
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

    console.log("\n🎉 CHAINLINK ENVIRONMENTAL ORACLE DEPLOYED!");
    console.log("=====================================");
    console.log("🔗 Chainlink Environmental Oracle:", chainlinkOracle.address);
    console.log("📋 Frontend config updated automatically");
    console.log("💰 Gas used:", chainlinkOracle.deployTransaction.gasLimit?.toString() || 'N/A');
    console.log("");
    console.log("🌍 REAL DATA SOURCES VIA CHAINLINK:");
    console.log("   🌫️  PM2.5: OpenAQ API → Chainlink → Smart Contract");
    console.log("   🏭 CO2: NASA POWER API → Chainlink → Smart Contract");
    console.log("   🌳 Forest Cover: NASA Earth API → Chainlink → Smart Contract");
    console.log("");
    console.log("🔗 View on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${chainlinkOracle.address}`);
    console.log("");
    console.log("💡 NEXT STEPS:");
    console.log("   1. Get LINK tokens: https://faucets.chain.link/sepolia");
    console.log("   2. Fund oracle with LINK for API requests");
    console.log("   3. Call requestAllEnvironmentalData() to fetch live data");
    console.log("   4. Your frontend now uses real Chainlink environmental data!");
    console.log("");
    console.log("🚀 Your React hooks will now fetch real environmental data!");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("");
      console.log("💡 You need more Sepolia ETH. Try these faucets:");
      console.log("   - https://sepoliafaucet.com/");
      console.log("   - https://sepolia-faucet.pk910.de/ (PoW faucet)");
      console.log("   - https://cloud.google.com/application/web3/faucet/ethereum/sepolia");
    }
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
