const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // Contract address
  const commitmentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("Discovering contract functions...");
  
  try {
    // Get contract instance
    const CivicContract = await hre.ethers.getContractAt("CivicCommitmentContract", commitmentAddress);
    
    console.log("\n📋 Contract Interface:");
    console.log("=".repeat(50));
    
    // Get the contract's ABI
    const contractFactory = await hre.ethers.getContractFactory("CivicCommitmentContract");
    const abi = contractFactory.interface;
    
    console.log("\n🔧 Available Functions:");
    abi.fragments.forEach((fragment) => {
      if (fragment.type === 'function') {
        const inputs = fragment.inputs.map(input => `${input.type} ${input.name}`).join(', ');
        const outputs = fragment.outputs.map(output => output.type).join(', ');
        console.log(`  📌 ${fragment.name}(${inputs}) -> ${outputs}`);
      }
    });
    
    console.log("\n🎯 Testing common functions:");
    
    // Try some basic calls
    try {
      console.log("\n1. Testing nextCommitmentId...");
      const nextId = await CivicContract.nextCommitmentId();
      console.log(`   ✅ nextCommitmentId: ${nextId}`);
    } catch (e) {
      console.log(`   ❌ nextCommitmentId failed: ${e.message}`);
    }
    
    try {
      console.log("\n2. Testing commitments mapping...");
      const commitment = await CivicContract.commitments(1);
      console.log(`   ✅ Commitment 1 exists:`);
      console.log(`      Official: ${commitment[0]}`);
      console.log(`      Description: ${commitment[1]}`);
      console.log(`      Deadline: ${commitment[2]}`);
      console.log(`      Target Value: ${commitment[3]}`);
      console.log(`      Status: ${commitment[6]}`);
    } catch (e) {
      console.log(`   ❌ commitments(1) failed: ${e.message}`);
    }
    
    try {
      console.log("\n3. Testing owner...");
      const owner = await CivicContract.owner();
      console.log(`   ✅ Contract owner: ${owner}`);
    } catch (e) {
      console.log(`   ❌ owner failed: ${e.message}`);
    }
    
  } catch (error) {
    console.error("Error discovering contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
