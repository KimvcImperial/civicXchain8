#!/usr/bin/env node

// Debug script to check the ABI structure
const { CIVIC_GOVERNANCE_ABI } = require('./frontend/config/governance-abi.js');

console.log("🔍 Checking Governance ABI structure...\n");

// Find the getCommitment function
const getCommitmentFunction = CIVIC_GOVERNANCE_ABI.find(item => 
  item.type === 'function' && item.name === 'getCommitment'
);

if (getCommitmentFunction) {
  console.log("✅ Found getCommitment function:");
  console.log(JSON.stringify(getCommitmentFunction, null, 2));
  
  if (getCommitmentFunction.outputs && getCommitmentFunction.outputs[0] && getCommitmentFunction.outputs[0].components) {
    console.log("\n📋 Commitment struct fields:");
    getCommitmentFunction.outputs[0].components.forEach((field, index) => {
      console.log(`  [${index}] ${field.name}: ${field.type}`);
    });
  }
} else {
  console.log("❌ getCommitment function not found in ABI");
}

// Find nextCommitmentId function
const nextCommitmentIdFunction = CIVIC_GOVERNANCE_ABI.find(item => 
  item.type === 'function' && item.name === 'nextCommitmentId'
);

if (nextCommitmentIdFunction) {
  console.log("\n✅ Found nextCommitmentId function");
} else {
  console.log("\n❌ nextCommitmentId function not found in ABI");
}

console.log(`\n📊 Total ABI entries: ${CIVIC_GOVERNANCE_ABI.length}`);
