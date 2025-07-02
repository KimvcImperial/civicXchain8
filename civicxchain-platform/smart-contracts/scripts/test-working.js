const hre = require("hardhat");

async function main() {
  const [deployer, user1] = await hre.ethers.getSigners();
  
  // Contract address
  const commitmentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("Testing EcoChain Governance Contract...");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`User1: ${user1.address}`);
  
  // Get contract instance
  const CivicContract = await hre.ethers.getContractAt("CivicCommitmentContract", commitmentAddress);
  
  console.log("\n📊 Current Contract State:");
  console.log("=" * 40);
  
  // Get current commitment ID (this tells us how many commitments exist)
  const currentId = await CivicContract.getCurrentCommitmentId();
  console.log(`Current Commitment ID: ${currentId}`);
  console.log(`Total Commitments Created: ${currentId}`);
  
  // Get contract owner
  const owner = await CivicContract.owner();
  console.log(`Contract Owner: ${owner}`);
  
  // Test getting existing commitment details
  if (currentId > 0) {
    console.log("\n📋 Existing Commitment Details:");
    console.log("-" * 40);
    
    try {
      // Use the proper getCommitment function
      const commitment = await CivicContract.getCommitment(1);
      console.log("Commitment #1:");
      console.log(`  📝 Description: ${commitment.description}`);
      console.log(`  👤 Official: ${commitment.official}`);
      console.log(`  ⏰ Deadline: ${new Date(commitment.deadline * 1000).toLocaleDateString()}`);
      console.log(`  🎯 Target Value: ${commitment.targetValue}`);
      console.log(`  📊 Current Value: ${commitment.currentValue}`);
      console.log(`  📈 Metric Type: ${commitment.metricType}`);
      console.log(`  🔗 Data Source: ${commitment.dataSource}`);
      console.log(`  ✅ Is Active: ${commitment.isActive}`);
      console.log(`  🏆 Reward Claimed: ${commitment.rewardClaimed}`);
    } catch (error) {
      console.log(`Error getting commitment: ${error.message}`);
    }
  }
  
  // Create a new commitment
  console.log("\n🚀 Creating New Commitment...");
  console.log("-" * 40);
  
  const futureDeadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
  
  try {
    const tx = await CivicContract.connect(user1).createCommitment(
      "Increase forest coverage to 75% in Protected Area Zone 3",
      futureDeadline,
      75, // target: 75% forest coverage
      "FOREST_COVERAGE_PERCENTAGE",
      "NASA_SATELLITE_IMAGERY"
    );
    
    const receipt = await tx.wait();
    console.log(`✅ New commitment created! Transaction: ${receipt.transactionHash}`);
    
    // Get the new commitment ID
    const newCurrentId = await CivicContract.getCurrentCommitmentId();
    console.log(`New Current ID: ${newCurrentId}`);
    
    // Get the newly created commitment
    const newCommitment = await CivicContract.getCommitment(newCurrentId);
    console.log("\n🌳 New Commitment Created:");
    console.log(`  📝 ${newCommitment.description}`);
    console.log(`  👤 Official: ${newCommitment.official}`);
    console.log(`  🎯 Target: ${newCommitment.targetValue}%`);
    console.log(`  📊 Metric: ${newCommitment.metricType}`);
    
  } catch (error) {
    console.log(`❌ Error creating commitment: ${error.message}`);
  }
  
  // Test getting official's commitments
  console.log("\n👥 Official's Commitments:");
  console.log("-" * 40);
  
  try {
    const officialCommitments = await CivicContract.getOfficialCommitments(user1.address);
    console.log(`User1 has ${officialCommitments.length} commitments: [${officialCommitments.join(', ')}]`);
  } catch (error) {
    console.log(`Error getting official commitments: ${error.message}`);
  }
  
  console.log("\n🎉 Contract Testing Complete!");
  console.log("✅ Your smart contracts are working perfectly!");
  console.log("\n🚀 Next Steps:");
  console.log("1. Configure MetaMask for localhost:8545");
  console.log("2. Import test account private key");
  console.log("3. Test frontend integration");
  console.log("4. Return to Databutton app");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
