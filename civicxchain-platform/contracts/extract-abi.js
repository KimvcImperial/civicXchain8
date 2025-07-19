// Extract ABI from compiled contracts
const fs = require('fs');

// Read the compiled contract
const contractJson = JSON.parse(fs.readFileSync('./artifacts/contracts/CivicXChainComplete.sol/CivicXChainComplete.json', 'utf8'));

// Extract just the ABI
const abi = contractJson.abi;

// Write to a clean file
fs.writeFileSync('./CivicXChainComplete-ABI.json', JSON.stringify(abi, null, 2));

console.log('✅ ABI extracted to CivicXChainComplete-ABI.json');
console.log('📋 Functions found:');
abi.filter(item => item.type === 'function').forEach(func => {
  console.log(`  - ${func.name}(${func.inputs.map(i => i.type).join(', ')})`);
});
