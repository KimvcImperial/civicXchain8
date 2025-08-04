const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function testJudgeApprovalFix() {
  console.log('🔍 Testing Judge Approval Fix');
  console.log('=' .repeat(50));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    const abi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))',
      'function checkFulfillment(uint256) view returns (bool, uint256, uint256)',
      'function getCurrentEnvironmentalValue(string) view returns (uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    // Test commitments 3, 4, and 5 (the ones visible in the screenshot)
    for (const commitmentId of [3, 4, 5]) {
      console.log(`\n🌱 Testing Commitment #${commitmentId}:`);
      
      try {
        const commitment = await contract.getCommitment(commitmentId);
        console.log(`   Title: ${commitment.title}`);
        console.log(`   Is Active: ${commitment.isActive}`);
        console.log(`   Is Fulfilled: ${commitment.isFulfilled}`);
        console.log(`   Reward Claimed: ${commitment.rewardClaimed}`);
        console.log(`   Target Value: ${commitment.targetValue} (${(Number(commitment.targetValue) / 100).toFixed(2)} μg/m³)`);
        
        // Check current environmental value
        const currentEnvValue = await contract.getCurrentEnvironmentalValue(commitment.metricType);
        console.log(`   Current Env Value: ${currentEnvValue} (${(Number(currentEnvValue) / 100).toFixed(2)} μg/m³)`);
        
        // Check fulfillment status
        const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(commitmentId);
        console.log(`   Oracle Fulfillment: ${fulfilled}`);
        console.log(`   Logic: ${commitment.metricType === 'pm25' ? 'current <= target' : 'current >= target'}`);
        console.log(`   Calculation: ${currentValue} ${commitment.metricType === 'pm25' ? '<=' : '>='} ${targetValue} = ${fulfilled}`);
        
        // Determine expected button state
        console.log(`\n   🎯 Expected Button State:`);
        if (commitment.isFulfilled) {
          console.log(`   ✅ Should show: "Judge Approved" (green, disabled)`);
        } else if (commitment.isActive && !commitment.rewardClaimed) {
          console.log(`   🟣 Should show: "Judge Approve Reward" (purple, clickable)`);
        } else {
          console.log(`   ❌ Should show: disabled state`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error fetching commitment ${commitmentId}:`, error.message);
      }
    }
    
    console.log('\n💡 EXPECTED BEHAVIOR AFTER FIX:');
    console.log('   1. Button state based on blockchain isFulfilled field');
    console.log('   2. No more localStorage confusion');
    console.log('   3. Clear visual feedback for each state');
    console.log('   4. Consistent behavior across all commitments');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testJudgeApprovalFix();
