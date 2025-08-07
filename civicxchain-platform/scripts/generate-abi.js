#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Auto-generate frontend ABI from compiled contract artifacts
 * This prevents ABI mismatches and keeps everything in sync
 */

function generateABI() {
  console.log('🔄 Generating frontend ABI from contract artifacts...');
  
  try {
    // Read the compiled contract artifact
    const artifactPath = path.join(__dirname, '../smart-contracts/artifacts/contracts/CivicCommitmentContract.sol/CivicCommitmentContract.json');
    
    if (!fs.existsSync(artifactPath)) {
      console.error('❌ Contract artifact not found. Please compile contracts first:');
      console.error('   cd smart-contracts && npx hardhat compile');
      process.exit(1);
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const abi = artifact.abi;
    
    console.log('📋 Found ABI with', abi.length, 'functions/events');
    
    // Generate the frontend config file
    const configContent = `// Auto-generated ABI - DO NOT EDIT MANUALLY
// Generated from: ${artifactPath}
// Generated at: ${new Date().toISOString()}

export const CIVIC_COMMITMENT_ABI = ${JSON.stringify(abi, null, 2)} as const;

// Contract addresses (Sepolia deployment)
export const CONTRACT_ADDRESSES = {
  CIVIC_COMMITMENT: '0xE16F89910DF3Bd0f1C06b667F85D2b68582BA4c4', // Sepolia deployment
  CHAIN_ID: 11155111,
  RPC_URL: 'https://eth-sepolia.public.blastapi.io'
} as const;
`;
    
    // Write to frontend config
    const outputPath = path.join(__dirname, '../frontend/config/generated-abi.ts');
    fs.writeFileSync(outputPath, configContent);
    
    console.log('✅ ABI generated successfully!');
    console.log('📁 Output:', outputPath);
    console.log('💡 Import in components: import { CIVIC_COMMITMENT_ABI } from "../../config/generated-abi"');
    
  } catch (error) {
    console.error('❌ Error generating ABI:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateABI();
}

module.exports = { generateABI };
