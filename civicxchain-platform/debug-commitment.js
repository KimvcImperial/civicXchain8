const { ethers } = require('ethers');
const { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } = require('./frontend/config/contracts.js');

async function debugCommitment() {
    try {
        console.log('🔍 Debugging Commitment Status...\n');
        
        // Connect to Sepolia
        const provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
        const contract = new ethers.Contract(CONTRACT_CONFIG.GOVERNANCE_CONTRACT, CIVIC_CONTRACT_ABI, provider);
        
        // Check all commitments to find any with passed deadlines
        const nextCommitmentId = await contract.nextCommitmentId();
        const totalCommitments = Number(nextCommitmentId) - 1;

        console.log(`📊 Total Commitments: ${totalCommitments}\n`);

        for (let commitmentId = 1; commitmentId <= totalCommitments; commitmentId++) {
        
        console.log(`📋 Checking Commitment ID: ${commitmentId}`);
        console.log(`📍 Contract Address: ${CONTRACT_CONFIG.GOVERNANCE_CONTRACT}`);
        console.log(`🌐 Network: ${CONTRACT_CONFIG.NETWORK}\n`);
        
        // Get commitment data
        const commitment = await contract.getCommitment(commitmentId);
        console.log('📊 Commitment Data:');
        console.log(`   Title: ${commitment.title}`);
        console.log(`   Official: ${commitment.officialName} (${commitment.officialRole})`);
        console.log(`   Target: ${commitment.targetValue.toString()} μg/m³`);
        console.log(`   Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleString()}`);
        console.log(`   Active: ${commitment.isActive}`);
        console.log(`   Fulfilled: ${commitment.isFulfilled}`);
        console.log(`   Reward Claimed: ${commitment.rewardClaimed}`);
        console.log(`   Stake Amount: ${ethers.formatEther(commitment.stakeAmount)} ETH`);
        console.log(`   Token Reward: ${commitment.tokenReward.toString()} CIVIC\n`);
        
        // Check fulfillment status
        try {
            const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(commitmentId);
            console.log('🎯 Fulfillment Status:');
            console.log(`   Current PM2.5: ${currentValue.toString()} μg/m³`);
            console.log(`   Target PM2.5: ${targetValue.toString()} μg/m³`);
            console.log(`   Target Achieved: ${fulfilled}\n`);
        } catch (error) {
            console.log(`❌ Error checking fulfillment: ${error.message}\n`);
        }
        
        // Check current time vs deadline
        const now = Math.floor(Date.now() / 1000);
        const deadline = Number(commitment.deadline);
        const deadlinePassed = now >= deadline;
        
        console.log('⏰ Timing Analysis:');
        console.log(`   Current Time: ${new Date(now * 1000).toLocaleString()}`);
        console.log(`   Deadline: ${new Date(deadline * 1000).toLocaleString()}`);
        console.log(`   Deadline Passed: ${deadlinePassed}`);
        console.log(`   Time Until Deadline: ${Math.ceil((deadline - now) / (24 * 60 * 60))} days\n`);
        
        // Check claimability
        const isClaimable = commitment.isActive && 
                           !commitment.rewardClaimed && 
                           deadlinePassed;
        
        console.log('💰 Reward Claimability:');
        console.log(`   Can Claim: ${isClaimable}`);
        
        if (!isClaimable) {
            console.log('   ❌ Cannot claim because:');
            if (!commitment.isActive) console.log('      - Commitment not active');
            if (commitment.rewardClaimed) console.log('      - Reward already claimed');
            if (!deadlinePassed) console.log('      - Deadline not reached yet (MAIN ISSUE!)');
        }
        
        // Try to estimate gas for claiming (this will show the exact error)
        if (deadlinePassed) {
            try {
                const gasEstimate = await contract.claimEnvironmentalReward.estimateGas(commitmentId);
                console.log(`   ⛽ Gas Estimate: ${gasEstimate.toString()}`);
            } catch (gasError) {
                console.log(`   ❌ Gas Estimation Failed: ${gasError.message}`);
            }
        }

        console.log('\n' + '='.repeat(80) + '\n');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the debug
debugCommitment().catch(console.error);
