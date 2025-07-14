// Deployment script for CivicXChain Environmental Governance Contract
// Run with: npx hardhat run deploy.js --network sepolia

const { ethers, network } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying CivicXChain Environmental Governance Contract...");
  console.log("📡 Network:", network.name);

  // Get Chainlink feed addresses based on network
  let CHAINLINK_FEEDS;

  if (network.name === "sepolia") {
    CHAINLINK_FEEDS = {
      PM25_FEED: process.env.PM25_FEED_SEPOLIA || "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      CO2_FEED: process.env.CO2_FEED_SEPOLIA || "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
      FOREST_COVER_FEED: process.env.FOREST_COVER_FEED_SEPOLIA || "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c"
    };
  } else if (network.name === "mainnet") {
    CHAINLINK_FEEDS = {
      PM25_FEED: process.env.PM25_FEED_MAINNET || "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
      CO2_FEED: process.env.CO2_FEED_MAINNET || "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
      FOREST_COVER_FEED: process.env.FOREST_COVER_FEED_MAINNET || "0xe62B71cf983019BFf55bC83B48601ce8419650CC"
    };
  } else {
    // Local/hardhat network - use dummy addresses
    CHAINLINK_FEEDS = {
      PM25_FEED: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      CO2_FEED: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
      FOREST_COVER_FEED: "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c"
    };
  }

  // Get the contract factory
  const CivicXChainGovernance = await ethers.getContractFactory("CivicXChainGovernance");

  // Deploy the contract
  const contract = await CivicXChainGovernance.deploy(
    CHAINLINK_FEEDS.PM25_FEED,
    CHAINLINK_FEEDS.CO2_FEED,
    CHAINLINK_FEEDS.FOREST_COVER_FEED
  );

  await contract.deployed();

  console.log("✅ CivicXChain Contract deployed to:", contract.address);
  console.log("📊 PM2.5 Oracle Feed:", CHAINLINK_FEEDS.PM25_FEED);
  console.log("🌍 CO2 Oracle Feed:", CHAINLINK_FEEDS.CO2_FEED);
  console.log("🌳 Forest Cover Oracle Feed:", CHAINLINK_FEEDS.FOREST_COVER_FEED);

  // Verify the contract on Etherscan (optional)
  if (network.name !== "hardhat") {
    console.log("⏳ Waiting for block confirmations...");
    await contract.deployTransaction.wait(6);
    
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [
          CHAINLINK_FEEDS.PM25_FEED,
          CHAINLINK_FEEDS.CO2_FEED,
          CHAINLINK_FEEDS.FOREST_COVER_FEED
        ],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  // Example: Create a test commitment
  console.log("\n🧪 Creating test environmental commitment...");
  
  const [deployer] = await ethers.getSigners();
  const stakeAmount = ethers.utils.parseEther("0.1"); // 0.1 ETH stake
  
  const tx = await contract.createCommitment(
    "Reduce PM2.5 levels below 15 μg/m³",
    "Commitment to reduce air pollution in the city through enhanced public transport and industrial regulations",
    "Mayor John Smith",
    "Mayor",
    15, // Target: PM2.5 < 15 μg/m³
    Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year deadline
    "pm25",
    { value: stakeAmount }
  );
  
  await tx.wait();
  console.log("✅ Test commitment created!");
  
  console.log("\n📋 Contract Summary:");
  console.log("Contract Address:", contract.address);
  console.log("Network:", network.name);
  console.log("Deployer:", deployer.address);
  console.log("Gas Used:", tx.gasUsed?.toString());
  
  console.log("\n🔗 Next Steps:");
  console.log("1. Update frontend with contract address:", contract.address);
  console.log("2. Fund contract with LINK tokens for Chainlink oracles");
  console.log("3. Set up environmental data feeds");
  console.log("4. Test commitment creation and fulfillment");
  
  return contract.address;
}

main()
  .then((address) => {
    console.log(`\n🎉 Deployment completed! Contract address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
