const { ethers } = require('hardhat');

async function createTestCommitment() {
  console.log('🎯 Creating Test Environmental Commitment...');
  
  const [deployer] = await ethers.getSigners();
  console.log('Using account:', deployer.address);
  
  // Connect to governance contract
  const CivicXChainGovernance = await ethers.getContractFactory('CivicXChainGovernance');
  const governance = CivicXChainGovernance.attach('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9');
  
  // Create commitment parameters
  const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
  const stakeAmount = ethers.utils.parseEther('0.1'); // 0.1 ETH stake
  
  console.log('\n📋 Commitment Details:');
  console.log('  Title: Reduce City PM2.5 Levels');
  console.log('  Description: Commit to reducing air pollution in downtown area');
  console.log('  Official Name: Mayor Sarah Johnson');
  console.log('  Official Role: City Mayor');
  console.log('  Target Value: 900 (9.00 μg/m³)');
  console.log('  Deadline:', new Date(deadline * 1000).toLocaleString());
  console.log('  Metric Type: PM2.5');
  console.log('  Stake Amount: 0.1 ETH');
  
  // Create the commitment
  const createTx = await governance.createCommitment(
    'Reduce City PM2.5 Levels',
    'Commit to reducing air pollution in downtown area by implementing stricter vehicle emissions standards and promoting public transportation.',
    'Mayor Sarah Johnson',
    'City Mayor',
    900, // Target: 9.00 μg/m³ (achievable based on current ~10.39 μg/m³)
    deadline,
    'PM2.5',
    { value: stakeAmount }
  );
  
  console.log('\n⏳ Waiting for transaction to be mined...');
  const receipt = await createTx.wait();
  
  console.log('✅ Commitment created successfully!');
  console.log('  Transaction hash:', receipt.transactionHash);
  console.log('  Block number:', receipt.blockNumber);
  console.log('  Gas used:', receipt.gasUsed.toString());
  
  // Get the commitment ID from events
  const commitmentEvent = receipt.events?.find(e => e.event === 'CommitmentCreated');
  if (commitmentEvent) {
    const commitmentId = commitmentEvent.args.commitmentId;
    console.log('  Commitment ID:', commitmentId.toString());
    
    // Read back the commitment details
    console.log('\n📖 Reading Commitment Details...');
    const commitment = await governance.getCommitment(commitmentId);
    
    console.log('  ID:', commitment.id.toString());
    console.log('  Title:', commitment.title);
    console.log('  Official:', commitment.official);
    console.log('  Official Address:', commitment.officialAddress);
    console.log('  Target Value:', commitment.targetValue.toString(), '(', Number(commitment.targetValue) / 100, 'μg/m³)');
    console.log('  Deadline:', new Date(Number(commitment.deadline) * 1000).toLocaleString());
    console.log('  Metric Type:', commitment.metricType);
    console.log('  Is Active:', commitment.isActive);
    console.log('  Is Fulfilled:', commitment.isFulfilled);
    console.log('  Stake Amount:', ethers.utils.formatEther(commitment.stakeAmount), 'ETH');
  }
  
  // Check current oracle value
  console.log('\n📊 Current Oracle Values:');
  const oracleAbi = [
    {
      'inputs': [],
      'name': 'latestRoundData',
      'outputs': [
        {'internalType': 'uint80', 'name': 'roundId', 'type': 'uint80'},
        {'internalType': 'int256', 'name': 'answer', 'type': 'int256'},
        {'internalType': 'uint256', 'name': 'startedAt', 'type': 'uint256'},
        {'internalType': 'uint256', 'name': 'updatedAt', 'type': 'uint256'},
        {'internalType': 'uint80', 'name': 'answeredInRound', 'type': 'uint80'}
      ],
      'stateMutability': 'view',
      'type': 'function'
    }
  ];
  
  const pm25Oracle = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', oracleAbi, ethers.provider);
  const pm25Data = await pm25Oracle.latestRoundData();
  const currentPM25 = Number(pm25Data.answer) / 100;
  
  console.log('  Current PM2.5:', currentPM25, 'μg/m³');
  console.log('  Target PM2.5: 9.00 μg/m³');
  console.log('  Status:', currentPM25 <= 9.00 ? '✅ TARGET ACHIEVED!' : '⏳ Working towards target');
  
  console.log('\n🎉 Test commitment created successfully!');
  console.log('\n📱 Frontend should now show:');
  console.log('  - Live oracle data instead of "No Data"');
  console.log('  - Active commitment in the commitments section');
  console.log('  - Real-time progress tracking');
}

if (require.main === module) {
  createTestCommitment().catch(console.error);
}

module.exports = createTestCommitment;
