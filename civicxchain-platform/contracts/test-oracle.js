// Simple test to deploy and test oracle contract
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  // Deploy a simple MockAggregator
  const MockAggregator = await ethers.getContractFactory("MockAggregator");
  
  console.log("Deploying MockAggregator...");
  const oracle = await MockAggregator.deploy(1500, 8); // 15.00 with 8 decimals
  await oracle.deployed();
  
  console.log("Oracle deployed at:", oracle.address);
  
  // Test basic functions
  try {
    console.log("\n🧪 Testing basic functions...");
    
    const decimals = await oracle.decimals();
    console.log("✅ Decimals:", decimals.toString());
    
    const description = await oracle.description();
    console.log("✅ Description:", description);
    
    const version = await oracle.version();
    console.log("✅ Version:", version.toString());
    
    const latestAnswer = await oracle.getLatestAnswer();
    console.log("✅ Latest Answer:", latestAnswer.toString());
    
    console.log("\n🧪 Testing latestRoundData...");
    const roundData = await oracle.latestRoundData();
    console.log("✅ Round Data:");
    console.log("  Round ID:", roundData.roundId.toString());
    console.log("  Answer:", roundData.answer.toString());
    console.log("  Started At:", roundData.startedAt.toString());
    console.log("  Updated At:", roundData.updatedAt.toString());
    console.log("  Answered In Round:", roundData.answeredInRound.toString());
    
    const humanValue = Number(roundData.answer) / Math.pow(10, decimals);
    console.log("  Human Value:", humanValue);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
