#!/usr/bin/env node

/**
 * Test script to verify expired commitment handling
 */

const { ethers } = require('hardhat');

async function testExpiredCommitments() {
  console.log('🧪 Testing Expired Commitment Logic...\n');

  // Test data - simulating commitments with different deadlines
  const testCommitments = [
    {
      id: 1,
      description: "Active Commitment",
      deadline: Math.floor(Date.now() / 1000) + 86400, // 1 day from now
      targetValue: 2300,
      actualValue: 1250
    },
    {
      id: 2,
      description: "Expired Commitment",
      deadline: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      targetValue: 2300,
      actualValue: 1250
    },
    {
      id: 3,
      description: "Recently Expired",
      deadline: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      targetValue: 2300,
      actualValue: 1250
    }
  ];

  const now = Math.floor(Date.now() / 1000);
  console.log(`Current timestamp: ${now} (${new Date(now * 1000).toLocaleString()})\n`);

  testCommitments.forEach(commitment => {
    const isExpired = commitment.deadline < now;
    const targetMet = commitment.actualValue <= commitment.targetValue;
    const eligibleForReward = targetMet && !isExpired;

    console.log(`📋 ${commitment.description}:`);
    console.log(`   Deadline: ${commitment.deadline} (${new Date(commitment.deadline * 1000).toLocaleString()})`);
    console.log(`   Is Expired: ${isExpired ? '❌ YES' : '✅ NO'}`);
    console.log(`   Target Met: ${targetMet ? '✅ YES' : '❌ NO'} (${commitment.actualValue} <= ${commitment.targetValue})`);
    console.log(`   Eligible for Reward: ${eligibleForReward ? '🏆 YES' : '❌ NO'}`);
    console.log('');
  });

  // Summary
  const activeCount = testCommitments.filter(c => c.deadline >= now).length;
  const expiredCount = testCommitments.filter(c => c.deadline < now).length;
  const eligibleCount = testCommitments.filter(c => c.actualValue <= c.targetValue && c.deadline >= now).length;

  console.log('📊 Summary:');
  console.log(`   Active Commitments: ${activeCount}`);
  console.log(`   Expired Commitments: ${expiredCount}`);
  console.log(`   Eligible for Rewards: ${eligibleCount}`);
}

// Run the test
testExpiredCommitments().catch(console.error);
