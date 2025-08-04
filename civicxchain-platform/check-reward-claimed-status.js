const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function checkRewardClaimedStatus() {
  console.log('🔍 Checking Reward Claimed Status');
  console.log('=' .repeat(50));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    // Extended ABI to get the full commitment struct
    const abi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))',
      'function nextCommitmentId() view returns (uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    // Get total commitments
    const nextId = await contract.nextCommitmentId();
    const totalCommitments = Number(nextId) - 1;
    
    console.log(`📊 Checking all ${totalCommitments} commitments...\n`);
    
    // Check each commitment
    for (let i = 1; i <= totalCommitments; i++) {
      try {
        const commitment = await contract.getCommitment(i);
        
        console.log(`🌱 Commitment #${i}:`);
        console.log(`   Title: ${commitment.title}`);
        console.log(`   Official: ${commitment.officialName}`);
        console.log(`   Creator: ${commitment.officialAddress}`);
        console.log(`   Is Active: ${commitment.isActive}`);
        console.log(`   Is Fulfilled: ${commitment.isFulfilled}`);
        console.log(`   Reward Claimed: ${commitment.rewardClaimed}`);
        console.log(`   Stake Amount: ${ethers.formatEther(commitment.stakeAmount)} ETH`);
        console.log(`   Token Reward: ${commitment.tokenReward.toString()}`);
        
        // Determine claimability
        const canClaim = commitment.isActive && 
                        commitment.isFulfilled && 
                        !commitment.rewardClaimed;
        
        console.log(`   🎁 Can Claim: ${canClaim ? '✅ YES' : '❌ NO'}`);
        
        if (!canClaim) {
          const reasons = [];
          if (!commitment.isActive) reasons.push('Not active');
          if (!commitment.isFulfilled) reasons.push('Not fulfilled');
          if (commitment.rewardClaimed) reasons.push('Already claimed');
          console.log(`   ❌ Reasons: ${reasons.join(', ')}`);
        }
        
        console.log('');
      } catch (error) {
        console.log(`❌ Error getting commitment ${i}:`, error.message);
      }
    }
    
    console.log('💡 SUMMARY:');
    console.log('   - If "Reward Claimed" is true, the reward was already claimed');
    console.log('   - If "Is Fulfilled" is false, the environmental target wasn\'t achieved');
    console.log('   - You can only claim rewards where "Can Claim" shows ✅ YES');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRewardClaimedStatus();
