// Create a test commitment with short deadline for immediate verification
const { ethers } = require("hardhat");

const GOVERNANCE_ADDRESS = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";
const TOKEN_ADDRESS = "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9";
const ORACLE_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

async function main() {
  console.log("📝 Creating Test Commitment for Immediate Verification...");
  
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);
  
  // Get contracts
  const CivicXChainComplete = await ethers.getContractFactory("CivicXChainComplete");
  const governance = CivicXChainComplete.attach(GOVERNANCE_ADDRESS);
  
  const CivicToken = await ethers.getContractFactory("CivicToken");
  const token = CivicToken.attach(TOKEN_ADDRESS);
  
  const EnvironmentalDataOracle = await ethers.getContractFactory("EnvironmentalDataOracle");
  const oracle = EnvironmentalDataOracle.attach(ORACLE_ADDRESS);
  
  try {
    // Get current PM2.5 value from oracle
    const currentPM25 = await oracle.getLatestPM25Data();
    console.log("Current PM2.5:", (Number(currentPM25) / 100).toFixed(2), "μg/m³");
    
    // Set target to be easily achievable (current value + 1)
    const targetValue = Number(currentPM25) + 100; // Add 1.00 μg/m³ (easier target)
    console.log("Target PM2.5:", (targetValue / 100).toFixed(2), "μg/m³");
    
    // Create commitment with 1 minute deadline
    const deadline = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
    const stakeAmount = ethers.utils.parseEther("500"); // 500 CIVIC tokens
    
    console.log("\n🔧 Setting up commitment...");
    console.log("Deadline:", new Date(deadline * 1000).toLocaleString());
    console.log("Stake:", ethers.utils.formatEther(stakeAmount), "CIVIC tokens");
    
    // Approve tokens for staking
    console.log("Approving tokens...");
    await token.approve(governance.address, stakeAmount);
    
    // Create commitment
    console.log("Creating commitment...");
    const tx = await governance.createCommitment(
      "Quick PM2.5 Test Commitment",
      "Test commitment with 1-minute deadline for immediate verification testing",
      "Test Official",
      "Environmental Tester",
      targetValue,
      deadline,
      stakeAmount,
      "PM25"
    );
    
    const receipt = await tx.wait();
    console.log("✅ Test commitment created!");
    console.log("Transaction:", receipt.transactionHash);
    
    // Get the commitment ID
    const nextId = await governance.nextCommitmentId();
    const commitmentId = nextId - 1;
    console.log("Commitment ID:", commitmentId.toString());
    
    // Wait for deadline to pass
    console.log("\n⏳ Waiting for deadline to pass (60 seconds)...");
    await new Promise(resolve => setTimeout(resolve, 65000)); // Wait 65 seconds
    
    // Now verify the commitment
    console.log("\n🔍 Verifying commitment...");
    const verifyTx = await governance.verifyCommitment(commitmentId);
    const verifyReceipt = await verifyTx.wait();
    
    console.log("✅ Verification completed!");
    console.log("Transaction:", verifyReceipt.transactionHash);
    
    // Check the result
    const commitment = await governance.getCommitment(commitmentId);
    console.log("\n📊 Verification Results:");
    console.log("Is Verified:", commitment.isVerified);
    console.log("Is Fulfilled:", commitment.isFulfilled);
    console.log("Target Value:", (Number(commitment.targetValue) / 100).toFixed(2), "μg/m³");
    console.log("Actual Value:", (Number(commitment.actualValue) / 100).toFixed(2), "μg/m³");
    
    if (commitment.isFulfilled) {
      console.log("🎉 COMMITMENT FULFILLED! Official received token rewards!");
    } else {
      console.log("❌ COMMITMENT FAILED! Penalty applied to stake!");
    }
    
    // Check token balance
    const balance = await token.balanceOf(signer.address);
    console.log("Current CIVIC balance:", ethers.utils.formatEther(balance));
    
    // Check system stats
    const stats = await governance.getStats();
    console.log("\n📈 System Stats:");
    console.log("Total commitments:", stats.total.toString());
    console.log("Fulfilled commitments:", stats.fulfilled.toString());
    console.log("Failed commitments:", stats.failed.toString());
    console.log("Active commitments:", stats.active.toString());
    
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
