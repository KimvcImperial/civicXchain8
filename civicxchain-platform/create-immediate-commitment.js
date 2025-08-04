const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';
const CONTRACT_ADDRESS = '0xf20473e6990d39343D43a6Db4379b4DA860B9d1f';
const PRIVATE_KEY = '0x479e1c7050f3a88be78717c4f8c68a33739cfdae393825b85e874d557f1ef001';

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
    "function createCommitment(string title, string description, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType) payable returns (uint256)",
    "function nextCommitmentId() view returns (uint256)"
];

async function createImmediateCommitment() {
    console.log('🚀 Creating Commitment with Immediate Past Deadline...\n');
    
    try {
        // Setup provider and signer
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        console.log(`👤 Using account: ${signer.address}`);
        
        // Get current commitment count
        const nextId = await contract.nextCommitmentId();
        console.log(`📊 Next commitment ID will be: ${nextId}`);
        
        // Create a commitment with deadline 10 seconds from now
        const tenSecondsFromNow = Math.floor(Date.now() / 1000) + 10;
        
        console.log('📝 Creating commitment with 10-second deadline...');
        console.log(`⏰ Deadline: ${new Date(tenSecondsFromNow * 1000).toLocaleString()}`);
        
        const tx = await contract.createCommitment(
            "Immediate Test - PM2.5",
            "Commitment with 10-second deadline for immediate testing",
            "Test Official",
            "Environmental Manager", 
            2300, // Target: PM2.5 <= 23.00 μg/m³ (current is ~12.50, so this will be achieved)
            tenSecondsFromNow, // Deadline in 10 seconds
            "pm25",
            { value: ethers.parseEther("0.01") } // 0.01 ETH stake
        );
        
        console.log(`🔄 Transaction sent: ${tx.hash}`);
        console.log('⏳ Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        
        console.log(`\n🎯 Created Commitment #${nextId}`);
        console.log(`⏰ Deadline: ${new Date(tenSecondsFromNow * 1000).toLocaleString()}`);
        
        // Countdown
        console.log('\n⏳ Waiting for deadline to pass...');
        let secondsLeft = 10;
        const countdown = setInterval(() => {
            process.stdout.write(`\r⏰ Time until claimable: ${secondsLeft} seconds...`);
            secondsLeft--;
            
            if (secondsLeft < 0) {
                clearInterval(countdown);
                console.log('\n\n🎉 DEADLINE PASSED! Commitment is now claimable!');
                console.log(`🎯 Go to frontend and select Commitment #${nextId} to claim reward!`);
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the script
createImmediateCommitment().catch(console.error);
