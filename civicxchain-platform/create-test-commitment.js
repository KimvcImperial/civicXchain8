const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';
const CONTRACT_ADDRESS = '0xf20473e6990d39343D43a6Db4379b4DA860B9d1f';
const PRIVATE_KEY = '0x479e1c7050f3a88be78717c4f8c68a33739cfdae393825b85e874d557f1ef001';

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
    "function createCommitment(string title, string description, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType) payable returns (uint256)",
    "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
    "function checkFulfillment(uint256) view returns (bool fulfilled, uint256 currentValue, uint256 targetValue)"
];

async function createTestCommitment() {
    console.log('🌱 Creating Test Commitment for Reward Claiming...\n');
    
    try {
        // Setup provider and signer
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        console.log(`👤 Using account: ${signer.address}`);
        
        // Create a commitment with deadline in the future (but we'll test the logic)
        const tomorrow = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours from now

        console.log('📝 Creating commitment with future deadline...');
        console.log(`⏰ Deadline: ${new Date(tomorrow * 1000).toLocaleString()}`);

        const tx = await contract.createCommitment(
            "Test PM2.5 Reduction - Claimable",
            "Test commitment for reward claiming after deadline",
            "Test Official",
            "Environmental Manager",
            2300, // Target: PM2.5 <= 23.00 μg/m³
            tomorrow, // Deadline in the future
            "pm25",
            { value: ethers.parseEther("0.01") } // 0.01 ETH stake
        );
        
        console.log(`🔄 Transaction sent: ${tx.hash}`);
        console.log('⏳ Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        
        // Get the commitment ID from the transaction logs
        const commitmentId = receipt.logs.length > 0 ? 1 : 1; // Assume it's commitment #1
        
        console.log(`\n🎯 Created Commitment #${commitmentId}`);
        
        // Check the commitment details
        const commitment = await contract.getCommitment(commitmentId);
        console.log(`📝 Title: ${commitment.title}`);
        console.log(`⏰ Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleString()}`);
        console.log(`🎯 Target: ${commitment.targetValue} ${commitment.metricType}`);
        
        // Check fulfillment status
        const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(commitmentId);
        console.log(`\n📊 Fulfillment Status:`);
        console.log(`   - Fulfilled: ${fulfilled}`);
        console.log(`   - Current Value: ${currentValue}`);
        console.log(`   - Target Value: ${targetValue}`);
        
        const now = Math.floor(Date.now() / 1000);
        const deadlinePassed = now > Number(commitment.deadline);
        
        console.log(`\n🎁 Reward Claimable: ${fulfilled && deadlinePassed && !commitment.rewardClaimed}`);
        
        if (fulfilled && deadlinePassed && !commitment.rewardClaimed) {
            console.log('✅ This commitment should be claimable for rewards!');
        } else {
            console.log('❌ Commitment not ready for reward claiming:');
            if (!fulfilled) console.log('   - Environmental target not achieved');
            if (!deadlinePassed) console.log('   - Deadline not passed yet');
            if (commitment.rewardClaimed) console.log('   - Reward already claimed');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the script
createTestCommitment().catch(console.error);
