const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying CivicCommitmentContract...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy CivicCommitmentContract
  const CivicCommitmentContract = await hre.ethers.getContractFactory("CivicCommitmentContract");
  const civicContract = await CivicCommitmentContract.deploy();
  await civicContract.waitForDeployment();

  console.log("\n🎉 Deployment Complete!");
  console.log("=====================================");
  console.log("🏛️ CivicCommitmentContract:", civicContract.target);
  console.log("=====================================");
  
  // Save the address to a file for frontend
  const addresses = {
    civicCommitment: civicContract.target,
    deployer: deployer.address,
    network: "localhost",
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync('deployed-commitment-addresses.json', JSON.stringify(addresses, null, 2));
  console.log("📝 Contract address saved to deployed-commitment-addresses.json");
  
  // Test the deployed contract
  console.log("\n🧪 Testing deployed contract...");
  try {
    const currentId = await civicContract.getCurrentCommitmentId();
    console.log("✅ getCurrentCommitmentId():", currentId.toString());
    console.log("✅ Contract is ready for use!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
