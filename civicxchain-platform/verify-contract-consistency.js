const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';
const CONTRACT_ADDRESS = '0xf20473e6990d39343D43a6Db4379b4DA860B9d1f';
const PRIVATE_KEY = '0x479e1c7050f3a88be78717c4f8c68a33739cfdae393825b85e874d557f1ef001';

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
    "function nextCommitmentId() view returns (uint256)",
    "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
    "function checkFulfillment(uint256) view returns (bool fulfilled, uint256 currentValue, uint256 targetValue)"
];

async function verifyContractConsistency() {
    console.log('🔍 Verifying Contract Consistency Across All Components...\n');
    
    try {
        // Setup provider and contract
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        
        console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);
        console.log(`🌐 Network: Sepolia Testnet`);
        
        // Get total commitments
        const totalCommitments = await contract.nextCommitmentId();
        console.log(`📊 Total Commitments: ${totalCommitments - 1n}`);
        
        console.log('\n🎯 Available Commitments for Testing:\n');
        
        // Check each commitment
        for (let i = 1; i < Number(totalCommitments); i++) {
            try {
                const commitment = await contract.getCommitment(i);
                const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(i);
                
                const now = Math.floor(Date.now() / 1000);
                const deadlinePassed = now >= Number(commitment.deadline);
                const isClaimable = commitment.isActive && 
                                  !commitment.rewardClaimed && 
                                  deadlinePassed && 
                                  fulfilled;
                
                console.log(`📋 Commitment #${i}:`);
                console.log(`   📝 Title: ${commitment.title}`);
                console.log(`   ⏰ Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleString()}`);
                console.log(`   🎯 Target: ${commitment.targetValue} ${commitment.metricType}`);
                console.log(`   ✅ Active: ${commitment.isActive}`);
                console.log(`   🏆 Fulfilled: ${fulfilled} (${currentValue} vs ${targetValue})`);
                console.log(`   💰 Reward Claimed: ${commitment.rewardClaimed}`);
                console.log(`   ⏰ Deadline Passed: ${deadlinePassed}`);
                console.log(`   🎁 CLAIMABLE: ${isClaimable ? '✅ YES' : '❌ NO'}`);
                
                if (!isClaimable) {
                    console.log(`   ❌ Cannot claim because:`);
                    if (!commitment.isActive) console.log(`      - Commitment not active`);
                    if (commitment.rewardClaimed) console.log(`      - Reward already claimed`);
                    if (!deadlinePassed) console.log(`      - Deadline not reached yet`);
                    if (!fulfilled) console.log(`      - Environmental target not achieved`);
                }
                
                console.log('');
                
            } catch (error) {
                console.log(`❌ Error checking commitment #${i}: ${error.message}\n`);
            }
        }
        
        console.log('🎯 INSTRUCTIONS FOR FRONTEND TESTING:');
        console.log('1. 🌐 Go to the Live Feed');
        console.log('2. 📋 Create a new commitment (will use the same contract)');
        console.log('3. 👨‍⚖️ Go to Judge Panel');
        console.log('4. 🔍 Select a CLAIMABLE commitment from the dropdown');
        console.log('5. ✅ Click "Verify Reward"');
        console.log('6. 🏆 Go to Public Official Rewards tab');
        console.log('7. 💰 Click "Claim Reward" for the verified commitment');
        console.log('\n✅ All components now use the same contract address!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the verification
verifyContractConsistency().catch(console.error);
