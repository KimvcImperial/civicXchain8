const { ethers } = require('hardhat');

async function deployGovernance() {
  console.log('🏛️ Deploying CivicXChain Governance Contract...');
  
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  
  // Oracle addresses (already deployed)
  const pm25Oracle = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const co2Oracle = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const forestOracle = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  
  console.log('Using oracle addresses:');
  console.log('  PM2.5:', pm25Oracle);
  console.log('  CO2:', co2Oracle);
  console.log('  Forest:', forestOracle);
  
  // Deploy governance contract
  const CivicXChainGovernance = await ethers.getContractFactory('CivicXChainGovernance');
  const governance = await CivicXChainGovernance.deploy(pm25Oracle, co2Oracle, forestOracle);
  await governance.deployed();
  
  console.log('✅ Governance deployed at:', governance.address);
  
  // Test the contract
  const tokenBalance = await governance.getContractTokenBalance();
  console.log('💰 Token balance:', ethers.utils.formatEther(tokenBalance), 'CIVIC');
  
  console.log('\n📋 FINAL CONTRACT ADDRESSES:');
  console.log('GOVERNANCE_CONTRACT:', governance.address);
  console.log('PM25_ORACLE:', pm25Oracle);
  console.log('CO2_ORACLE:', co2Oracle);
  console.log('FOREST_ORACLE:', forestOracle);
  
  return governance.address;
}

if (require.main === module) {
  deployGovernance()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = deployGovernance;
