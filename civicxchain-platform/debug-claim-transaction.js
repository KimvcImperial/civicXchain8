const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function debugClaimTransaction() {
  console.log('🔍 Debugging Claim Transaction Issue');
  console.log('=' .repeat(50));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    const abi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled))',
      'function checkFulfillment(uint256) view returns (bool, uint256, uint256)',
      'function balanceOf(address) view returns (uint256)',
      'function claimEnvironmentalReward(uint256) returns (uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    // Test commitment 1 (the one you're trying to claim)
    console.log('📋 Checking commitment 1 details...');
    const commitment = await contract.getCommitment(1);
    
    console.log('Commitment details:');
    console.log('  ID:', commitment.id.toString());
    console.log('  Title:', commitment.title);
    console.log('  Official Address:', commitment.officialAddress);
    console.log('  Is Active:', commitment.isActive);
    console.log('  Is Fulfilled:', commitment.isFulfilled);
    console.log('  Target Value:', commitment.targetValue.toString());
    console.log('  Deadline:', new Date(Number(commitment.deadline) * 1000).toISOString());
    
    // Check fulfillment status
    console.log('\n📊 Checking fulfillment status...');
    const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(1);
    console.log('Fulfillment check:');
    console.log('  Fulfilled:', fulfilled);
    console.log('  Current Value:', currentValue.toString());
    console.log('  Target Value:', targetValue.toString());
    
    // Check contract token balance
    console.log('\n💰 Checking contract balances...');
    const contractTokenBalance = await contract.balanceOf(CONTRACT_ADDRESS);
    console.log('Contract token balance:', contractTokenBalance.toString());
    
    const contractEthBalance = await provider.getBalance(CONTRACT_ADDRESS);
    console.log('Contract ETH balance:', ethers.formatEther(contractEthBalance), 'ETH');
    
    // Check all requirements for claiming
    console.log('\n✅ Claim Requirements Check:');
    console.log('  1. Is Active:', commitment.isActive ? '✅' : '❌');
    console.log('  2. Not Already Claimed:', !commitment.isFulfilled ? '✅' : '❌ (already fulfilled)');
    console.log('  3. Oracle Fulfilled:', fulfilled ? '✅' : '❌');
    console.log('  4. Contract has tokens:', contractTokenBalance > 0 ? '✅' : '❌');
    console.log('  5. Contract has ETH:', contractEthBalance > 0 ? '✅' : '❌');
    
    // The issue might be that isFulfilled is already true, meaning reward was already claimed
    if (commitment.isFulfilled) {
      console.log('\n🚨 ISSUE FOUND:');
      console.log('   The commitment shows isFulfilled = true');
      console.log('   This might mean the reward was already claimed');
      console.log('   Or the contract logic is checking this field incorrectly');
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('   1. Check if this commitment was already claimed');
    console.log('   2. Try claiming a different commitment (2, 3, 4, or 5)');
    console.log('   3. Or we may need to modify the smart contract logic');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugClaimTransaction();
