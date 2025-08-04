const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';
const CONTRACT_ADDRESS = '0xf20473e6990d39343D43a6Db4379b4DA860B9d1f';
const PRIVATE_KEY = '0x479e1c7050f3a88be78717c4f8c68a33739cfdae393825b85e874d557f1ef001';

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
    "function createCommitment(string title, string description, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType) payable returns (uint256)",
    "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
    "function checkFulfillment(uint256) view returns (bool fulfilled, uint256 currentValue, uint256 targetValue)",
    "function nextCommitmentId() view returns (uint256)"
];

async function createPastDeadlineCommitment() {
    console.log('🌱 Creating Commitment with Past Deadline for Testing...\n');
    
    try {
        // Setup provider and signer
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        console.log(`👤 Using account: ${signer.address}`);
        
        // Get current commitment count
        const nextId = await contract.nextCommitmentId();
        console.log(`📊 Next commitment ID will be: ${nextId}`);
        
        // Create a commitment with deadline just 1 minute from now (so it passes quickly)
        const oneMinuteFromNow = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
        
        console.log('📝 Creating commitment with 1-minute deadline...');
        console.log(`⏰ Deadline: ${new Date(oneMinuteFromNow * 1000).toLocaleString()}`);
        
        const tx = await contract.createCommitment(
            "Test PM2.5 - Quick Deadline",
            "Test commitment with 1-minute deadline for immediate reward testing",
            "Test Official",
            "Environmental Manager", 
            2300, // Target: PM2.5 <= 23.00 μg/m³ (current is ~12.50, so this will be achieved)
            oneMinuteFromNow, // Deadline in 1 minute
            "pm25",
            { value: ethers.parseEther("0.01") } // 0.01 ETH stake
        );
        
        console.log(`🔄 Transaction sent: ${tx.hash}`);
        console.log('⏳ Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        
        // Get the commitment ID
        const commitmentId = nextId;
        
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
        
        console.log(`\n⏰ WAIT 1 MINUTE, then try claiming reward for commitment #${commitmentId}`);
        console.log(`🎁 After 1 minute, this commitment should be claimable!`);
        
        // Start a countdown
        let secondsLeft = 60;
        const countdown = setInterval(() => {
            process.stdout.write(`\r⏳ Time until claimable: ${secondsLeft} seconds...`);
            secondsLeft--;
            
            if (secondsLeft < 0) {
                clearInterval(countdown);
                console.log('\n\n🎉 DEADLINE PASSED! Commitment should now be claimable!');
                console.log(`🎯 Go to the frontend and try claiming reward for commitment #${commitmentId}`);
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the script
createPastDeadlineCommitment().catch(console.error);
