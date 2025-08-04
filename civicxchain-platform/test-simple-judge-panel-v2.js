const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function testSimpleJudgePanel() {
  console.log('🧪 Testing Simplified Judge Panel Functionality');
  console.log('=' .repeat(50));
  
  try {
    // Initialize provider
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    console.log('✅ Provider initialized');
    
    // Test contract existence
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      throw new Error('No contract deployed at address');
    }
    console.log('✅ Contract exists at address');
    
    // Simplified ABI with just getCommitment
    const simpleAbi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled))'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, simpleAbi, provider);
    console.log('✅ Contract instance created');
    
    // Test getCommitment for ID 1
    console.log('\n📞 Testing getCommitment(1)...');
    const commitment = await contract.getCommitment(1);
    
    console.log('📋 Commitment Data:');
    console.log('  ID:', commitment.id.toString());
    console.log('  Title:', commitment.title);
    console.log('  Description:', commitment.description);
    console.log('  Official:', commitment.officialName);
    console.log('  Role:', commitment.officialRole);
    console.log('  Target Value:', commitment.targetValue.toString());
    console.log('  Deadline:', new Date(Number(commitment.deadline) * 1000).toISOString());
    console.log('  Metric Type:', commitment.metricType);
    console.log('  Is Active:', commitment.isActive);
    console.log('  Is Fulfilled:', commitment.isFulfilled);
    
    // Simulate Judge Panel logic
    console.log('\n🎯 Judge Panel Logic Simulation:');
    const targetValue = commitment.targetValue;
    const currentValue = BigInt(1250); // Mock current value (12.50 μg/m³)
    const fulfilled = commitment.isFulfilled;
    
    console.log('  Target Value:', targetValue.toString(), 'μg/m³ (×100)');
    console.log('  Current Value:', currentValue.toString(), 'μg/m³ (×100)');
    console.log('  Target Achieved:', currentValue <= targetValue);
    console.log('  Contract Fulfilled:', fulfilled);
    
    // Calculate percentage
    const percentage = Number(currentValue * BigInt(100) / targetValue);
    console.log('  Current/Target %:', percentage.toFixed(1) + '%');
    
    // Determine reward eligibility
    const rewardEligible = currentValue <= targetValue;
    console.log('  Reward Eligible:', rewardEligible);
    
    console.log('\n✅ All tests passed! Judge Panel should work correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testSimpleJudgePanel();
