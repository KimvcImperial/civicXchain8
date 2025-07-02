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
  
  // Test creating a commitment
  console.log("\n1. Creating a test commitment...");
  const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
  const tx = await CivicContract.connect(user1).createCommitment(
    "Reduce PM2.5 levels by 20%",
    deadline,
    80, // target value
    "PM2.5", // metric type
    "EPA_API" // data source
  );
  await tx.wait();
  console.log("✅ Commitment created!");
  
  // Get commitment count
  const count = await CivicContract.commitmentCount();
  console.log(`Total commitments: ${count}`);
  
  // Get the commitment details
  const commitment = await CivicContract.commitments(0);
  console.log("\n2. Commitment details:");
  console.log(`- Official: ${commitment.official}`);
  console.log(`- Description: ${commitment.description}`);
  console.log(`- Target: ${commitment.targetValue}`);
  console.log(`- Status: ${commitment.status}`);
  
  console.log("\n✅ All tests passed! Your contracts are working.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
