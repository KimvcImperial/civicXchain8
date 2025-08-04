#!/usr/bin/env node

const { ethers } = require('ethers');

// Contract configuration (from frontend config)
const FRONTEND_CONTRACT_ADDRESS = "0xC6aB674d9d251d6bB5f55287109aa44D3cfd74B2";
const WORKING_CONTRACT_ADDRESS = "0x5651E7F2E503dEB45E2D527bB383E2CDc68A1C78";
const RPC_URL = "https://eth-sepolia.public.blastapi.io";

// Contract ABI for getCommitment function
const CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
        "name": "getCommitment",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "string", "name": "title", "type": "string"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "address", "name": "officialAddress", "type": "address"},
                    {"internalType": "string", "name": "officialName", "type": "string"},
                    {"internalType": "string", "name": "officialRole", "type": "string"},
                    {"internalType": "uint256", "name": "targetValue", "type": "uint256"},
                    {"internalType": "uint256", "name": "deadline", "type": "uint256"},
                    {"internalType": "string", "name": "metricType", "type": "string"},
                    {"internalType": "bool", "name": "isActive", "type": "bool"},
                    {"internalType": "bool", "name": "isFulfilled", "type": "bool"},
                    {"internalType": "bool", "name": "rewardClaimed", "type": "bool"},
                    {"internalType": "uint256", "name": "stakeAmount", "type": "uint256"},
                    {"internalType": "uint256", "name": "tokenReward", "type": "uint256"},
                    {"internalType": "bytes32", "name": "oracleJobId", "type": "bytes32"}
                ],
                "internalType": "struct CivicXChainGovernance.EnvironmentalCommitment",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextCommitmentId",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

async function testCommitmentDataSync() {
    console.log("🔍 Testing Commitment Data Synchronization...\n");

    // Test both contract addresses
    const contractsToTest = [
        { name: "Frontend Config Contract", address: FRONTEND_CONTRACT_ADDRESS },
        { name: "Working Contract", address: WORKING_CONTRACT_ADDRESS }
    ];

    for (const contractInfo of contractsToTest) {
        console.log(`\n🔍 Testing ${contractInfo.name}: ${contractInfo.address}`);
        console.log("=" .repeat(80));

        try {
            // Connect to Sepolia
            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const contract = new ethers.Contract(contractInfo.address, CONTRACT_ABI, provider);
        
        // Get next commitment ID
        const nextId = await contract.nextCommitmentId();
        console.log(`📊 Next Commitment ID: ${nextId}`);
        
        if (nextId > 1) {
            console.log("\n📋 Current Commitments:");
            console.log("=" .repeat(80));
            
            // Check each commitment
            for (let i = 1; i < nextId; i++) {
                try {
                    const commitment = await contract.getCommitment(i);
                    
                    console.log(`\n--- Commitment #${i} ---`);
                    console.log(`Title: ${commitment.title}`);
                    console.log(`Description: ${commitment.description}`);
                    console.log(`Official: ${commitment.officialName} (${commitment.officialRole})`);
                    console.log(`Address: ${commitment.officialAddress}`);
                    console.log(`Target: ${commitment.targetValue} ${commitment.metricType}`);
                    console.log(`Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleDateString()}`);
                    console.log(`Active: ${commitment.isActive}`);
                    console.log(`Fulfilled: ${commitment.isFulfilled}`);
                    console.log(`Reward Claimed: ${commitment.rewardClaimed}`);
                    
                    // This is the data that should appear in Judging Panel and Achievement Timeline
                    console.log(`\n🎯 Frontend Data Mapping:`);
                    console.log(`  - Description for UI: "${commitment.description}"`);
                    console.log(`  - Official Address: ${commitment.officialAddress}`);
                    console.log(`  - Target Value: ${commitment.targetValue} (scaled: ${Number(commitment.targetValue) / 100})`);
                    console.log(`  - Is Completed: ${commitment.isFulfilled}`);
                    console.log(`  - Reward Claimed: ${commitment.rewardClaimed}`);
                    
                } catch (error) {
                    console.log(`❌ Error fetching commitment #${i}:`, error.message);
                }
            }
            
            console.log("\n" + "=" .repeat(80));
            console.log("✅ Data sync test completed!");
            console.log("\n💡 Expected behavior:");
            console.log("   - Judging Panel should show the descriptions above");
            console.log("   - Achievement Timeline should show the same commitment data");
            console.log("   - No more 'easy target!!!!!!' or 'Test from script' entries");
            
            } else {
                console.log("⚠️  No commitments found in this contract.");
            }

        } catch (error) {
            console.error(`❌ Test failed for ${contractInfo.name}:`, error.message);

            if (error.message.includes("could not detect network")) {
                console.log("\n💡 Network connection issue. Check your internet connection.");
            }
        }
    }

    console.log("\n" + "=" .repeat(80));
    console.log("✅ Contract comparison completed!");
}

// Run the test
testCommitmentDataSync().catch(console.error);
