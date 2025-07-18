const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CivicXChain Contracts...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", hre.ethers.utils.formatEther(await deployer.getBalance()));

  // Deploy Oracle Contracts
  console.log("\n📊 Deploying Oracle Contracts...");
  
  const MockAggregator = await hre.ethers.getContractFactory("MockAggregator");
  
  // Deploy PM2.5 Oracle
  const pm25Oracle = await MockAggregator.deploy(988, 8); // 9.88 μg/m³
  await pm25Oracle.deployed();
  console.log("✅ PM2.5 Oracle deployed to:", pm25Oracle.address);
  
  // Deploy CO2 Oracle
  const co2Oracle = await MockAggregator.deploy(48511, 8); // 485.11 ppm
  await co2Oracle.deployed();
  console.log("✅ CO2 Oracle deployed to:", co2Oracle.address);
  
  // Deploy Forest Oracle
  const forestOracle = await MockAggregator.deploy(6746, 8); // 67.46%
  await forestOracle.deployed();
  console.log("✅ Forest Oracle deployed to:", forestOracle.address);

  // Deploy Governance Contract
  console.log("\n🏛️ Deploying Governance Contract...");
  const CivicXChainGovernance = await hre.ethers.getContractFactory("CivicXChainGovernance");
  const governance = await CivicXChainGovernance.deploy(
    pm25Oracle.address,
    co2Oracle.address,
    forestOracle.address
  );
  await governance.deployed();
  console.log("✅ Governance deployed to:", governance.address);

  // Test all contracts
  console.log("\n🧪 Testing Contracts...");
  
  const pm25Data = await pm25Oracle.latestRoundData();
  console.log("PM2.5:", Number(pm25Data.answer) / 100, "μg/m³");
  
  const co2Data = await co2Oracle.latestRoundData();
  console.log("CO2:", Number(co2Data.answer) / 100, "ppm");
  
  const forestData = await forestOracle.latestRoundData();
  console.log("Forest:", Number(forestData.answer) / 100, "%");
  
  const tokenBalance = await governance.getContractTokenBalance();
  console.log("Governance tokens:", hre.ethers.utils.formatEther(tokenBalance), "CIVIC");

  console.log("\n📋 CONTRACT ADDRESSES:");
  console.log("GOVERNANCE_CONTRACT:", governance.address);
  console.log("PM25_ORACLE:", pm25Oracle.address);
  console.log("CO2_ORACLE:", co2Oracle.address);
  console.log("FOREST_ORACLE:", forestOracle.address);
  
  // Save addresses
  const fs = require('fs');
  const addresses = {
    governance: governance.address,
    pm25Oracle: pm25Oracle.address,
    co2Oracle: co2Oracle.address,
    forestOracle: forestOracle.address,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
  console.log("\n💾 Addresses saved to deployed-addresses.json");
  
  console.log("\n✅ ALL CONTRACTS DEPLOYED SUCCESSFULLY!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
