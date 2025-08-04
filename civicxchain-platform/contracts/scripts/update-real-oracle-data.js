const { ethers } = require("hardhat");

async function updateRealOracleData() {
  console.log("🌍 UPDATING REAL ORACLE DATA FOR CIVICXCHAIN...");
  console.log("📊 Using your deployed contract addresses");
  console.log("⏹️  Press Ctrl+C to stop\n");
  
  const [deployer] = await ethers.getSigners();
  
  // Your actual deployed contract addresses
  const addresses = {
    pm25: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    co2: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    forest: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
  };

  // Simple ABI for the oracle contracts (just the functions we need)
  const oracleABI = [
    {
      "inputs": [{"internalType": "int256", "name": "_answer", "type": "int256"}],
      "name": "updateAnswer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestRoundData",
      "outputs": [
        {"internalType": "uint80", "name": "roundId", "type": "uint80"},
        {"internalType": "int256", "name": "answer", "type": "int256"},
        {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
        {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
        {"internalType": "uint80", "name": "answeredInRound", "type": "uint80"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Connect to the oracle contracts
  const oracles = {
    pm25: new ethers.Contract(addresses.pm25, oracleABI, deployer),
    co2: new ethers.Contract(addresses.co2, oracleABI, deployer),
    forest: new ethers.Contract(addresses.forest, oracleABI, deployer)
  };

  // Base values (scaled by 100 for 2 decimal places)
  const baseValues = {
    pm25: 988,   // 9.88 μg/m³
    co2: 48511,  // 485.11 ppm
    forest: 6746 // 67.46%
  };

  let updateCount = 0;

  async function updateValues() {
    updateCount++;
    console.log(`\n🔄 Update #${updateCount} - ${new Date().toLocaleTimeString()}`);
    
    try {
      // Generate realistic variations
      const variations = {
        pm25: Math.floor(baseValues.pm25 + (Math.random() - 0.5) * baseValues.pm25 * 0.15), // ±15% for PM2.5
        co2: Math.floor(baseValues.co2 + (Math.random() - 0.5) * baseValues.co2 * 0.08),   // ±8% for CO2
        forest: Math.floor(baseValues.forest + (Math.random() - 0.5) * baseValues.forest * 0.03) // ±3% for forest
      };

      // Ensure values stay within reasonable bounds
      variations.pm25 = Math.max(500, Math.min(1500, variations.pm25)); // 5.00-15.00 μg/m³
      variations.co2 = Math.max(40000, Math.min(55000, variations.co2)); // 400-550 ppm
      variations.forest = Math.max(6000, Math.min(7500, variations.forest)); // 60-75%

      // Update all oracles
      await oracles.pm25.updateAnswer(variations.pm25);
      await oracles.co2.updateAnswer(variations.co2);
      await oracles.forest.updateAnswer(variations.forest);

      console.log(`  🌫️  PM2.5: ${(variations.pm25/100).toFixed(2)} μg/m³`);
      console.log(`  🏭 CO2: ${(variations.co2/100).toFixed(2)} ppm`);
      console.log(`  🌳 Forest: ${(variations.forest/100).toFixed(2)}%`);
      console.log(`  ✅ All values updated successfully`);

    } catch (error) {
      console.error(`  ❌ Error updating values:`, error.message);
    }
  }

  // Initial update
  await updateValues();

  // Set up interval for continuous updates
  const interval = setInterval(updateValues, 30000); // Update every 30 seconds

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping oracle updates...');
    clearInterval(interval);
    console.log('✅ Oracle updates stopped. Final update count:', updateCount);
    process.exit(0);
  });

  console.log('\n🔄 Oracle updates running every 30 seconds...');
  console.log('📊 Check your frontend at http://localhost:3002 to see live data');
  console.log('⏹️  Press Ctrl+C to stop');
}

// Handle errors
updateRealOracleData().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
