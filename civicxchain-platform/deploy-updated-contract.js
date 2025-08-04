const { ethers } = require('ethers');
const fs = require('fs');

async function deployUpdatedContract() {
    try {
        console.log('🚀 Deploying Updated CivicXChain Contract (No Deadline for Claims)...\n');
        
        // Connect to Sepolia
        const provider = new ethers.JsonRpcProvider('https://eth-sepolia.public.blastapi.io');
        
        // Use your private key from environment variable
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            console.log('❌ Please set PRIVATE_KEY environment variable');
            console.log('💡 Run: export PRIVATE_KEY="your_private_key_here"');
            return;
        }
        const wallet = new ethers.Wallet(privateKey, provider);
        
        console.log(`📍 Deploying from: ${wallet.address}`);
        console.log(`💰 Balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} ETH\n`);
        
        // Read the compiled contract
        const contractPath = './contracts/artifacts/contracts/CivicXChainGovernance.sol/CivicXChainGovernance.json';
        if (!fs.existsSync(contractPath)) {
            console.log('❌ Contract not compiled. Run: cd contracts && npx hardhat compile');
            return;
        }
        
        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        
        // Oracle addresses (using existing ones)
        const PM25_FEED = '0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD';
        const AQI_FEED = '0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD';
        const FOREST_COVER_FEED = '0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD';
        
        // Create contract factory
        const contractFactory = new ethers.ContractFactory(
            contractJson.abi,
            contractJson.bytecode,
            wallet
        );
        
        console.log('📋 Deploying with parameters:');
        console.log(`   PM2.5 Feed: ${PM25_FEED}`);
        console.log(`   AQI Feed: ${AQI_FEED}`);
        console.log(`   Forest Cover Feed: ${FOREST_COVER_FEED}\n`);
        
        // Deploy the contract
        const contract = await contractFactory.deploy(
            PM25_FEED,
            AQI_FEED,
            FOREST_COVER_FEED
        );
        
        console.log('⏳ Waiting for deployment...');
        await contract.waitForDeployment();
        
        const contractAddress = await contract.getAddress();
        console.log(`✅ Contract deployed at: ${contractAddress}\n`);
        
        // Update the config file
        const configPath = './frontend/config/contracts.js';
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Replace the old contract address
        configContent = configContent.replace(
            /GOVERNANCE_CONTRACT: '[^']*'/,
            `GOVERNANCE_CONTRACT: '${contractAddress}'`
        );
        configContent = configContent.replace(
            /COMMITMENT_CONTRACT: '[^']*'/,
            `COMMITMENT_CONTRACT: '${contractAddress}'`
        );
        configContent = configContent.replace(
            /CIVIC_TOKEN: '[^']*'/,
            `CIVIC_TOKEN: '${contractAddress}'`
        );
        configContent = configContent.replace(
            /CIVIC_CONTRACT: '[^']*'/,
            `CIVIC_CONTRACT: '${contractAddress}'`
        );
        
        fs.writeFileSync(configPath, configContent);
        console.log('✅ Updated frontend/config/contracts.js\n');
        
        console.log('🎉 Deployment Complete!');
        console.log('📝 Key Changes:');
        console.log('   - Removed deadline requirement for claiming rewards');
        console.log('   - Judge verification + target achievement = immediate claim');
        console.log('   - Deadline still applies for commitment creation and penalties');
        console.log('\n🔄 Please restart your frontend to use the new contract!');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
    }
}

// Run deployment
deployUpdatedContract().catch(console.error);
