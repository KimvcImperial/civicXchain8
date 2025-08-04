const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';
const USER_ADDRESS = '0xE46f6d0f815497fb6b64aD75c5020FD93bc72e57'; // The wallet trying to claim

async function debugFailedTransactions() {
  console.log('🔍 Debugging Failed Claim Transactions');
  console.log('=' .repeat(50));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    const abi = [
      'function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))',
      'function checkFulfillment(uint256) view returns (bool, uint256, uint256)',
      'function claimEnvironmentalReward(uint256) returns (uint256)',
      'function balanceOf(address) view returns (uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    // Test both commitments that were attempted
    for (const commitmentId of [3, 4]) {
      console.log(`\n🌱 Testing Commitment #${commitmentId}:`);
      
      const commitment = await contract.getCommitment(commitmentId);
      console.log('  Title:', commitment.title);
      console.log('  Official Address:', commitment.officialAddress);
      console.log('  User Address:', USER_ADDRESS);
      console.log('  Address Match:', commitment.officialAddress.toLowerCase() === USER_ADDRESS.toLowerCase());
      console.log('  Is Active:', commitment.isActive);
      console.log('  Is Fulfilled:', commitment.isFulfilled);
      console.log('  Reward Claimed:', commitment.rewardClaimed);
      
      // Check fulfillment
      const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(commitmentId);
      console.log('  Oracle Fulfilled:', fulfilled);
      console.log('  Current Value:', currentValue.toString());
      console.log('  Target Value:', targetValue.toString());
      
      // Check contract balances
      const contractTokenBalance = await contract.balanceOf(CONTRACT_ADDRESS);
      const contractEthBalance = await provider.getBalance(CONTRACT_ADDRESS);
      console.log('  Contract Token Balance:', contractTokenBalance.toString());
      console.log('  Contract ETH Balance:', ethers.formatEther(contractEthBalance), 'ETH');
      
      // Try to simulate the exact claim call that failed
      console.log('\n  🎯 Simulating Claim Call:');
      try {
        // Use staticCall to simulate without actually executing
        const result = await contract.claimEnvironmentalReward.staticCall(commitmentId, {
          from: USER_ADDRESS
        });
        console.log('  ✅ Claim would succeed! Tokens rewarded:', result.toString());
      } catch (error) {
        console.log('  ❌ Claim would fail with error:');
        console.log('     Raw Error:', error.message);
        
        // Try to extract the specific revert reason
        if (error.message.includes('revert')) {
          const revertMatch = error.message.match(/revert (.+?)(?:\s|$|")/);
          if (revertMatch) {
            console.log('     Revert Reason:', revertMatch[1]);
          }
        }
        
        // Check specific conditions
        console.log('\n  🔍 Checking Claim Requirements:');
        console.log('     1. Correct Address:', commitment.officialAddress.toLowerCase() === USER_ADDRESS.toLowerCase() ? '✅' : '❌');
        console.log('     2. Is Active:', commitment.isActive ? '✅' : '❌');
        console.log('     3. Not Already Claimed:', !commitment.rewardClaimed ? '✅' : '❌');
        console.log('     4. Oracle Fulfilled:', fulfilled ? '✅' : '❌');
        console.log('     5. Contract Has Tokens:', contractTokenBalance > 0 ? '✅' : '❌');
        console.log('     6. Contract Has ETH:', contractEthBalance > 0 ? '✅' : '❌');
        
        // Identify the specific issue
        if (commitment.officialAddress.toLowerCase() !== USER_ADDRESS.toLowerCase()) {
          console.log('     🚨 ISSUE: Wrong wallet address!');
        } else if (!commitment.isActive) {
          console.log('     🚨 ISSUE: Commitment not active!');
        } else if (commitment.rewardClaimed) {
          console.log('     🚨 ISSUE: Reward already claimed!');
        } else if (!fulfilled) {
          console.log('     🚨 ISSUE: Oracle check failing!');
        } else if (contractTokenBalance <= 0) {
          console.log('     🚨 ISSUE: Contract has no tokens!');
        } else if (contractEthBalance <= 0) {
          console.log('     🚨 ISSUE: Contract has no ETH!');
        } else {
          console.log('     🚨 ISSUE: Unknown error - check smart contract logic!');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugFailedTransactions();
