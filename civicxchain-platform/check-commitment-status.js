const { ethers } = require('ethers');

async function checkCommitmentStatus() {
    console.log("🔍 Checking commitment eligibility for rewards...");
    
    // Use Sepolia RPC
    const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
    const contractAddress = "0xC6aB674d9d251d6bB5f55287109aa44D3cfd74B2";
    
    // Contract ABI for checking commitment status
    const contractABI = [
        "function nextCommitmentId() view returns (uint256)",
        "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
        "function getCurrentEnvironmentalValue(string) view returns (uint256)",
        "function balanceOf(address) view returns (uint256)"
    ];

    try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        // Get total commitments
        const nextId = await contract.nextCommitmentId();
        console.log(`📊 Total commitments: ${nextId.toString()}`);
        
        // Check each commitment
        for (let i = 0; i < nextId; i++) {
            console.log(`\n🌱 Checking Commitment #${i}:`);
            
            try {
                const commitment = await contract.getCommitment(i);
                
                if (!commitment.title || commitment.title.length === 0) {
                    console.log(`   ⚠️  Empty commitment - skipping`);
                    continue;
                }
                
                console.log(`   📝 Title: "${commitment.title}"`);
                console.log(`   👤 Official: ${commitment.officialName}`);
                console.log(`   🎯 Target: ${commitment.targetValue} ${commitment.metricType}`);
                console.log(`   ⏰ Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleString()}`);
                console.log(`   ✅ Active: ${commitment.isActive}`);
                console.log(`   🏆 Fulfilled: ${commitment.isFulfilled}`);
                console.log(`   💰 Reward Claimed: ${commitment.rewardClaimed}`);
                console.log(`   💎 Stake Amount: ${ethers.formatEther(commitment.stakeAmount)} ETH`);
                console.log(`   🪙 Token Reward: ${commitment.tokenReward} CIVIC`);
                
                // Check current environmental value
                try {
                    const currentValue = await contract.getCurrentEnvironmentalValue(commitment.metricType);
                    console.log(`   📊 Current ${commitment.metricType}: ${currentValue}`);
                    
                    // Check if target is met
                    const targetMet = Number(currentValue) <= Number(commitment.targetValue);
                    console.log(`   🎯 Target Met: ${targetMet ? '✅ YES' : '❌ NO'}`);
                    
                    // Check if eligible for reward
                    const eligible = commitment.isActive && !commitment.isFulfilled && !commitment.rewardClaimed && targetMet;
                    console.log(`   🏆 Eligible for Reward: ${eligible ? '✅ YES' : '❌ NO'}`);
                    
                    if (!eligible) {
                        console.log(`   ❓ Why not eligible:`);
                        if (!commitment.isActive) console.log(`      - Commitment not active`);
                        if (commitment.isFulfilled) console.log(`      - Already fulfilled`);
                        if (commitment.rewardClaimed) console.log(`      - Reward already claimed`);
                        if (!targetMet) console.log(`      - Target not met (${currentValue} > ${commitment.targetValue})`);
                    }
                    
                } catch (error) {
                    console.log(`   ❌ Error getting current value: ${error.message}`);
                }
                
            } catch (error) {
                console.log(`   ❌ Error reading commitment: ${error.message}`);
            }
        }
        
        // Check contract balance
        try {
            const balance = await provider.getBalance(contractAddress);
            console.log(`\n💰 Contract ETH Balance: ${ethers.formatEther(balance)} ETH`);
            
            if (Number(ethers.formatEther(balance)) < 0.1) {
                console.log(`   ⚠️  WARNING: Contract has insufficient ETH for rewards!`);
                console.log(`   💡 Need to fund contract with more ETH`);
            }
        } catch (error) {
            console.log(`❌ Error checking contract balance: ${error.message}`);
        }
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

checkCommitmentStatus();
