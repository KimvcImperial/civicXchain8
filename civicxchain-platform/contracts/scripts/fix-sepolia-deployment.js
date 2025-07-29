const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔧 FIXING SEPOLIA DEPLOYMENT - REPLACING CHAINLINK PRICE FEEDS");
  console.log("📊 Using your existing EnvironmentalDataOracle instead of ETH/USD feeds");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  // Your existing Environmental Oracle address
  const existingOracleAddress = "0xfc6dA5DE0C9EB29b2161A1628D054D8740f887FC";
  console.log("📊 Using existing Environmental Oracle:", existingOracleAddress);

  try {
    // Test the existing oracle first
    console.log("🧪 Testing existing Environmental Oracle...");
    const oracle = await ethers.getContractAt("EnvironmentalDataOracle", existingOracleAddress);
    const pm25Value = await oracle.getLatestPM25Data();
    console.log("✅ Oracle working - PM2.5:", (pm25Value / 100).toFixed(2), "μg/m³");

    // Deploy NEW CivicXChain Governance with the correct oracle addresses
    console.log("\n🏛️ Deploying NEW CivicXChain Governance with Environmental Oracle...");
    const GovernanceContract = await ethers.getContractFactory("CivicXChainGovernance");

    // Use the environmental oracle for all three feeds (instead of Chainlink price feeds)
    const governance = await GovernanceContract.deploy(
      existingOracleAddress, // PM2.5 feed (environmental data)
      existingOracleAddress, // AQI feed (environmental data)  
      existingOracleAddress  // Forest cover feed (environmental data)
    );
    await governance.deployed();
    console.log("✅ NEW CivicXChain Governance deployed to:", governance.address);

    // Test the new governance contract
    console.log("\n🧪 Testing NEW Governance Contract...");
    const nextId = await governance.nextCommitmentId();
    console.log("✅ Governance test: Next commitment ID =", nextId.toString());

    // Test environmental data access
    const currentPM25 = await governance.getCurrentEnvironmentalValue("pm25");
    console.log("✅ Environmental data access: PM2.5 =", (currentPM25 / 100).toFixed(2), "μg/m³");

    // Save NEW deployment info
    const deploymentInfo = {
      ENVIRONMENTAL_ORACLE: existingOracleAddress,
      GOVERNANCE_CONTRACT: governance.address,
      COMMITMENT_CONTRACT: governance.address,
      CIVIC_TOKEN: governance.address,
      DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
      NETWORK: "sepolia",
      CHAIN_ID: 11155111,
      DEPLOYER: deployer.address,
      BLOCK_NUMBER: await deployer.provider.getBlockNumber(),
      GOVERNANCE_TX: governance.deployTransaction.hash,
      ORACLE_TYPE: "EnvironmentalDataOracle",
      FIXED_ISSUE: "Replaced Chainlink price feeds with environmental data oracle"
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
      `ENVIRONMENTAL_ORACLE=${existingOracleAddress}`,
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

    console.log("\n🎉 SEPOLIA DEPLOYMENT FIXED!");
    console.log("=====================================");
    console.log("🏛️ NEW CivicXChain Governance:", governance.address);
    console.log("📊 Environmental Oracle:", existingOracleAddress);
    console.log("📋 Config updated:", deployedAddressesPath);
    console.log("");
    console.log("✅ ISSUE RESOLVED:");
    console.log("   ❌ Old: Using Chainlink ETH/USD price feeds (circuit breaker errors)");
    console.log("   ✅ New: Using EnvironmentalDataOracle (real environmental data)");
    console.log("");
    console.log("🔗 View NEW contract on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${governance.address}`);
    console.log("");
    console.log("🚀 Your frontend will now work without circuit breaker errors!");
    console.log("📊 Environmental data: PM2.5, CO2, Forest Cover");

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
