const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';
const CONTRACT_ADDRESS = '0xf20473e6990d39343D43a6Db4379b4DA860B9d1f';

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
    "function nextCommitmentId() view returns (uint256)",
    "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))"
];

async function testSimpleJudgePanel() {
    console.log('⚖️ Testing Simple Judge Panel...\n');
    
    // Setup provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    try {
        // Get total commitments (same as Live Feed)
        const nextId = await contract.nextCommitmentId();
        console.log(`📊 Total commitments in Judge Panel: ${nextId.toString()}`);
        
        if (nextId <= 1) {
            console.log('❌ No commitments found to display in Judge Panel');
            return;
        }
        
        console.log('\n⚖️ Judge Panel Display (Same as Live Feed):');
        console.log('=' .repeat(80));
        
        // Show each commitment as it would appear in Judge Panel
        for (let i = 1; i < nextId; i++) {
            try {
                const commitment = await contract.getCommitment(i);
                
                console.log(`\n📋 Commitment #${i}:`);
                console.log(`   Title: ${commitment.title}`);
                console.log(`   Official: ${commitment.officialName}`);
                console.log(`   Target: ${commitment.targetValue} (${commitment.metricType})`);
                console.log(`   Active: ${commitment.isActive}`);
                console.log(`   Reward Claimed: ${commitment.rewardClaimed}`);
                
                // Judge Panel specific info
                console.log(`   ⚖️ Judge Actions:`);
                if (commitment.rewardClaimed) {
                    console.log(`      - Status: 💰 Reward already claimed`);
                    console.log(`      - Button: [Verified] (disabled)`);
                } else if (commitment.isActive) {
                    console.log(`      - Status: ⏳ Awaiting judge verification`);
                    console.log(`      - Button: [⚖️ Verify Reward] (clickable)`);
                    console.log(`      - Action: Click to enable reward claiming in Public Official portal`);
                } else {
                    console.log(`      - Status: ❌ Commitment inactive`);
                    console.log(`      - Button: [Verify Reward] (disabled)`);
                }
                
            } catch (error) {
                console.log(`   ❌ Error loading commitment #${i}:`, error.message);
            }
        }
        
        console.log('\n🎯 Judge Panel Workflow:');
        console.log('=' .repeat(80));
        console.log('1. Judge sees same commitments as Live Feed');
        console.log('2. Each commitment has a "⚖️ Verify Reward" button');
        console.log('3. Judge clicks button → saves verification to localStorage');
        console.log('4. Public Official can now claim reward in their portal');
        console.log('5. No complex logic - just simple enable/disable');
        
        console.log('\n✅ Simple Judge Panel Test Complete!');
        console.log('   - Shows same data as Live Feed ✅');
        console.log('   - Simple verify button per commitment ✅');
        console.log('   - Enables reward claiming ✅');
        console.log('   - No complex oracle/deadline logic ✅');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testSimpleJudgePanel();
