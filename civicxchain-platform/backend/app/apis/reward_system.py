from fastapi import APIRouter, HTTPException
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