const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';
const CONTRACT_ADDRESS = '0xC6aB674d9d251d6bB5f55287109aa44D3cfd74B2';

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
    "function nextCommitmentId() view returns (uint256)",
    "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))"
];

async function checkWalletMismatch() {
    console.log('🔍 Checking Wallet Address Mismatch...\n');
    
    // Setup provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    try {
        // Get total commitments
        const nextId = await contract.nextCommitmentId();
        console.log(`📊 Total commitments: ${nextId.toString()}\n`);
        
        // Check each commitment
        for (let i = 1; i < nextId; i++) {
            console.log(`🌱 Commitment #${i}:`);
            
            try {
                const commitment = await contract.getCommitment(i);
                
                console.log(`   📝 Title: ${commitment.title}`);
                console.log(`   👤 Creator Address: ${commitment.officialAddress}`);
                console.log(`   👤 Creator Name: ${commitment.officialName}`);
                console.log(`   💰 Reward Claimed: ${commitment.rewardClaimed}`);
                console.log(`   ✅ Active: ${commitment.isActive}`);
                
                // Show what wallet addresses can claim this reward
                console.log(`\n   🔑 TO CLAIM THIS REWARD:`);
                console.log(`   Connect MetaMask with: ${commitment.officialAddress}`);
                console.log(`   (This is the wallet that created the commitment)\n`);
                
            } catch (error) {
                console.log(`   ❌ Error: ${error.message}\n`);
            }
        }
        
        console.log(`🔧 SOLUTION:`);
        console.log(`1. Open MetaMask`);
        console.log(`2. Switch to the wallet address shown above`);
        console.log(`3. Make sure you're on Sepolia network`);
        console.log(`4. Try claiming the reward again`);
        console.log(`\nOR`);
        console.log(`Create a new commitment with your current wallet to test the reward system.`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the check
checkWalletMismatch().catch(console.error);
