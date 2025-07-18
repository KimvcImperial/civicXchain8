// Test commitment verification manually
const { ethers } = require("hardhat");

const GOVERNANCE_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

async function main() {
  console.log("🧪 Testing Commitment Verification...");
  
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);
  
  // Get the governance contract
  const CivicXChainComplete = await ethers.getContractFactory("CivicXChainComplete");
  const governance = CivicXChainComplete.attach(GOVERNANCE_ADDRESS);
  
  try {
    // Check stats
    console.log("\n📊 Checking governance stats...");
    const stats = await governance.getStats();
    console.log("Total commitments:", stats.total.toString());
    console.log("Fulfilled commitments:", stats.fulfilled.toString());
    console.log("Failed commitments:", stats.failed.toString());
    console.log("Active commitments:", stats.active.toString());
    
    // Get next commitment ID
    const nextId = await governance.nextCommitmentId();
    console.log("Next commitment ID:", nextId.toString());
    
    // Check the test commitment (ID 1)
    if (nextId > 1) {
      console.log("\n📝 Checking commitment #1...");
      const commitment = await governance.getCommitment(1);
      
      console.log("Title:", commitment.title);
      console.log("Official:", commitment.officialName);
      console.log("Metric Type:", commitment.metricType);
      console.log("Target Value:", (Number(commitment.targetValue) / 100).toFixed(2));
      console.log("Deadline:", new Date(Number(commitment.deadline) * 1000).toLocaleString());
      console.log("Is Active:", commitment.isActive);
      console.log("Is Fulfilled:", commitment.isFulfilled);
      console.log("Is Verified:", commitment.isVerified);
      
      // Check if deadline has passed
      const now = Math.floor(Date.now() / 1000);
      const deadline = Number(commitment.deadline);
      
      console.log("\nCurrent time:", new Date().toLocaleString());
      console.log("Deadline passed:", now >= deadline);
      
      if (now >= deadline && commitment.isActive && !commitment.isVerified) {
        console.log("\n⏰ Commitment is ready for verification!");
        console.log("Attempting to verify commitment...");
        
        try {
          const tx = await governance.verifyCommitment(1);
          console.log("Transaction sent:", tx.hash);
          
          const receipt = await tx.wait();
          console.log("✅ Verification transaction confirmed!");
          console.log("Gas used:", receipt.gasUsed.toString());
          
          // Check updated commitment
          const updatedCommitment = await governance.getCommitment(1);
          console.log("\n📊 Updated commitment status:");
          console.log("Is Verified:", updatedCommitment.isVerified);
          console.log("Is Fulfilled:", updatedCommitment.isFulfilled);
          console.log("Actual Value:", (Number(updatedCommitment.actualValue) / 100).toFixed(2));
          
          if (updatedCommitment.isFulfilled) {
            console.log("🎉 COMMITMENT FULFILLED! Tokens rewarded!");
          } else {
            console.log("❌ COMMITMENT FAILED! Penalty applied!");
          }
          
        } catch (error) {
          console.error("❌ Verification failed:", error.message);
        }
      } else if (commitment.isVerified) {
        console.log("✅ Commitment already verified");
        console.log("Result:", commitment.isFulfilled ? "FULFILLED" : "FAILED");
        console.log("Actual Value:", (Number(commitment.actualValue) / 100).toFixed(2));
      } else {
        console.log("⏳ Commitment not yet ready for verification");
      }
    } else {
      console.log("📝 No commitments found");
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
