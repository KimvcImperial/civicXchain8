const hre = require("hardhat");

async function main() {
  console.log("🧹 Cleaning test data from CivicCommitmentContract...");
  
  // Get the contract address from the deployed addresses file
  const fs = require('fs');
  let contractAddress;
  
  try {
    const addresses = JSON.parse(fs.readFileSync('deployed-commitment-addresses.json', 'utf8'));
    contractAddress = addresses.civicCommitment;
  } catch (error) {
    console.error("❌ Could not read deployed addresses file");
    process.exit(1);
  }
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  
  // Connect to the deployed contract
  const CivicCommitmentContract = await hre.ethers.getContractFactory("CivicCommitmentContract");
  const civicContract = CivicCommitmentContract.attach(contractAddress);
  
  console.log("Connected to contract at:", contractAddress);
  
  try {
    // Check current commitment count
    const currentId = await civicContract.getCurrentCommitmentId();
    console.log("Current commitment count:", currentId.toString());
    
    if (currentId > 0) {
      console.log("⚠️  Found test commitments. Unfortunately, there's no delete function in the contract.");
      console.log("💡 The test commitment will remain but you can create new ones that will show up.");
      console.log("🔄 To completely remove it, you would need to redeploy the contract.");
      
      // Show the test commitment details
      for (let i = 1; i <= currentId; i++) {
        const commitment = await civicContract.getCommitment(i);
        console.log(`\n📋 Commitment #${i}:`);
        console.log("  - Description:", commitment.description);
        console.log("  - Official:", commitment.official);
        console.log("  - Target Value:", commitment.targetValue.toString());
        console.log("  - Is Completed:", commitment.isCompleted);
      }
    } else {
      console.log("✅ No test commitments found.");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
