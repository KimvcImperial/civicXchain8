const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function checkContractOwner() {
  console.log('🔍 Checking Contract Owner');
  console.log('=' .repeat(40));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    const abi = [
      'function owner() view returns (address)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    const ownerAddress = await contract.owner();
    console.log('Contract Owner Address:', ownerAddress);
    
    console.log('\n💡 To manually mark commitments as fulfilled:');
    console.log('   1. You need to be the contract owner');
    console.log('   2. Or we need to add a judge role to the contract');
    console.log('   3. Current owner can call admin functions');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkContractOwner();
