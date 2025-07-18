// Debug deployment script
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Debug Deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  try {
    // Step 1: Try to deploy Environmental Oracle
    console.log("\n📡 Attempting to deploy Environmental Oracle...");
    const EnvironmentalDataOracle = await ethers.getContractFactory("EnvironmentalDataOracle");
    console.log("✅ Contract factory created");
    
    console.log("🚀 Deploying contract...");
    const oracle = await EnvironmentalDataOracle.deploy();
    console.log("✅ Deploy transaction sent");
    
    console.log("⏳ Waiting for deployment...");
    await oracle.deployed();
    console.log("✅ Contract deployed to:", oracle.address);

    // Test the contract
    console.log("🧪 Testing contract...");
    const owner = await oracle.owner();
    console.log("Contract owner:", owner);
    
    // Try to update data
    console.log("📊 Updating PM2.5 data...");
    const tx = await oracle.updatePM25Data(1385);
    await tx.wait();
    console.log("✅ PM2.5 data updated");
    
    // Try to read data
    console.log("📖 Reading PM2.5 data...");
    const pm25 = await oracle.getLatestPM25Data();
    console.log("PM2.5 value:", Number(pm25) / 100, "μg/m³");
    
    console.log("\n🎉 Debug deployment successful!");
    
  } catch (error) {
    console.error("❌ Error during deployment:");
    console.error(error);
    console.error("\nStack trace:");
    console.error(error.stack);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Fatal error:");
    console.error(error);
    process.exit(1);
  });
