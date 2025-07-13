"""from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()

class RewardRequest(BaseModel):
    official_id: str
    commitment_id: str
    achievement_type: str

class NFTBadgeResponse(BaseModel):
    nft_id: str
    official_id: str
    badge_type: str
    mint_transaction: str
    metadata_uri: str

class ReputationTokenResponse(BaseModel):
    official_id: str
    tokens_awarded: int
    current_reputation: int
    achievement_unlock: str

@router.post("/mint-nft-badge")
async def mint_achievement_nft(request: RewardRequest):
    """Mint NFT badges for successful commitments"""
    # Simulated NFT minting
    nft_id = f"ECG-NFT-{uuid.uuid4().hex[:8]}"
    
    return {
        "nft_id": nft_id,
        "official_id": request.official_id,
        "badge_type": request.achievement_type,
        "mint_transaction": f"0x{uuid.uuid4().hex}",
        "metadata_uri": f"ipfs://QmNFT{nft_id}",
        "opensea_url": f"https://testnets.opensea.io/assets/{nft_id}"
    }

@router.post("/award-reputation-tokens")
async def award_reputation_tokens(request: RewardRequest):
    """Award reputation tokens for verified achievements"""
    base_tokens = 100
    bonus_multiplier = {
        "forest_protection": 1.5,
        "air_quality_improvement": 1.3,
        "water_quality": 1.2,
        "carbon_reduction": 1.4
    }
    
    tokens = int(base_tokens * bonus_multiplier.get(request.achievement_type, 1.0))
    
    return {
        "official_id": request.official_id,
        "tokens_awarded": tokens,
        "achievement_type": request.achievement_type,
        "total_reputation": tokens * 10,  # Simulated total
        "rank_achievement": "Environmental Guardian" if tokens > 130 else "Eco Defender"
    }

@router.get("/rewards-dashboard/{official_id}")
async def get_rewards_dashboard(official_id: str):
    """Get complete rewards overview for an official"""
    return {
        "official_id": official_id,
        "nft_badges": [
            {"type": "Forest Guardian", "earned_date": "2024-01-15", "rarity": "Rare"},
            {"type": "Air Quality Champion", "earned_date": "2024-02-20", "rarity": "Epic"}
        ],
        "reputation_tokens": 2500,
        "current_rank": "Environmental Guardian",
        "next_rank": "Planetary Protector",
        "tokens_to_next_rank": 500,
        "achievements_unlocked": 12,
        "total_achievements": 25
    }
    """

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import Dict, List, Optional, Any
import asyncio
import json
import hashlib
import aiosqlite
from web3 import Web3
from eth_account import Account
import requests
from app.libs.civicxchain_database import get_commitment_by_id, update_commitment_status, claim_reward as db_claim_reward
from app.libs.civicxchain_satellite_db import get_satellite_data_for_commitment

router = APIRouter()

# Blockchain Configuration (Hardhat Local Network)
ETH_RPC_URL = "http://localhost:8545"  # Local Hardhat node
w3 = Web3(Web3.HTTPProvider(ETH_RPC_URL))

# Contract Addresses (from your existing web3Service.ts)
CONTRACT_ADDRESSES = {
    "COMMITMENT_CONTRACT": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "REWARD_NFT_CONTRACT": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "ENVIRONMENTAL_CONTRACT": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
}

