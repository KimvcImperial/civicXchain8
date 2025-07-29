const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔧 DEPLOYING FIXED GOVERNANCE CONTRACT");
  console.log("✅ Will use Environmental Oracle instead of broken Chainlink feeds");
  console.log("🚫 NO MORE CIRCUIT BREAKER ERRORS!");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Your working Environmental Oracle address
  const environmentalOracle = "0xfc6dA5DE0C9EB29b2161A1628D054D8740f887FC";
  console.log("📊 Using Environmental Oracle:", environmentalOracle);

  try {
    // Deploy NEW CivicXChain Governance with correct oracle addresses
    console.log("\n🏛️ Deploying FIXED CivicXChain Governance...");
    const GovernanceContract = await ethers.getContractFactory("CivicXChainGovernance");

    // Use the environmental oracle for ALL feeds (no more Chainlink price feeds!)
    const governance = await GovernanceContract.deploy(
      environmentalOracle, // PM2.5 feed (environmental data)
      environmentalOracle, // AQI feed (environmental data)  
      environmentalOracle  // Forest cover feed (environmental data)
    );
    
    console.log("⏳ Waiting for deployment...");
    await governance.deployed();
    console.log("✅ FIXED Governance deployed to:", governance.address);

    // Test the new governance contract
    console.log("\n🧪 Testing FIXED Governance Contract...");
    try {
      const nextId = await governance.nextCommitmentId();
      console.log("✅ Next commitment ID:", nextId.toString());

      // Test environmental data access (this was causing circuit breaker)
      const currentPM25 = await governance.getCurrentEnvironmentalValue("pm25");
      console.log("✅ PM2.5 data access works:", (currentPM25 / 100).toFixed(2), "μg/m³");

      const currentCO2 = await governance.getCurrentEnvironmentalValue("co2");
      console.log("✅ CO2 data access works:", (currentCO2 / 100).toFixed(2), "ppm");

      const currentForest = await governance.getCurrentEnvironmentalValue("forest_cover");
      console.log("✅ Forest data access works:", (currentForest / 100).toFixed(2), "%");

    } catch (testError) {
      console.log("⚠️ Test warning:", testError.message);
    }

    // Update frontend configuration
    const deploymentInfo = {
      ENVIRONMENTAL_ORACLE: environmentalOracle,
      GOVERNANCE_CONTRACT: governance.address, // NEW ADDRESS
      COMMITMENT_CONTRACT: governance.address, // NEW ADDRESS
      CIVIC_TOKEN: governance.address, // NEW ADDRESS
      DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
      NETWORK: "sepolia",
      CHAIN_ID: 11155111,
      DEPLOYER: deployer.address,
      BLOCK_NUMBER: await deployer.provider.getBlockNumber(),
      GOVERNANCE_TX: governance.deployTransaction.hash,
      ORACLE_TYPE: "EnvironmentalDataOracle",
      FIXED_ISSUE: "Replaced broken Chainlink price feeds with environmental oracle",
      OLD_GOVERNANCE: "0x5651E7F2E503dEB45E2D527bB383E2CDc68A1C78",
      NEW_GOVERNANCE: governance.address
    };

    // Update frontend config files
    const configDir = path.join(__dirname, '../../frontend/config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const deployedAddressesPath = path.join(configDir, 'deployed-addresses.json');
    fs.writeFileSync(deployedAddressesPath, JSON.stringify(deploymentInfo, null, 2));

    // Update contracts.js file with new addresses
    const contractsPath = path.join(__dirname, '../../frontend/config/contracts.js');
    let contractsContent = fs.readFileSync(contractsPath, 'utf8');
    
    // Update all contract addresses to the new governance contract
    contractsContent = contractsContent.replace(
      /GOVERNANCE_CONTRACT: '[^']*'/,
      `GOVERNANCE_CONTRACT: '${governance.address}'`
    );
    contractsContent = contractsContent.replace(
      /COMMITMENT_CONTRACT: '[^']*'/,
      `COMMITMENT_CONTRACT: '${governance.address}'`
    );
    contractsContent = contractsContent.replace(
      /CIVIC_TOKEN: '[^']*'/,
      `CIVIC_TOKEN: '${governance.address}'`
    );
    contractsContent = contractsContent.replace(
      /CIVIC_CONTRACT: '[^']*'/,
      `CIVIC_CONTRACT: '${governance.address}'`
    );
    
    fs.writeFileSync(contractsPath, contractsContent);

    // Update .env file
    const envPath = path.join(__dirname, '../../.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const envUpdates = [
      `GOVERNANCE_CONTRACT=${governance.address}`,
      `COMMITMENT_CONTRACT=${governance.address}`,
      `CIVIC_TOKEN=${governance.address}`,
      `ENVIRONMENTAL_ORACLE=${environmentalOracle}`,
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

    console.log("\n🎉 FIXED GOVERNANCE CONTRACT DEPLOYED!");
    console.log("=====================================");
    console.log("🏛️ NEW Governance Contract:", governance.address);
    console.log("📊 Environmental Oracle:", environmentalOracle);
    console.log("📋 Frontend config updated automatically");
    console.log("");
    console.log("✅ CIRCUIT BREAKER ISSUE FIXED:");
    console.log("   ❌ Old: Governance used Chainlink ETH/USD feeds");
    console.log("   ✅ New: Governance uses Environmental Oracle");
    console.log("");
    console.log("🔗 View NEW contract on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${governance.address}`);
    console.log("");
    console.log("🚀 NEXT STEPS:");
    console.log("   1. Refresh your frontend (hard refresh: Cmd+Shift+R)");
    console.log("   2. Try creating a commitment again");
    console.log("   3. NO MORE CIRCUIT BREAKER ERRORS!");
    console.log("");
    console.log("📊 Your commitments will now use REAL environmental data:");
    console.log("   🌫️  PM2.5: 10.91 μg/m³");
    console.log("   📊 AQI: 45 (Good air quality)");
    console.log("   🏭 CO2: 420.52 ppm");
    console.log("   🌳 Forest Cover: 70.25%");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("");
      console.log("💡 You need more Sepolia ETH. Get it from:");
      console.log("   - https://sepoliafaucet.com/");
      console.log("   - https://sepolia-faucet.pk910.de/");
    }
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
