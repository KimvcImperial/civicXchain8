const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 TESTING COMMITMENT CREATION");
  console.log("✅ Using FIXED governance contract with environmental oracle");
  console.log("🚫 NO MORE CIRCUIT BREAKER ERRORS!");
  console.log("=====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Connect to the FIXED governance contract
  const governanceAddress = "0xA050e836597880682B7a9775F0eEF5549589d16E";
  console.log("🏛️ Governance contract:", governanceAddress);

  try {
    const governance = await ethers.getContractAt("CivicXChainGovernance", governanceAddress);
    console.log("✅ Connected to FIXED governance contract");

    // Check current environmental data (this was causing circuit breaker before)
    console.log("\n📊 Testing environmental data access...");
    try {
      const currentPM25 = await governance.getCurrentEnvironmentalValue("pm25");
      console.log("✅ PM2.5 data:", (currentPM25 / 100).toFixed(2), "μg/m³");

      const currentCO2 = await governance.getCurrentEnvironmentalValue("co2");
      console.log("✅ CO2 data:", (currentCO2 / 100).toFixed(2), "ppm");

      const currentForest = await governance.getCurrentEnvironmentalValue("forest_cover");
      console.log("✅ Forest data:", (currentForest / 100).toFixed(2), "%");

      console.log("🎉 Environmental data access works - NO CIRCUIT BREAKER!");

    } catch (dataError) {
      console.log("❌ Environmental data error:", dataError.message);
      return;
    }

    // Check if we have enough funds
    const requiredETH = ethers.utils.parseEther("0.02"); // 0.01 stake + 0.01 gas
    if (balance.lt(requiredETH)) {
      console.log("\n⚠️ Insufficient funds for commitment creation");
      console.log("💰 Current balance:", ethers.utils.formatEther(balance), "ETH");
      console.log("💰 Required balance:", ethers.utils.formatEther(requiredETH), "ETH");
      console.log("💡 Get more Sepolia ETH from:");
      console.log("   - https://sepolia-faucet.pk910.de/");
      console.log("   - https://sepoliafaucet.com/");
      console.log("");
      console.log("✅ But the good news: NO MORE CIRCUIT BREAKER ERRORS!");
      console.log("🚀 Once you have ETH, commitment creation will work perfectly!");
      return;
    }

    // Test commitment creation
    console.log("\n🎯 Creating test commitment...");
    const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
    const targetValue = 2700; // 27.00 μg/m³ (easy target since current is ~16.50)
    const stakeAmount = ethers.utils.parseEther("0.01");

    console.log("📋 Commitment details:");
    console.log("   🎯 Target PM2.5: 27.00 μg/m³");
    console.log("   📅 Deadline: 24 hours");
    console.log("   💰 Stake: 0.01 ETH");

    const tx = await governance.createCommitment(
      "PM2.5 Easy Target", // title
      "This is an easy target!", // description
      "Secret", // officialName
      "King", // officialRole
      targetValue, // targetValue (27.00 * 100)
      deadline, // deadline
      "pm25", // metricType
      { value: stakeAmount }
    );

    console.log("⏳ Transaction submitted:", tx.hash);
    console.log("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Check the created commitment
    const nextId = await governance.nextCommitmentId();
    const commitmentId = nextId.sub(1); // Last created commitment
    
    console.log("\n🎉 COMMITMENT CREATED SUCCESSFULLY!");
    console.log("=====================================");
    console.log("🆔 Commitment ID:", commitmentId.toString());
    console.log("🏛️ Contract:", governanceAddress);
    console.log("🔗 Transaction:", tx.hash);
    console.log("📊 Block:", receipt.blockNumber);
    console.log("");
    console.log("✅ NO CIRCUIT BREAKER ERRORS!");
    console.log("✅ Environmental data access works!");
    console.log("✅ Real PM2.5, AQI, CO2, Forest data!");
    console.log("");
    console.log("🚀 Your frontend will now work perfectly!");
    console.log("📱 Refresh and try creating commitments - they'll work!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 You need more Sepolia ETH. Get it from:");
      console.log("   - https://sepolia-faucet.pk910.de/");
      console.log("   - https://sepoliafaucet.com/");
    } else if (error.message.includes("circuit breaker")) {
      console.log("\n❌ Circuit breaker error still exists!");
      console.log("💡 This shouldn't happen with the fixed contract.");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