# Smart Contract ABIs (simplified for key functions)
REWARD_NFT_ABI = [
    {
        "inputs": [
            {"name": "to", "type": "address"},
            {"name": "achievementType", "type": "string"},
            {"name": "metadataURI", "type": "string"}
        ],
        "name": "mintAchievementNFT",
        "outputs": [{"name": "tokenId", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "to", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "awardReputationTokens",
        "outputs": [{"name": "success", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]

# Default test account (Hardhat account #0)
DEFAULT_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
DEFAULT_ACCOUNT = Account.from_key(DEFAULT_PRIVATE_KEY)

class RewardRequest(BaseModel):
    official_id: str
    commitment_id: int
    achievement_type: str
    wallet_address: str
    environmental_metrics: Dict[str, float]
    validation_data: Optional[Dict[str, Any]] = None

class NFTBadgeResponse(BaseModel):
    nft_id: str
    token_id: int
    official_id: str
    badge_type: str
    mint_transaction: str
    metadata_uri: str
    opensea_url: str
    blockchain_network: str
    contract_address: str

class ReputationTokenResponse(BaseModel):
    official_id: str
    tokens_awarded: int
    current_reputation: int
    achievement_unlock: str
    transaction_hash: str
    wallet_address: str
    contract_address: str

class RewardDashboard(BaseModel):
    official_id: str
    wallet_address: str
    nft_badges: List[Dict[str, Any]]
    reputation_tokens: Dict[str, Any]
    achievements: Dict[str, Any]
    blockchain_status: Dict[str, Any]

async def validate_environmental_achievement(commitment_id: int, achievement_type: str, metrics: Dict[str, float]) -> bool:
    """Validate environmental achievement based on satellite data and thresholds"""
    try:
        # Get satellite data for the commitment
        satellite_data = await get_satellite_data_for_commitment(commitment_id)
        
        if not satellite_data:
            print(f"No satellite data found for commitment {commitment_id}")
            return False
        
        # Define achievement thresholds
        thresholds = {
            "forest_protection": {"min_forest_coverage": 0.75, "min_increase": 0.05},
            "air_quality_improvement": {"max_pm25": 25.0, "min_reduction": 0.15},
            "water_quality": {"min_water_quality_index": 7.0, "max_pollution": 3.0},
            "carbon_reduction": {"max_carbon_emissions": 1000, "min_reduction": 0.20},
            "biodiversity_conservation": {"min_biodiversity_score": 0.8, "min_species_count": 50}
        }
        
        threshold = thresholds.get(achievement_type)
        if not threshold:
            print(f"Unknown achievement type: {achievement_type}")
            return False
        
        # Validate based on achievement type
        if achievement_type == "forest_protection":
            forest_coverage = metrics.get("forest_coverage", 0)
            coverage_increase = metrics.get("coverage_increase", 0)
            return (forest_coverage >= threshold["min_forest_coverage"] and 
                   coverage_increase >= threshold["min_increase"])
        
        elif achievement_type == "air_quality_improvement":
            pm25_level = metrics.get("pm25_level", float('inf'))
            pm25_reduction = metrics.get("pm25_reduction", 0)
            return (pm25_level <= threshold["max_pm25"] and 
                   pm25_reduction >= threshold["min_reduction"])
        
        elif achievement_type == "water_quality":
            water_quality = metrics.get("water_quality_index", 0)
            pollution_level = metrics.get("pollution_level", float('inf'))
            return (water_quality >= threshold["min_water_quality_index"] and 
                   pollution_level <= threshold["max_pollution"])
        
        elif achievement_type == "carbon_reduction":
            carbon_emissions = metrics.get("carbon_emissions", float('inf'))
            emissions_reduction = metrics.get("emissions_reduction", 0)
            return (carbon_emissions <= threshold["max_carbon_emissions"] and 
                   emissions_reduction >= threshold["min_reduction"])
        
        elif achievement_type == "biodiversity_conservation":
            biodiversity_score = metrics.get("biodiversity_score", 0)
            species_count = metrics.get("species_count", 0)
            return (biodiversity_score >= threshold["min_biodiversity_score"] and 
                   species_count >= threshold["min_species_count"])
        
        return False
        
    except Exception as e:
        print(f"Error validating environmental achievement: {e}")
        return False

async def create_nft_metadata(achievement_type: str, official_id: str, commitment_id: int, metrics: Dict[str, float]) -> Dict[str, Any]:
    """Create comprehensive NFT metadata with environmental data"""
    
    achievement_names = {
        "forest_protection": "Forest Guardian",
        "air_quality_improvement": "Air Quality Champion",
        "water_quality": "Water Protector",
        "carbon_reduction": "Carbon Reducer",
        "biodiversity_conservation": "Biodiversity Guardian"
    }
    
    achievement_descriptions = {
        "forest_protection": "Verified forest protection and reforestation achievement",
        "air_quality_improvement": "Proven air quality improvement in monitored region",
        "water_quality": "Successful water quality enhancement and protection",
        "carbon_reduction": "Significant carbon emission reduction achievement",
        "biodiversity_conservation": "Outstanding biodiversity conservation and species protection"
    }
    
    # Calculate rarity based on metrics
    def calculate_rarity(metrics: Dict[str, float]) -> str:
        score = sum(metrics.values()) / len(metrics) if metrics else 0
        if score >= 0.9:
            return "Legendary"
        elif score >= 0.8:
            return "Epic"
        elif score >= 0.6:
            return "Rare"
        else:
            return "Common"
    
    rarity = calculate_rarity(metrics)
    
    # Create attributes from metrics
    attributes = [
        {"trait_type": "Achievement Type", "value": achievement_names.get(achievement_type, achievement_type)},
        {"trait_type": "Official ID", "value": official_id},
        {"trait_type": "Commitment ID", "value": str(commitment_id)},
        {"trait_type": "Rarity", "value": rarity},
        {"trait_type": "Verification Date", "value": datetime.now().strftime("%Y-%m-%d")},
        {"trait_type": "Blockchain Network", "value": "Hardhat Local"}
    ]
    
    # Add metric-specific attributes
    for key, value in metrics.items():
        formatted_key = key.replace('_', ' ').title()
        attributes.append({"trait_type": formatted_key, "value": str(round(value, 4))})
    
    metadata = {
        "name": f"EcoChain {achievement_names.get(achievement_type, achievement_type)} Badge",
        "description": achievement_descriptions.get(achievement_type, "Environmental achievement verified on blockchain"),
        "image": f"https://ecochain-nft-assets.com/badges/{achievement_type}.png",
        "external_url": f"https://ecochain.gov/commitments/{commitment_id}",
        "attributes": attributes,
        "environmental_data": {
            "commitment_id": commitment_id,
            "metrics": metrics,
            "verification_timestamp": datetime.now().isoformat(),
            "achievement_type": achievement_type,
            "official_id": official_id
        },
        "animation_url": f"https://ecochain-nft-assets.com/animations/{achievement_type}.mp4"
    }
    
    return metadata

async def upload_metadata_to_ipfs(metadata: Dict[str, Any]) -> str:
    """Upload NFT metadata to IPFS (mock implementation for local development)"""
    try:
        # For local development, we'll create a mock IPFS hash
        # In production, use real IPFS service like Pinata or IPFS node
        
        metadata_json = json.dumps(metadata, sort_keys=True)
        metadata_hash = hashlib.sha256(metadata_json.encode()).hexdigest()[:32]
        
        # Mock IPFS hash format
        ipfs_hash = f"QmNFT{metadata_hash}"
        
        # In production, replace with actual IPFS upload:
        # pinata_response = requests.post(
        #     "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        #     json=metadata,
        #     headers={"Authorization": f"Bearer {PINATA_JWT_TOKEN}"}
        # )
        # ipfs_hash = pinata_response.json()["IpfsHash"]
        
        return f"ipfs://{ipfs_hash}"
        
    except Exception as e:
        print(f"Error uploading to IPFS: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload metadata: {str(e)}")

async def mint_nft_on_blockchain(wallet_address: str, achievement_type: str, metadata_uri: str) -> tuple[str, int]:
    """Mint NFT on the blockchain using smart contract"""
    try:
        if not w3.is_connected():
            raise HTTPException(status_code=500, detail="Blockchain connection failed")
        
        # Create contract instance
        nft_contract = w3.eth.contract(
            address=CONTRACT_ADDRESSES["REWARD_NFT_CONTRACT"],
            abi=REWARD_NFT_ABI
        )
        
        # Build transaction
        nonce = w3.eth.get_transaction_count(DEFAULT_ACCOUNT.address)
        
        transaction = nft_contract.functions.mintAchievementNFT(
            wallet_address,
            achievement_type,
            metadata_uri
        ).build_transaction({
            'chainId': 31337,  # Hardhat local chain ID
            'gas': 300000,
            'gasPrice': w3.to_wei('20', 'gwei'),
            'nonce': nonce,
        })
        
        # Sign and send transaction
        signed_txn = w3.eth.account.sign_transaction(transaction, DEFAULT_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        # Wait for confirmation
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
        
        # Extract token ID from logs (simplified)
        token_id = len(receipt.logs)  # Mock token ID
        
        return receipt.transactionHash.hex(), token_id
        
    except Exception as e:
        print(f"NFT minting error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to mint NFT: {str(e)}")

async def award_tokens_on_blockchain(wallet_address: str, token_amount: int) -> str:
    """Award reputation tokens on the blockchain"""
    try:
        if not w3.is_connected():
            raise HTTPException(status_code=500, detail="Blockchain connection failed")
        
        # Create contract instance
        nft_contract = w3.eth.contract(
            address=CONTRACT_ADDRESSES["REWARD_NFT_CONTRACT"],
            abi=REWARD_NFT_ABI
        )
        
        # Convert to wei (18 decimals)
        amount_wei = token_amount * (10 ** 18)
        
        # Build transaction
        nonce = w3.eth.get_transaction_count(DEFAULT_ACCOUNT.address)
        
        transaction = nft_contract.functions.awardReputationTokens(
            wallet_address,
            amount_wei
        ).build_transaction({
            'chainId': 31337,  # Hardhat local chain ID
            'gas': 200000,
            'gasPrice': w3.to_wei('20', 'gwei'),
            'nonce': nonce,
        })
        
        # Sign and send transaction
        signed_txn = w3.eth.account.sign_transaction(transaction, DEFAULT_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        # Wait for confirmation
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
        
        return receipt.transactionHash.hex()
        
    except Exception as e:
        print(f"Token awarding error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to award tokens: {str(e)}")

def calculate_token_reward(achievement_type: str, metrics: Dict[str, float]) -> int:
    """Calculate token reward based on achievement type and metrics"""
    base_rewards = {
        "forest_protection": 200,
        "air_quality_improvement": 150,
        "water_quality": 120,
        "carbon_reduction": 180,
        "biodiversity_conservation": 250
    }
    
    base_amount = base_rewards.get(achievement_type, 100)
    
    # Calculate bonus based on performance metrics
    if metrics:
        avg_performance = sum(metrics.values()) / len(metrics)
        bonus_multiplier = 1.0 + (avg_performance - 0.5)  # 0.5-1.5x multiplier
        bonus_multiplier = max(1.0, min(2.0, bonus_multiplier))  # Cap between 1x and 2x
    else:
        bonus_multiplier = 1.0
    
    return int(base_amount * bonus_multiplier)

@router.post("/mint-nft-badge", response_model=NFTBadgeResponse)
async def mint_achievement_nft(request: RewardRequest):
    """Mint real NFT badge for verified environmental achievement"""
    try:
        print(f"Processing NFT mint request for commitment {request.commitment_id}")
        
        # Validate wallet address
        if not Web3.is_address(request.wallet_address):
            raise HTTPException(status_code=400, detail="Invalid Ethereum wallet address")
        
        # Validate environmental achievement
        is_valid = await validate_environmental_achievement(
            request.commitment_id, 
            request.achievement_type, 
            request.environmental_metrics
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=400, 
                detail="Environmental achievement validation failed"
            )
        
        # Create NFT metadata
        metadata = await create_nft_metadata(
            request.achievement_type,
            request.official_id,
            request.commitment_id,
            request.environmental_metrics
        )
        
        # Upload metadata to IPFS
        metadata_uri = await upload_metadata_to_ipfs(metadata)
        
        # Mint NFT on blockchain
        tx_hash, token_id = await mint_nft_on_blockchain(
            request.wallet_address,
            request.achievement_type,
            metadata_uri
        )
        
        # Update database
        await db_claim_reward(request.commitment_id, token_id)
        
        # Create response
        response = NFTBadgeResponse(
            nft_id=f"ECG-NFT-{token_id}",
            token_id=token_id,
            official_id=request.official_id,
            badge_type=request.achievement_type,
            mint_transaction=tx_hash,
            metadata_uri=metadata_uri,
            opensea_url=f"https://testnets.opensea.io/assets/hardhat/{CONTRACT_ADDRESSES['REWARD_NFT_CONTRACT']}/{token_id}",
            blockchain_network="Hardhat Local",
            contract_address=CONTRACT_ADDRESSES["REWARD_NFT_CONTRACT"]
        )
        
        print(f"✅ NFT minted successfully: Token ID {token_id}, TX: {tx_hash}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error minting NFT: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to mint NFT: {str(e)}")

@router.post("/award-reputation-tokens", response_model=ReputationTokenResponse)
async def award_reputation_tokens(request: RewardRequest):
    """Award reputation tokens for environmental achievements"""
    try:
        print(f"Processing token award request for commitment {request.commitment_id}")
        
        # Validate wallet address
        if not Web3.is_address(request.wallet_address):
            raise HTTPException(status_code=400, detail="Invalid Ethereum wallet address")
        
        # Validate environmental achievement
        is_valid = await validate_environmental_achievement(
            request.commitment_id,
            request.achievement_type,
            request.environmental_metrics
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail="Environmental achievement validation failed"
            )
        
        # Calculate token reward
        token_amount = calculate_token_reward(request.achievement_type, request.environmental_metrics)
        
        # Award tokens on blockchain
        tx_hash = await award_tokens_on_blockchain(request.wallet_address, token_amount)
        
        # Determine achievement unlock
        achievement_unlocks = {
            (0, 500): "Eco Defender",
            (500, 1500): "Environmental Guardian",
            (1500, 3000): "Climate Champion",
            (3000, float('inf')): "Planetary Protector"
        }
        
        current_reputation = token_amount  # In production, query from blockchain
        achievement_unlock = "Eco Defender"
        
        for (min_tokens, max_tokens), rank in achievement_unlocks.items():
            if min_tokens <= current_reputation < max_tokens:
                achievement_unlock = rank
                break
        
        response = ReputationTokenResponse(
            official_id=request.official_id,
            tokens_awarded=token_amount,
            current_reputation=current_reputation,
            achievement_unlock=achievement_unlock,
            transaction_hash=tx_hash,
            wallet_address=request.wallet_address,
            contract_address=CONTRACT_ADDRESSES["REWARD_NFT_CONTRACT"]
        )
        
        print(f"✅ Tokens awarded successfully: {token_amount} ECG, TX: {tx_hash}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error awarding tokens: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to award tokens: {str(e)}")

@router.get("/rewards-dashboard/{official_id}", response_model=RewardDashboard)
async def get_rewards_dashboard(official_id: str):
    """Get comprehensive rewards dashboard with real blockchain data"""
    try:
        print(f"Fetching rewards dashboard for official {official_id}")
        
        # In production, these would be real blockchain queries
        # For now, we'll return structured data that reflects what would come from blockchain
        
        mock_wallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"  # Hardhat account #0
        
        dashboard = RewardDashboard(
            official_id=official_id,
            wallet_address=mock_wallet,
            nft_badges=[
                {
                    "token_id": 1,
                    "name": "Forest Guardian Badge",
                    "achievement_type": "forest_protection",
                    "earned_date": datetime.now().isoformat(),
                    "rarity": "Epic",
                    "metadata_uri": "ipfs://QmNFTforest123...",
                    "opensea_url": f"https://testnets.opensea.io/assets/hardhat/{CONTRACT_ADDRESSES['REWARD_NFT_CONTRACT']}/1",
                    "contract_address": CONTRACT_ADDRESSES["REWARD_NFT_CONTRACT"]
                },
                {
                    "token_id": 2,
                    "name": "Air Quality Champion Badge",
                    "achievement_type": "air_quality_improvement",
                    "earned_date": datetime.now().isoformat(),
                    "rarity": "Rare",
                    "metadata_uri": "ipfs://QmNFTair456...",
                    "opensea_url": f"https://testnets.opensea.io/assets/hardhat/{CONTRACT_ADDRESSES['REWARD_NFT_CONTRACT']}/2",
                    "contract_address": CONTRACT_ADDRESSES["REWARD_NFT_CONTRACT"]
                }
            ],
            reputation_tokens={
                "balance": 2500,
                "symbol": "ECG",
                "decimals": 18,
                "contract_address": CONTRACT_ADDRESSES["REWARD_NFT_CONTRACT"],
                "last_updated": datetime.now().isoformat()
            },
            achievements={
                "current_rank": "Environmental Guardian",
                "next_rank": "Climate Champion",
                "tokens_to_next_rank": 500,
                "achievements_unlocked": 8,
                "total_achievements": 25,
                "completion_percentage": 32.0
            },
            blockchain_status={
                "network": "Hardhat Local",
                "connected": w3.is_connected() if w3 else False,
                "latest_block": w3.eth.block_number if w3 and w3.is_connected() else 0,
                "gas_price_gwei": float(w3.from_wei(w3.eth.gas_price, 'gwei')) if w3 and w3.is_connected() else 0,
                "contract_addresses": CONTRACT_ADDRESSES
            }
        )
        
        print(f"✅ Dashboard data retrieved for official {official_id}")
        return dashboard
        
    except Exception as e:
        print(f"Error fetching dashboard: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard: {str(e)}")

@router.get("/blockchain-status")
async def get_blockchain_status():
    """Get current blockchain connection and contract status"""
    try:
        if not w3:
            return {
                "connected": False,
                "error": "Web3 instance not initialized",
                "network": "Unknown"
            }
        
        is_connected = w3.is_connected()
        
        if is_connected:
            latest_block = w3.eth.block_number
            gas_price = w3.eth.gas_price
            chain_id = w3.eth.chain_id
        else:
            latest_block = 0
            gas_price = 0
            chain_id = 0
        
        return {
            "connected": is_connected,
            "network": "Hardhat Local" if chain_id == 31337 else f"Chain ID: {chain_id}",
            "chain_id": chain_id,
            "latest_block": latest_block,
            "gas_price_gwei": float(w3.from_wei(gas_price, 'gwei')) if gas_price > 0 else 0,
            "contracts": CONTRACT_ADDRESSES,
            "default_account": DEFAULT_ACCOUNT.address,
            "rpc_url": ETH_RPC_URL,
            "status": "operational" if is_connected else "disconnected"
        }
        
    except Exception as e:
        return {
            "connected": False,
            "error": str(e),
            "network": "Error",
            "status": "error"
        }

@router.get("/achievement-types")
async def get_achievement_types():
    """Get list of available achievement types and their requirements"""
    return {
        "achievement_types": [
            {
                "type": "forest_protection",
                "name": "Forest Guardian",
                "description": "Protect and restore forest areas",
                "requirements": {
                    "min_forest_coverage": 0.75,
                    "min_increase": 0.05
                },
                "base_reward": 200,
                "badge_color": "green"
            },
            {
                "type": "air_quality_improvement",
                "name": "Air Quality Champion",
                "description": "Improve air quality in monitored regions",
                "requirements": {
                    "max_pm25": 25.0,
                    "min_reduction": 0.15
                },
                "base_reward": 150,
                "badge_color": "blue"
            },
            {
                "type": "water_quality",
                "name": "Water Protector",
                "description": "Enhance water quality and protection",
                "requirements": {
                    "min_water_quality_index": 7.0,
                    "max_pollution": 3.0
                },
                "base_reward": 120,
                "badge_color": "cyan"
            },
            {
                "type": "carbon_reduction",
                "name": "Carbon Reducer",
                "description": "Reduce carbon emissions significantly",
                "requirements": {
                    "max_carbon_emissions": 1000,
                    "min_reduction": 0.20
                },
                "base_reward": 180,
                "badge_color": "purple"
            },
            {
                "type": "biodiversity_conservation",
                "name": "Biodiversity Guardian",
                "description": "Conserve and protect biodiversity",
                "requirements": {
                    "min_biodiversity_score": 0.8,
                    "min_species_count": 50
                },
                "base_reward": 250,
                "badge_color": "orange"
            }
        ]
    }

@router.post("/validate-achievement")
async def validate_achievement_endpoint(request: RewardRequest):
    """Validate an environmental achievement without minting rewards"""
    try:
        is_valid = await validate_environmental_achievement(
            request.commitment_id,
            request.achievement_type,
            request.environmental_metrics
        )
        
        token_reward = calculate_token_reward(request.achievement_type, request.environmental_metrics)
        
        return {
            "commitment_id": request.commitment_id,
            "achievement_type": request.achievement_type,
            "is_valid": is_valid,
            "estimated_token_reward": token_reward,
            "validation_timestamp": datetime.now().isoformat(),
            "metrics_summary": {
                "total_metrics": len(request.environmental_metrics),
                "average_score": sum(request.environmental_metrics.values()) / len(request.environmental_metrics) if request.environmental_metrics else 0
            }
        }
        
    except Exception as e:
        print(f"Error validating achievement: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to validate achievement: {str(e)}")