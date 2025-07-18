const { ethers } = require("hardhat");

async function testOracleDirectly() {
  console.log("🧪 Testing oracle contracts directly...");
  
  // Get the deployed addresses
  const addresses = {
    pm25: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    co2: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    forest: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  };

  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  // Test each oracle
  for (const [type, address] of Object.entries(addresses)) {
    console.log(`\n🔍 Testing ${type.toUpperCase()} Oracle at ${address}...`);
    
    try {
      // Check if contract exists
      const provider = ethers.provider;
      const code = await provider.getCode(address);
      console.log(`Contract code length: ${code.length}`);
      
      if (code === '0x') {
        console.log(`❌ No contract deployed at ${address}`);
        continue;
      }

      // Try to interact with the contract
      const EnvironmentalOracle = await ethers.getContractFactory("EnvironmentalDataOracle");
      const oracle = EnvironmentalOracle.attach(address);
      
      // Test basic functions
      try {
        const owner = await oracle.owner();
        console.log(`✅ Owner: ${owner}`);
      } catch (e) {
        console.log(`❌ Owner call failed: ${e.message}`);
      }

      try {
        const decimals = await oracle.decimals();
        console.log(`✅ Decimals: ${decimals}`);
      } catch (e) {
        console.log(`❌ Decimals call failed: ${e.message}`);
      }

      // Test data retrieval functions
      try {
        if (type === 'pm25') {
          const data = await oracle.getLatestPM25Data();
          console.log(`✅ PM2.5 Data: ${data.toString()} (${(Number(data)/100).toFixed(2)} μg/m³)`);
        } else if (type === 'co2') {
          const data = await oracle.getLatestCO2Data();
          console.log(`✅ CO2 Data: ${data.toString()} (${(Number(data)/100).toFixed(1)} ppm)`);
        } else if (type === 'forest') {
          const data = await oracle.getLatestForestCoverData();
          console.log(`✅ Forest Data: ${data.toString()} (${(Number(data)/100).toFixed(1)}%)`);
        }
      } catch (e) {
        console.log(`❌ Data retrieval failed: ${e.message}`);
      }

    } catch (error) {
      console.log(`❌ Error testing ${type} oracle:`, error.message);
    }
  }
}

testOracleDirectly().catch(console.error);
