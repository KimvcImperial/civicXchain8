const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';
const CONTRACT_ADDRESS = '0xC6aB674d9d251d6bB5f55287109aa44D3cfd74B2';

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
    "function nextCommitmentId() view returns (uint256)",
    "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
    "function checkFulfillment(uint256) view returns (bool fulfilled, uint256 currentValue, uint256 targetValue)",
    "function getCurrentEnvironmentalValue(string) view returns (uint256)",
    "function claimEnvironmentalReward(uint256) returns (uint256)"
];

async function testRewardClaim() {
    console.log('🔍 Testing Reward Claim Functionality...\n');
    
    // Setup provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    try {
        // Get total commitments
        const nextId = await contract.nextCommitmentId();
        console.log(`📊 Total commitments: ${nextId.toString()}`);
        
        // Check each commitment
        for (let i = 1; i < nextId; i++) {
            console.log(`\n🌱 Checking Commitment #${i}:`);
            
            try {
                const commitment = await contract.getCommitment(i);
                
                console.log(`   📝 Title: ${commitment.title}`);
                console.log(`   👤 Official: ${commitment.officialAddress}`);
                console.log(`   🎯 Target: ${commitment.targetValue} ${commitment.metricType}`);
                console.log(`   ⏰ Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleString()}`);
                console.log(`   ✅ Active: ${commitment.isActive}`);
                console.log(`   🏆 Fulfilled: ${commitment.isFulfilled}`);
                console.log(`   💰 Reward Claimed: ${commitment.rewardClaimed}`);
                
                // Check current environmental value
                const currentValue = await contract.getCurrentEnvironmentalValue(commitment.metricType);
                console.log(`   📊 Current ${commitment.metricType}: ${currentValue}`);
                
                // Check fulfillment status
                const [fulfilled, currentVal, targetVal] = await contract.checkFulfillment(i);
                console.log(`   ✅ Fulfillment Check:`);
                console.log(`      - Fulfilled: ${fulfilled}`);
                console.log(`      - Current Value: ${currentVal}`);
                console.log(`      - Target Value: ${targetVal}`);
                console.log(`      - Logic: ${commitment.metricType === 'pm25' ? 'current <= target' : 'current >= target'}`);
                
                // Check if claimable
                const now = Math.floor(Date.now() / 1000);
                const isClaimable = commitment.isActive && 
                                  !commitment.rewardClaimed && 
                                  now <= commitment.deadline && 
                                  fulfilled;
                
                console.log(`   🎁 Claimable: ${isClaimable}`);
                
                if (!isClaimable) {
                    console.log(`   ❌ Cannot claim because:`);
                    if (!commitment.isActive) console.log(`      - Commitment not active`);
                    if (commitment.rewardClaimed) console.log(`      - Reward already claimed`);
                    if (now > commitment.deadline) console.log(`      - Deadline passed`);
                    if (!fulfilled) console.log(`      - Environmental target not achieved`);
                }
                
            } catch (error) {
                console.log(`   ❌ Error checking commitment: ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the test
testRewardClaim().catch(console.error);
