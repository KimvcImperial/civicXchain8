#!/usr/bin/env node

// Direct test of commitment reading from the blockchain
const { ethers } = require('ethers');

// Contract configuration
const CONTRACT_ADDRESS = '0xf20473e6990d39343D43a6Db4379b4DA860B9d1f';
const RPC_URL = 'https://eth-sepolia.public.blastapi.io';

// Minimal ABI for testing
const ABI = [
  "function nextCommitmentId() view returns (uint256)",
  "function getCommitment(uint256) view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
  "function checkFulfillment(uint256) view returns (bool fulfilled, uint256 currentValue, uint256 targetValue)"
];

async function testCommitmentReading() {
  try {
    console.log('🔍 Testing commitment reading from blockchain...\n');
    
    // Create provider and contract
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    // Get total commitments
    console.log('📊 Getting total commitments...');
    const nextId = await contract.nextCommitmentId();
    console.log(`Next commitment ID: ${nextId}`);
    console.log(`Total commitments: ${nextId - 1n}\n`);
    
    // Test all commitments to find claimable ones
    for (let commitmentId = 1; commitmentId < nextId; commitmentId++) {
      console.log(`📋 Getting commitment #${commitmentId}...`);
    
    try {
      const commitment = await contract.getCommitment(commitmentId);
      console.log('✅ Commitment data:');
      console.log(`  ID: ${commitment.id}`);
      console.log(`  Title: ${commitment.title}`);
      console.log(`  Description: ${commitment.description}`);
      console.log(`  Official: ${commitment.officialName} (${commitment.officialRole})`);
      console.log(`  Target: ${commitment.targetValue} ${commitment.metricType}`);
      console.log(`  Deadline: ${new Date(Number(commitment.deadline) * 1000).toLocaleString()}`);
      console.log(`  Active: ${commitment.isActive}`);
      console.log(`  Fulfilled: ${commitment.isFulfilled}`);
      console.log(`  Reward Claimed: ${commitment.rewardClaimed}`);
      console.log(`  Stake Amount: ${ethers.formatEther(commitment.stakeAmount)} ETH`);
      console.log(`  Token Reward: ${ethers.formatEther(commitment.tokenReward)} tokens\n`);
      
      // Check fulfillment status
      console.log('🎯 Checking fulfillment status...');
      const fulfillment = await contract.checkFulfillment(commitmentId);
      console.log(`  Fulfilled: ${fulfillment.fulfilled}`);
      console.log(`  Current Value: ${fulfillment.currentValue}`);
      console.log(`  Target Value: ${fulfillment.targetValue}\n`);
      
      // Check claimability
      const now = Math.floor(Date.now() / 1000);
      const deadlinePassed = now >= Number(commitment.deadline);
      const isClaimable = commitment.isActive && !commitment.rewardClaimed && deadlinePassed && fulfillment.fulfilled;
      
      console.log('🏆 Claimability Check:');
      console.log(`  Active: ${commitment.isActive ? '✅' : '❌'}`);
      console.log(`  Not Claimed: ${!commitment.rewardClaimed ? '✅' : '❌'}`);
      console.log(`  Deadline Passed: ${deadlinePassed ? '✅' : '❌'}`);
      console.log(`  Target Met: ${fulfillment.fulfilled ? '✅' : '❌'}`);
      console.log(`  CLAIMABLE: ${isClaimable ? '🎉 YES!' : '❌ NO'}`);
      console.log('─'.repeat(50));

    } catch (error) {
      console.error(`❌ Error reading commitment #${commitmentId}:`, error.message);
    }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCommitmentReading();
