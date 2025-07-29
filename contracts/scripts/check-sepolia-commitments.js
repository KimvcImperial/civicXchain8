const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🔍 Checking Sepolia Contract State...");
    console.log("=====================================");

    // Load deployed addresses
    const deployedAddressesPath = path.join(__dirname, '../../frontend/config/deployed-addresses.json');
    const deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, 'utf8'));

    const contractAddress = deployedAddresses.GOVERNANCE_CONTRACT;
    console.log(`📋 Contract Address: ${contractAddress}`);

    // Connect to Sepolia
    const provider = new ethers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");

    // Contract ABI (minimal for checking)
    const contractABI = [
        "function nextCommitmentId() view returns (uint256)",
        "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
        "function environmentalOracle() view returns (address)"
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    
    try {
        // Check next commitment ID
        const nextId = await contract.nextCommitmentId();
        console.log(`🆔 Next Commitment ID: ${nextId}`);
        
        if (nextId > 1) {
            console.log(`\n📋 Found ${nextId - 1} commitment(s). Checking details...\n`);
            
            // Check each commitment
            for (let i = 1; i < nextId; i++) {
                try {
                    const commitment = await contract.getCommitment(i);
                    console.log(`--- Commitment #${i} ---`);
                    console.log(`Title: ${commitment.title}`);
                    console.log(`Description: ${commitment.description}`);
                    console.log(`Official: ${commitment.officialName} (${commitment.officialRole})`);
                    console.log(`Address: ${commitment.officialAddress}`);
                    console.log(`Target: ${commitment.targetValue} ${commitment.metricType}`);
                    console.log(`Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleDateString()}`);
                    console.log(`Active: ${commitment.isActive}`);
                    console.log(`Fulfilled: ${commitment.isFulfilled}`);
                    console.log(`Stake: ${ethers.formatEther(commitment.stakeAmount)} ETH`);
                    console.log(`Reward: ${commitment.tokenReward} tokens`);
                    console.log("");
                } catch (error) {
                    console.log(`❌ Error reading commitment #${i}: ${error.message}`);
                }
            }
        } else {
            console.log("📭 No commitments found on this contract.");
            console.log("\n💡 This means either:");
            console.log("   1. No commitments have been created yet");
            console.log("   2. The contract was redeployed and old commitments are gone");
            console.log("   3. There's a connection issue");
        }
        
        // Check oracle address
        try {
            const oracleAddress = await contract.environmentalOracle();
            console.log(`🌍 Environmental Oracle: ${oracleAddress}`);
        } catch (error) {
            console.log(`❌ Could not read oracle address: ${error.message}`);
        }
        
    } catch (error) {
        console.log(`❌ Error connecting to contract: ${error.message}`);
        console.log("\n🔧 Possible issues:");
        console.log("   1. Contract address is incorrect");
        console.log("   2. Network connection problem");
        console.log("   3. Contract was not deployed properly");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
