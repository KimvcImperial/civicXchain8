const hre = require("hardhat");

async function main() {
  console.log("Deploying EcoChain Governance contracts...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy CivicCommitmentContract
  const CivicCommitmentContract = await hre.ethers.getContractFactory("CivicCommitmentContract");
  const civicContract = await CivicCommitmentContract.deploy();
  await civicContract.waitForDeployment();
  console.log("CivicCommitmentContract deployed to:", await civicContract.getAddress());

  // Deploy RewardNFTContract
  const RewardNFTContract = await hre.ethers.getContractFactory("RewardNFTContract");
  const nftContract = await RewardNFTContract.deploy();
  await nftContract.waitForDeployment();
  console.log("RewardNFTContract deployed to:", await nftContract.getAddress());

  // Deploy EnvironmentalDataContract
  const EnvironmentalDataContract = await hre.ethers.getContractFactory("EnvironmentalDataContract");
  const envContract = await EnvironmentalDataContract.deploy();
  await envContract.waitForDeployment();
  console.log("EnvironmentalDataContract deployed to:", await envContract.getAddress());

  // Save contract addresses
  const addresses = {
    CivicCommitmentContract: await civicContract.getAddress(),
    RewardNFTContract: await nftContract.getAddress(),
    EnvironmentalDataContract: await envContract.getAddress(),
    deployer: deployer.address
  };

  console.log("\n=== Contract Addresses ===");
  console.log(JSON.stringify(addresses, null, 2));

  // Auto-generate frontend ABI to prevent mismatches
  console.log("\n🔄 Generating frontend ABI...");
  try {
    const { generateABI } = require('../../scripts/generate-abi.js');
    generateABI();
    console.log("✅ Frontend ABI generated successfully!");
  } catch (error) {
    console.log("⚠️ ABI generation failed:", error.message);
    console.log("💡 Run manually: node scripts/generate-abi.js");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
