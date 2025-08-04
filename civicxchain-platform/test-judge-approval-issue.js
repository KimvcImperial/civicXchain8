const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function testJudgeApprovalIssue() {
  console.log('🔍 Testing Judge Approval Issue');
  console.log('=' .repeat(50));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    const abi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))',
      'function checkFulfillment(uint256) view returns (bool, uint256, uint256)',
      'function getCurrentEnvironmentalValue(string) view returns (uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    // Test commitments 3 and 4 (the ones that should be judge-approved)
    for (const commitmentId of [3, 4]) {
      console.log(`\n🌱 Testing Commitment #${commitmentId}:`);
      
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
      
      // Check localStorage judge approval
      console.log(`\n   📋 Judge Approval Status:`);
      if (typeof localStorage !== 'undefined') {
        const judgeVerifications = JSON.parse(localStorage.getItem('judgeVerifications') || '{}');
        const isJudgeApproved = judgeVerifications[commitmentId.toString()]?.verified || false;
        console.log(`   Judge Approved (localStorage): ${isJudgeApproved}`);
      } else {
        console.log(`   Judge Approved (localStorage): Cannot check (running in Node.js)`);
      }
      
      // Determine if claimable
      const canClaimBasedOnContract = commitment.isActive && 
                                     !commitment.rewardClaimed && 
                                     fulfilled; // This is the issue!
      
      console.log(`\n   🎁 Can Claim (Contract Logic): ${canClaimBasedOnContract ? '✅' : '❌'}`);
      
      if (!canClaimBasedOnContract) {
        console.log(`   ❌ Issue: Smart contract checkFulfillment() returns ${fulfilled}`);
        console.log(`   💡 Solution needed: Contract needs to accept judge approval`);
      }
    }
    
    console.log('\n🚨 ROOT CAUSE:');
    console.log('   1. Judge approval is stored in localStorage (frontend only)');
    console.log('   2. Smart contract checkFulfillment() still checks oracle data');
    console.log('   3. Oracle shows current PM2.5 = 12.5, target = 23.0');
    console.log('   4. Since 12.5 <= 23.0, oracle says fulfilled = true');
    console.log('   5. But for some reason, checkFulfillment is returning false');
    
    console.log('\n💡 SOLUTIONS:');
    console.log('   A. Add judgeApproveCommitment() function to smart contract');
    console.log('   B. Or modify checkFulfillment() to accept judge override');
    console.log('   C. Or create new commitments that naturally fulfill oracle conditions');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testJudgeApprovalIssue();
