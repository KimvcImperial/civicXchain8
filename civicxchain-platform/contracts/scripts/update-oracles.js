const { ethers } = require("hardhat");

async function updateOracleValues() {
  console.log("🔄 UPDATING ORACLE VALUES FOR DYNAMIC DATA...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Updating with account:", deployer.address);

  const MockAggregator = await ethers.getContractFactory("MockAggregator");
  
  // Contract addresses
  const addresses = {
    pm25: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    co2: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    forest: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
  };

  // Generate slightly varying values to simulate real environmental changes
  const baseValues = {
    pm25: 988,   // 9.88 μg/m³
    co2: 48511,  // 485.11 ppm
    forest: 6746 // 67.46%
  };

  // Add small random variations (±5% for realism)
  const variations = {
    pm25: Math.floor(baseValues.pm25 + (Math.random() - 0.5) * baseValues.pm25 * 0.1), // ±10% for PM2.5
    co2: Math.floor(baseValues.co2 + (Math.random() - 0.5) * baseValues.co2 * 0.05),   // ±5% for CO2
    forest: Math.floor(baseValues.forest + (Math.random() - 0.5) * baseValues.forest * 0.02) // ±2% for forest
  };

  try {
    // Update PM2.5 Oracle
    const pm25Oracle = MockAggregator.attach(addresses.pm25);
    await pm25Oracle.updateAnswer(variations.pm25);
    console.log(`✅ PM2.5 updated to: ${variations.pm25} (${(variations.pm25/100).toFixed(2)} μg/m³)`);

    // Update CO2 Oracle
    const co2Oracle = MockAggregator.attach(addresses.co2);
    await co2Oracle.updateAnswer(variations.co2);
    console.log(`✅ CO2 updated to: ${variations.co2} (${(variations.co2/100).toFixed(2)} ppm)`);

    // Update Forest Oracle
    const forestOracle = MockAggregator.attach(addresses.forest);
    await forestOracle.updateAnswer(variations.forest);
    console.log(`✅ Forest updated to: ${variations.forest} (${(variations.forest/100).toFixed(2)}%)`);

    console.log("🎉 All oracle values updated successfully!");
    console.log("📊 Frontend will show these new values on next refresh");
    
  } catch (error) {
    console.error("❌ Error updating oracle values:", error.message);
  }
}

// Run the update
updateOracleValues().catch(console.error);
