const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Simple Oracle Deployment Test...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  try {
    // Deploy just one EnvironmentalDataOracle contract
    console.log("\n📊 Deploying EnvironmentalDataOracle...");
    const EnvironmentalDataOracle = await ethers.getContractFactory("EnvironmentalDataOracle");
    
    console.log("Contract factory created successfully");
    
    const oracle = await EnvironmentalDataOracle.deploy();
    console.log("Deploy transaction sent, waiting for confirmation...");
    
    await oracle.deployed();
    console.log("✅ EnvironmentalDataOracle deployed to:", oracle.address);

    // Test the deployment
    console.log("\n🧪 Testing deployment...");
    
    try {
      const owner = await oracle.owner();
      console.log("✅ Owner:", owner);
      
      const decimals = await oracle.decimals();
      console.log("✅ Decimals:", decimals.toString());
      
      const pm25Data = await oracle.getLatestPM25Data();
      console.log("✅ Initial PM2.5 data:", pm25Data.toString(), "(" + (Number(pm25Data)/100).toFixed(2) + " μg/m³)");
      
      const co2Data = await oracle.getLatestCO2Data();
      console.log("✅ Initial CO2 data:", co2Data.toString(), "(" + (Number(co2Data)/100).toFixed(1) + " ppm)");
      
      const forestData = await oracle.getLatestForestCoverData();
      console.log("✅ Initial Forest data:", forestData.toString(), "(" + (Number(forestData)/100).toFixed(1) + "%)");
      
      console.log("\n🎉 Oracle deployment and testing successful!");
      console.log("Oracle address:", oracle.address);
      
    } catch (testError) {
      console.error("❌ Testing failed:", testError.message);
    }
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
