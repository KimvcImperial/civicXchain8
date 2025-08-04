const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';
const CONTRACT_ADDRESS = '0xf20473e6990d39343D43a6Db4379b4DA860B9d1f';
const PRIVATE_KEY = '0x479e1c7050f3a88be78717c4f8c68a33739cfdae393825b85e874d557f1ef001';

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
    "function claimEnvironmentalReward(uint256 _commitmentId) returns (uint256)",
    "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
    "function checkFulfillment(uint256) view returns (bool fulfilled, uint256 currentValue, uint256 targetValue)"
];

async function testDirectClaim() {
    console.log('🎯 Testing Direct Reward Claim for Commitment #2...\n');
    
    try {
        // Setup provider and signer
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        console.log(`👤 Using account: ${signer.address}`);
        
        const commitmentId = 2;
        
        // Check commitment status before claiming
        console.log(`\n📊 Checking Commitment #${commitmentId} before claiming...`);
        const commitment = await contract.getCommitment(commitmentId);
        console.log(`📝 Title: ${commitment.title}`);
        console.log(`⏰ Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleString()}`);
        console.log(`✅ Active: ${commitment.isActive}`);
        console.log(`💰 Reward Claimed: ${commitment.rewardClaimed}`);
        
        // Check fulfillment
        const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(commitmentId);
        console.log(`🎯 Fulfilled: ${fulfilled} (${currentValue} <= ${targetValue})`);
        
        // Check if deadline passed
        const now = Math.floor(Date.now() / 1000);
        const deadlinePassed = now >= Number(commitment.deadline);
        console.log(`⏰ Deadline passed: ${deadlinePassed}`);
        
        if (!commitment.isActive) {
            console.log('❌ Cannot claim: Commitment not active');
            return;
        }
        if (commitment.rewardClaimed) {
            console.log('❌ Cannot claim: Reward already claimed');
            return;
        }
        if (!deadlinePassed) {
            console.log('❌ Cannot claim: Deadline not reached yet');
            return;
        }
        if (!fulfilled) {
            console.log('❌ Cannot claim: Environmental target not achieved');
            return;
        }
        
        console.log('\n🎉 All conditions met! Attempting to claim reward...');
        
        // Estimate gas first
        try {
            const gasEstimate = await contract.claimEnvironmentalReward.estimateGas(commitmentId);
            console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);
        } catch (gasError) {
            console.log(`❌ Gas estimation failed: ${gasError.message}`);
            
            // Try to get more specific error
            if (gasError.message.includes('Only commitment creator can claim')) {
                console.log('💡 Make sure you\'re using the same wallet that created the commitment');
            } else if (gasError.message.includes('Deadline not reached yet')) {
                console.log('💡 The deadline hasn\'t passed yet according to the blockchain');
            } else if (gasError.message.includes('Environmental target not achieved')) {
                console.log('💡 The environmental target is not met according to the oracle');
            }
            return;
        }
        
        // Execute the claim
        const tx = await contract.claimEnvironmentalReward(commitmentId);
        console.log(`🔄 Transaction sent: ${tx.hash}`);
        console.log('⏳ Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        console.log(`🎉 Reward claimed successfully!`);
        
        // Check commitment status after claiming
        const updatedCommitment = await contract.getCommitment(commitmentId);
        console.log(`\n📊 Updated status:`);
        console.log(`💰 Reward Claimed: ${updatedCommitment.rewardClaimed}`);
        console.log(`🏆 Fulfilled: ${updatedCommitment.isFulfilled}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        // Parse common errors
        if (error.message.includes('Only commitment creator can claim')) {
            console.log('💡 Solution: Use the wallet that created the commitment');
        } else if (error.message.includes('Deadline not reached yet')) {
            console.log('💡 Solution: Wait for the deadline to pass');
        } else if (error.message.includes('Environmental target not achieved')) {
            console.log('💡 Solution: Wait for environmental conditions to improve');
        }
    }
}

// Run the test
testDirectClaim().catch(console.error);
