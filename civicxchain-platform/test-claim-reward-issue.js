const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function testClaimRewardIssue() {
  console.log('🔍 Testing Claim Reward Issue');
  console.log('=' .repeat(50));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    const abi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled))',
      'function checkFulfillment(uint256) view returns (bool, uint256, uint256)',
      'function claimEnvironmentalReward(uint256) returns (uint256)',
      'function balanceOf(address) view returns (uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    // Test commitment 1
    console.log('📋 Testing commitment 1...');
    const commitment = await contract.getCommitment(1);
    console.log('Commitment details:', {
      id: commitment.id.toString(),
      title: commitment.title,
      officialAddress: commitment.officialAddress,
      isActive: commitment.isActive,
      isFulfilled: commitment.isFulfilled,
      targetValue: commitment.targetValue.toString(),
      deadline: new Date(Number(commitment.deadline) * 1000).toISOString()
    });
    
    // Test fulfillment
    const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(1);
    console.log('Fulfillment status:', {
      fulfilled,
      currentValue: currentValue.toString(),
      targetValue: targetValue.toString()
    });
    
    // Check contract token balance
    const contractBalance = await contract.balanceOf(CONTRACT_ADDRESS);
    console.log('Contract token balance:', contractBalance.toString());
    
    // Try to estimate gas for claim (this will show the revert reason)
    console.log('\n🔍 Testing claimEnvironmentalReward gas estimation...');
    try {
      // We can't actually call this without a wallet, but we can try to estimate
      // This will fail but give us the revert reason
      const gasEstimate = await contract.claimEnvironmentalReward.estimateGas(1);
      console.log('✅ Gas estimate:', gasEstimate.toString());
    } catch (error) {
      console.error('❌ Gas estimation failed (this shows the revert reason):');
      console.error('Error message:', error.message);
      
      // Parse the revert reason
      if (error.message.includes('revert')) {
        const revertMatch = error.message.match(/revert (.+?)(?:\s|$)/);
        if (revertMatch) {
          console.log('🔍 Revert reason:', revertMatch[1]);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testClaimRewardIssue();
