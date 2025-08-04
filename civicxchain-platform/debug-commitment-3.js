const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';
const USER_ADDRESS = '0xE46f6d0f815497fb6b64aD75c5020FD93bc72e57'; // The wallet trying to claim

async function debugCommitment3() {
  console.log('🔍 Debugging Commitment #3 Claim Issue');
  console.log('=' .repeat(50));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    const abi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))',
      'function checkFulfillment(uint256) view returns (bool, uint256, uint256)',
      'function claimEnvironmentalReward(uint256) returns (uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    console.log('📋 Commitment #3 Details:');
    const commitment = await contract.getCommitment(3);
    console.log('  Title:', commitment.title);
    console.log('  Official Address:', commitment.officialAddress);
    console.log('  User Address:', USER_ADDRESS);
    console.log('  Address Match:', commitment.officialAddress.toLowerCase() === USER_ADDRESS.toLowerCase());
    console.log('  Is Active:', commitment.isActive);
    console.log('  Is Fulfilled:', commitment.isFulfilled);
    console.log('  Reward Claimed:', commitment.rewardClaimed);
    console.log('  Target Value:', commitment.targetValue.toString(), '(' + (Number(commitment.targetValue) / 100).toFixed(2) + ' μg/m³)');
    
    console.log('\n📊 Fulfillment Check:');
    const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(3);
    console.log('  Fulfilled:', fulfilled);
    console.log('  Current Value:', currentValue.toString(), '(' + (Number(currentValue) / 100).toFixed(2) + ' μg/m³)');
    console.log('  Target Value:', targetValue.toString(), '(' + (Number(targetValue) / 100).toFixed(2) + ' μg/m³)');
    console.log('  Logic Check (PM2.5):', currentValue.toString(), '<=', targetValue.toString(), '=', currentValue <= targetValue);
    
    console.log('\n🔍 Claim Requirements:');
    console.log('  1. Correct Address:', commitment.officialAddress.toLowerCase() === USER_ADDRESS.toLowerCase() ? '✅' : '❌');
    console.log('  2. Is Active:', commitment.isActive ? '✅' : '❌');
    console.log('  3. Not Claimed:', !commitment.rewardClaimed ? '✅' : '❌');
    console.log('  4. Oracle Fulfilled:', fulfilled ? '✅' : '❌');
    
    // Try to simulate the claim call to get the exact error
    console.log('\n🎯 Simulating Claim Call:');
    try {
      // This will fail but give us the exact revert reason
      const result = await contract.claimEnvironmentalReward.staticCall(3, {
        from: USER_ADDRESS
      });
      console.log('✅ Claim would succeed! Tokens rewarded:', result.toString());
    } catch (error) {
      console.log('❌ Claim would fail with error:');
      console.log('   Error:', error.message);
      
      // Try to extract the revert reason
      if (error.message.includes('revert')) {
        const revertMatch = error.message.match(/revert (.+?)(?:\s|$|")/);
        if (revertMatch) {
          console.log('   Revert Reason:', revertMatch[1]);
        }
      }
      
      // Check specific failure reasons
      if (error.message.includes('Only commitment creator can claim')) {
        console.log('   🔍 Issue: Wrong wallet address');
      } else if (error.message.includes('Commitment not active')) {
        console.log('   🔍 Issue: Commitment not active');
      } else if (error.message.includes('Reward already claimed')) {
        console.log('   🔍 Issue: Already claimed');
      } else if (error.message.includes('Environmental target not achieved')) {
        console.log('   🔍 Issue: Oracle check failing');
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugCommitment3();
