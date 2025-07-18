const { ethers } = require("hardhat");

async function startLiveOracleUpdates() {
  console.log("🌍 STARTING LIVE ORACLE UPDATES FOR CIVICXCHAIN...");
  console.log("📊 This will simulate real environmental data changes every 30 seconds");
  console.log("⏹️  Press Ctrl+C to stop\n");
  
  const [deployer] = await ethers.getSigners();
  const MockAggregator = await ethers.getContractFactory("MockAggregator");
  
  // Contract addresses
  const addresses = {
    pm25: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    co2: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    forest: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
  };

  // Base values (scaled by 100)
  const baseValues = {
    pm25: 988,   // 9.88 μg/m³
    co2: 48511,  // 485.11 ppm
    forest: 6746 // 67.46%
  };

  // Get oracle contracts
  const oracles = {
    pm25: MockAggregator.attach(addresses.pm25),
    co2: MockAggregator.attach(addresses.co2),
    forest: MockAggregator.attach(addresses.forest)
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
      console.error(`  ❌ Error in update #${updateCount}:`, error.message);
    }
  }

  // Initial update
  await updateValues();

  // Set up interval for continuous updates
  const interval = setInterval(updateValues, 30000); // Every 30 seconds

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping live oracle updates...');
    clearInterval(interval);
    console.log('✅ Oracle updates stopped. Final values will remain until next update.');
    process.exit(0);
  });

  console.log('\n📡 Live oracle updates running... Frontend will show dynamic data!');
  console.log('🔄 Updates every 30 seconds');
  console.log('⏹️  Press Ctrl+C to stop');
}

// Start the live updates
startLiveOracleUpdates().catch(console.error);
