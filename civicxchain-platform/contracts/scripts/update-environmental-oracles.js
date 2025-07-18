const { ethers } = require("hardhat");

async function updateEnvironmentalOracles() {
  console.log("🔄 UPDATING ENVIRONMENTAL ORACLE VALUES...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Updating with account:", deployer.address);

  // New contract addresses from fresh deployment
  const addresses = {
    pm25: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    co2: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    forest: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  };

  // Get contract factory for environmental oracles
  const EnvironmentalOracle = await ethers.getContractFactory("EnvironmentalDataOracle");

  // Generate realistic environmental values
  const now = Date.now();
  const hour = new Date().getHours();
  
  // PM2.5: varies by time of day (higher during rush hours)
  const basePM25 = 15.5; // μg/m³
  const rushHourMultiplier = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) ? 1.4 : 1.0;
  const pm25Value = Math.floor((basePM25 * rushHourMultiplier + Math.random() * 5) * 100); // Scale by 100 for 2 decimals

  // CO2: current global average with small variation
  const baseCO2 = 421.5; // ppm
  const co2Value = Math.floor((baseCO2 + (Math.random() - 0.5) * 10) * 100); // Scale by 100 for 2 decimals

  // Forest Cover: changes slowly, add tiny variation
  const baseForest = 68.2; // %
  const forestValue = Math.floor((baseForest + (Math.random() - 0.5) * 2) * 100); // Scale by 100 for 2 decimals

  try {
    // Update PM2.5 Oracle
    const pm25Oracle = EnvironmentalOracle.attach(addresses.pm25);
    await pm25Oracle.updatePM25Data(pm25Value);
    console.log(`✅ PM2.5 updated to: ${pm25Value} (${(pm25Value/100).toFixed(2)} μg/m³)`);

    // Update CO2 Oracle
    const co2Oracle = EnvironmentalOracle.attach(addresses.co2);
    await co2Oracle.updateCO2Data(co2Value);
    console.log(`✅ CO2 updated to: ${co2Value} (${(co2Value/100).toFixed(1)} ppm)`);

    // Update Forest Oracle
    const forestOracle = EnvironmentalOracle.attach(addresses.forest);
    await forestOracle.updateForestCoverData(forestValue);
    console.log(`✅ Forest updated to: ${forestValue} (${(forestValue/100).toFixed(1)}%)`);

    console.log("🎉 All environmental oracle values updated successfully!");
    console.log("📊 Frontend will show these new values immediately");
    
    // Verify the updates
    console.log("\n🔍 Verifying updates...");
    const pm25Data = await pm25Oracle.getLatestPM25Data();
    const co2Data = await co2Oracle.getLatestCO2Data();
    const forestData = await forestOracle.getLatestForestCoverData();
    
    console.log(`PM2.5: ${pm25Data.toString()} (${(Number(pm25Data)/100).toFixed(2)} μg/m³)`);
    console.log(`CO2: ${co2Data.toString()} (${(Number(co2Data)/100).toFixed(1)} ppm)`);
    console.log(`Forest: ${forestData.toString()} (${(Number(forestData)/100).toFixed(1)}%)`);
    
  } catch (error) {
    console.error("❌ Error updating oracle values:", error.message);
  }
}

// Run the update
updateEnvironmentalOracles().catch(console.error);
