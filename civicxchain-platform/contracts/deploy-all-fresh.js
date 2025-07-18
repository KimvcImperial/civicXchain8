const { ethers } = require('hardhat');

async function deployAllFresh() {
  console.log('🚀 Deploying ALL CivicXChain Contracts (Fresh Deployment)...');
  console.log('=' .repeat(60));
  
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()), 'ETH');
  
  // Deploy Oracle Contracts
  console.log('\n📊 Deploying Oracle Contracts...');
  const MockAggregator = await ethers.getContractFactory('MockAggregator');
  
  const pm25Oracle = await MockAggregator.deploy(988, 8); // 9.88 μg/m³ (from live data)
  await pm25Oracle.deployed();
  console.log('✅ PM2.5 Oracle deployed at:', pm25Oracle.address);
  
  const co2Oracle = await MockAggregator.deploy(48511, 8); // 485.11 ppm (from live data)
  await co2Oracle.deployed();
  console.log('✅ CO2 Oracle deployed at:', co2Oracle.address);
  
  const forestOracle = await MockAggregator.deploy(6746, 8); // 67.46% (from live data)
  await forestOracle.deployed();
  console.log('✅ Forest Oracle deployed at:', forestOracle.address);
  
  // Deploy Governance Contract
  console.log('\n🏛️ Deploying Governance Contract...');
  const CivicXChainGovernance = await ethers.getContractFactory('CivicXChainGovernance');
  const governance = await CivicXChainGovernance.deploy(pm25Oracle.address, co2Oracle.address, forestOracle.address);
  await governance.deployed();
  console.log('✅ Governance deployed at:', governance.address);
  
  // Test all contracts
  console.log('\n🧪 Testing Deployed Contracts...');
  
  const pm25Data = await pm25Oracle.latestRoundData();
  console.log('PM2.5 Oracle:', Number(pm25Data.answer) / 100, 'μg/m³');
  
  const co2Data = await co2Oracle.latestRoundData();
  console.log('CO2 Oracle:', Number(co2Data.answer) / 100, 'ppm');
  
  const forestData = await forestOracle.latestRoundData();
  console.log('Forest Oracle:', Number(forestData.answer) / 100, '%');
  
  const tokenBalance = await governance.getContractTokenBalance();
  console.log('Governance tokens:', ethers.utils.formatEther(tokenBalance), 'CIVIC');
  
  console.log('\n📋 FINAL CONTRACT ADDRESSES:');
  console.log('GOVERNANCE_CONTRACT:', governance.address);
  console.log('PM25_ORACLE:', pm25Oracle.address);
  console.log('CO2_ORACLE:', co2Oracle.address);
  console.log('FOREST_ORACLE:', forestOracle.address);
  
  // Save addresses to file
  const fs = require('fs');
  const addresses = {
    governance: governance.address,
    pm25Oracle: pm25Oracle.address,
    co2Oracle: co2Oracle.address,
    forestOracle: forestOracle.address,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
  console.log('\n💾 Addresses saved to deployed-addresses.json');
  
  console.log('\n✅ ALL CONTRACTS DEPLOYED AND WORKING!');
  
  return addresses;
}

if (require.main === module) {
  deployAllFresh()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = deployAllFresh;
