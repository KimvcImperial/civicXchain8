const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x3F471df6d611CDBcC1D09eb5aa971E3C79d5Fd00';
const PROVIDER_URL = 'https://eth-sepolia.public.blastapi.io';

async function testOracleIssue() {
  console.log('🔍 Testing Oracle Issue in Smart Contract');
  console.log('=' .repeat(50));
  
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    
    // Test getCurrentEnvironmentalValue function directly
    const abi = [
      'function getCurrentEnvironmentalValue(string) view returns (uint256)',
      'function checkFulfillment(uint256) view returns (bool, uint256, uint256)'
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    console.log('📞 Testing getCurrentEnvironmentalValue("pm25")...');
    try {
      const envValue = await contract.getCurrentEnvironmentalValue("pm25");
      console.log('✅ Environmental value:', envValue.toString());
    } catch (error) {
      console.error('❌ getCurrentEnvironmentalValue failed:', error.message);
      console.log('🔍 This is likely why claimEnvironmentalReward is failing!');
    }
    
    console.log('\n📞 Testing checkFulfillment(1)...');
    try {
      const [fulfilled, currentValue, targetValue] = await contract.checkFulfillment(1);
      console.log('✅ Fulfillment check:', {
        fulfilled,
        currentValue: currentValue.toString(),
        targetValue: targetValue.toString()
      });
    } catch (error) {
      console.error('❌ checkFulfillment failed:', error.message);
      console.log('🔍 This confirms why claimEnvironmentalReward shows "likely to fail"!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOracleIssue();
