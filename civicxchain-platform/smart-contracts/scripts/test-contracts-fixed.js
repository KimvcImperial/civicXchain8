const hre = require("hardhat");

async function main() {
  const [deployer, user1] = await hre.ethers.getSigners();
  
  // Contract addresses from your deployment
  const commitmentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const envAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  
  // Get contract instances
  const CivicContract = await hre.ethers.getContractAt("CivicCommitmentContract", commitmentAddress);
  const NFTContract = await hre.ethers.getContractAt("RewardNFTContract", nftAddress);
  const EnvContract = await hre.ethers.getContractAt("EnvironmentalDataContract", envAddress);
  
  console.log("Testing contracts...");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`User1: ${user1.address}`);
  
  // Test getting commitment count (try different possible function names)
  console.log("\n1. Checking commitment count...");
  try {
    const count = await CivicContract.getCommitmentCount();
    console.log(`Total commitments: ${count}`);
  } catch (e1) {
    try {
      const count = await CivicContract.commitmentCounter();
      console.log(`Total commitments: ${count}`);
    } catch (e2) {
      try {
        const count = await CivicContract.totalCommitments();
        console.log(`Total commitments: ${count}`);
      } catch (e3) {
        console.log("Could not get commitment count. Let's check what functions are available:");
        // List all available functions
        console.log("Available functions:");
        const interface = CivicContract.interface;
        Object.keys(interface.functions).forEach(func => {
          console.log(`- ${func}`);
        });
      }
    }
  }
  
  // Try to get the first commitment (ID 0 or 1)
  console.log("\n2. Getting commitment details...");
  try {
    // Try commitment ID 1 first (many contracts start from 1)
    const commitment = await CivicContract.getCommitment(1);
    console.log("Commitment 1 details:");
    console.log(`- Official: ${commitment.official || commitment[0]}`);
    console.log(`- Description: ${commitment.description || commitment[1]}`);
    console.log(`- Status: ${commitment.status || commitment[6]}`);
  } catch (e1) {
    try {
      // Try commitment ID 0
      const commitment = await CivicContract.getCommitment(0);
      console.log("Commitment 0 details:");
      console.log(`- Official: ${commitment.official || commitment[0]}`);
      console.log(`- Description: ${commitment.description || commitment[1]}`);
      console.log(`- Status: ${commitment.status || commitment[6]}`);
    } catch (e2) {
      try {
        // Try direct access to commitments mapping
        const commitment = await CivicContract.commitments(1);
        console.log("Commitment 1 details (mapping):");
        console.log(`- Official: ${commitment[0]}`);
        console.log(`- Description: ${commitment[1]}`);
        console.log(`- Status: ${commitment[6]}`);
      } catch (e3) {
        console.log("Could not access commitment details");
      }
    }
  }
  
  console.log("\n✅ Contract testing completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
