const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function checkWalletAddresses() {
  console.log('🔍 Checking Wallet Addresses for Reward Claiming');
  console.log('=' .repeat(60));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    const abi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled))',
      'function nextCommitmentId() view returns (uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    // Get total commitments
    const nextId = await contract.nextCommitmentId();
    const totalCommitments = Number(nextId) - 1;
    
    console.log(`📊 Total commitments: ${totalCommitments}\n`);
    
    // Check each commitment
    for (let i = 1; i <= totalCommitments; i++) {
      try {
        const commitment = await contract.getCommitment(i);
        console.log(`🌱 Commitment #${i}:`);
        console.log(`   Title: ${commitment.title}`);
        console.log(`   Official: ${commitment.officialName} (${commitment.officialRole})`);
        console.log(`   Creator Address: ${commitment.officialAddress}`);
        console.log(`   Is Active: ${commitment.isActive}`);
        console.log(`   Is Fulfilled: ${commitment.isFulfilled}`);
        console.log(`   Target: ${commitment.targetValue} (${(Number(commitment.targetValue) / 100).toFixed(2)} μg/m³)`);
        console.log('');
      } catch (error) {
        console.log(`❌ Error getting commitment ${i}:`, error.message);
      }
    }
    
    console.log('🔑 TO CLAIM REWARDS:');
    console.log('   You must use the SAME wallet address that created the commitment');
    console.log('   Check MetaMask and make sure you\'re connected with the correct account');
    console.log('');
    console.log('💡 SOLUTION:');
    console.log('   1. In MetaMask, switch to the account that matches the "Creator Address" above');
    console.log('   2. Or import the private key for that address into MetaMask');
    console.log('   3. Then try claiming the reward again');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkWalletAddresses();
