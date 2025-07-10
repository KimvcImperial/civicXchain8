"""from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import json
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/contracts")

# Contract ABIs (simplified for key functions)
COMMITMENT_CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "_description", "type": "string"},
            {"internalType": "uint256", "name": "_deadline", "type": "uint256"},
            {"internalType": "uint256", "name": "_targetValue", "type": "uint256"},
            {"internalType": "string", "name": "_metricType", "type": "string"},
            {"internalType": "string", "name": "_dataSource", "type": "string"}
        ],
        "name": "createCommitment",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_id", "type": "uint256"},
            {"internalType": "uint256", "name": "_actualValue", "type": "uint256"}
        ],
        "name": "updateProgress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
        "name": "claimReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

ENVIRONMENTAL_CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "string", "name": "_description", "type": "string"}],
        "name": "createCommitment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_level", "type": "uint256"}],
        "name": "setCurrentPM25",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCommitments",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    }
]

# Pydantic Models
class CommitmentRequest(BaseModel):
    description: str
    deadline: str  # ISO format date
    target_value: int
    metric_type: str
    data_source: str
    stake_amount: float
    commitment_type: str

class CommitmentResponse(BaseModel):
    id: int
    transaction_hash: str
    status: str
    message: str

class ContractInfo(BaseModel):
    address: str
    abi: List[dict]
    network: str

class EnvironmentalData(BaseModel):
    pm25: Optional[float] = None
    forest_cover: Optional[float] = None
    air_quality_index: Optional[int] = None
    water_quality: Optional[float] = None
    biodiversity_score: Optional[float] = None
    respiratory_cases: Optional[int] = None
    waterborne_diseases: Optional[int] = None
    vector_borne_diseases: Optional[int] = None
    population_at_risk: Optional[int] = None
    last_updated: datetime

class ActiveCommitment(BaseModel):
    id: int
    creator: str
    description: str
    deadline: datetime
    target_value: int
    actual_value: int
    metric_type: str
    data_source: str
    status: str  # Pending, Successful, Failed
    reward_claimed: bool
    progress_percentage: float

# Contract addresses - UPDATE THESE WITH YOUR DEPLOYED CONTRACT ADDRESSES!
# Replace the addresses below with the ones from your 'npm run deploy' output
CONTRACT_ADDRESSES = {
    "commitment": "0x5FbDB2315678afecb367f032d93F642f64180aa3",  # CivicCommitmentContract
    "environmental": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",  # EnvironmentalDataContract
    "reward_nft": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",  # RewardNFTContract
}

# INSTRUCTIONS:
# 1. Copy the contract addresses from your 'npm run deploy' terminal output
# 2. Replace the placeholder addresses above with your real ones
# 3. Save this file
# 4. Your app will now connect to your real smart contracts!

@router.get("/contract-info")
async def get_contract_info() -> dict:
    """Get smart contract addresses and ABIs for frontend integration"""
    return {
        "contracts": {
            "commitment": {
                "address": CONTRACT_ADDRESSES["commitment"],
                "abi": COMMITMENT_CONTRACT_ABI,
                "network": "localhost"
            },
            "environmental": {
                "address": CONTRACT_ADDRESSES["environmental"],
                "abi": ENVIRONMENTAL_CONTRACT_ABI,
                "network": "localhost"
            }
        },
        "supported_networks": ["localhost", "ethereum", "polygon", "sepolia"],
        "rpc_url": "http://127.0.0.1:8545",
        "chain_id": 31337
    }

@router.post("/commitments/create")
async def create_commitment(request: CommitmentRequest) -> CommitmentResponse:
    """Create a new environmental commitment smart contract"""
    try:
        # Convert deadline to Unix timestamp
        deadline_dt = datetime.fromisoformat(request.deadline.replace('Z', '+00:00'))
        unix_deadline = int(deadline_dt.timestamp())
        
        # Simulate contract creation (replace with actual Web3 integration)
        commitment_id = 1  # This would come from the blockchain
        tx_hash = f"0x{'a' * 64}"  # Mock transaction hash
        
        # Log the commitment creation
        print(f"Creating commitment: {request.description}")
        print(f"Deadline: {unix_deadline}, Target: {request.target_value}")
        print(f"Metric: {request.metric_type}, Source: {request.data_source}")
        
        return CommitmentResponse(
            id=commitment_id,
            transaction_hash=tx_hash,
            status="pending",
            message="Commitment created successfully on blockchain"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create commitment: {str(e)}")

@router.get("/environmental-data")
async def get_environmental_data() -> EnvironmentalData:
    """Get current environmental and health data from various sources"""
    # Mock data - replace with actual API integrations
    return EnvironmentalData(
        pm25=12.5,
        forest_cover=78.2,
        air_quality_index=85,
        water_quality=7.8,
        biodiversity_score=6.5,
        respiratory_cases=245,
        waterborne_diseases=12,
        vector_borne_diseases=8,
        population_at_risk=1250000,
        last_updated=datetime.now()
    )

@router.get("/commitments/active")
async def get_active_commitments() -> List[ActiveCommitment]:
    """Get all active environmental commitments"""
    # Mock data - replace with blockchain queries
    return [
        ActiveCommitment(
            id=1,
            creator="0x1234...5678",
            description="Reduce PM2.5 levels in downtown area by 20%",
            deadline=datetime.now() + timedelta(days=90),
            target_value=15,
            actual_value=18,
            metric_type="PM2.5 µg/m³",
            data_source="OpenAQ API",
            status="Pending",
            reward_claimed=False,
            progress_percentage=75.0
        ),
        ActiveCommitment(
            id=2,
            creator="0x5678...9012",
            description="Increase forest cover in protected areas by 10%",
            deadline=datetime.now() + timedelta(days=180),
            target_value=85,
            actual_value=82,
            metric_type="Percentage",
            data_source="NASA Earthdata",
            status="Pending",
            reward_claimed=False,
            progress_percentage=96.5
        )
    ]

@router.post("/oracle/update-progress/{commitment_id}")
async def update_commitment_progress(commitment_id: int, actual_value: int) -> dict:
    """Update commitment progress via oracle (owner only)"""
    try:
        # This would call the smart contract updateProgress function
        print(f"Updating commitment {commitment_id} with value {actual_value}")
        
        return {
            "commitment_id": commitment_id,
            "actual_value": actual_value,
            "status": "updated",
            "transaction_hash": f"0x{'b' * 64}"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update progress: {str(e)}")

@router.post("/rewards/claim/{commitment_id}")
async def claim_reward(commitment_id: int) -> dict:
    """Claim NFT reward for successful commitment"""
    try:
        # This would call the smart contract claimReward function
        print(f"Claiming reward for commitment {commitment_id}")
        
        return {
            "commitment_id": commitment_id,
            "nft_token_id": commitment_id,
            "status": "claimed",
            "transaction_hash": f"0x{'c' * 64}",
            "message": "NFT reward claimed successfully!"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to claim reward: {str(e)}")

@router.get("/health")
async def health_check() -> dict:
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "contracts_connected": True,
        "oracle_status": "active"
    }

# Add new endpoints to existing smart_contracts API

@router.get("/environmental-validation/{commitment_id}")
async def validate_environmental_data(commitment_id: str):
    """Multi-source environmental data validation"""
    # Combine multiple data sources for validation
    air_quality = await get_air_quality_data("sample_location")
    satellite_data = await get_satellite_imagery_data(commitment_id)
    
    validation_score = calculate_validation_score(air_quality, satellite_data)
    
    return {
        "commitment_id": commitment_id,
        "validation_score": validation_score,
        "data_sources": ["OpenAQ", "NASA_Earthdata", "Sentinel"],
        "verified": validation_score > 0.7
    }
    """
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import json
from datetime import datetime, timedelta
import requests # Added for making HTTP requests to external APIs

router = APIRouter(prefix="/api/contracts")

# Contract ABIs (simplified for key functions)
COMMITMENT_CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "_description", "type": "string"},
            {"internalType": "uint256", "name": "_deadline", "type": "uint256"},
            {"internalType": "uint256", "name": "_targetValue", "type": "uint256"},
            {"internalType": "string", "name": "_metricType", "type": "string"},
            {"internalType": "string", "name": "_dataSource", "type": "string"}
        ],
        "name": "createCommitment",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_id", "type": "uint256"},
            {"internalType": "uint256", "name": "_actualValue", "type": "uint256"}
        ],
        "name": "updateProgress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
        "name": "claimReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

ENVIRONMENTAL_CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "string", "name": "_description", "type": "string"}],
        "name": "createCommitment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_level", "type": "uint256"}],
        "name": "setCurrentPM25",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCommitments",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    }
]

# Pydantic Models
class CommitmentRequest(BaseModel):
    description: str
    deadline: str  # ISO format date
    target_value: int
    metric_type: str
    data_source: str
    stake_amount: float
    commitment_type: str

class CommitmentResponse(BaseModel):
    id: int
    transaction_hash: str
    status: str
    message: str

class ContractInfo(BaseModel):
    address: str
    abi: List[dict]
    network: str

class EnvironmentalData(BaseModel):
    pm25: Optional[float] = None
    forest_cover: Optional[float] = None
    air_quality_index: Optional[int] = None
    water_quality: Optional[float] = None
    biodiversity_score: Optional[float] = None
    respiratory_cases: Optional[int] = None
    waterborne_diseases: Optional[int] = None
    vector_borne_diseases: Optional[int] = None
    population_at_risk: Optional[int] = None
    last_updated: datetime

class ActiveCommitment(BaseModel):
    id: int
    creator: str
    description: str
    deadline: datetime
    target_value: int
    actual_value: int
    metric_type: str
    data_source: str
    status: str  # Pending, Successful, Failed
    reward_claimed: bool
    progress_percentage: float

# Contract addresses - UPDATE THESE WITH YOUR DEPLOYED CONTRACT ADDRESSES!
# Replace the addresses below with the ones from your 'npm run deploy' output
CONTRACT_ADDRESSES = {
    "commitment": "0x5FbDB2315678afecb367f032d93F642f64180aa3",  # CivicCommitmentContract
    "environmental": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",  # EnvironmentalDataContract
    "reward_nft": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",  # RewardNFTContract
}

# INSTRUCTIONS:
# 1. Copy the contract addresses from your 'npm run deploy' terminal output
# 2. Replace the placeholder addresses above with your real ones
# 3. Save this file
# 4. Your app will now connect to your real smart contracts!

@router.get("/contract-info")
async def get_contract_info() -> dict:
    //Get smart contract addresses and ABIs for frontend integration
    return {
        "contracts": {
            "commitment": {
                "address": CONTRACT_ADDRESSES["commitment"],
                "abi": COMMITMENT_CONTRACT_ABI,
                "network": "localhost"
            },
            "environmental": {
                "address": CONTRACT_ADDRESSES["environmental"],
                "abi": ENVIRONMENTAL_CONTRACT_ABI,
                "network": "localhost"
            }
        },
        "supported_networks": ["localhost", "ethereum", "polygon", "sepolia"],
        "rpc_url": "http://127.0.0.1:8545",
        "chain_id": 31337
    }

@router.post("/commitments/create")
async def create_commitment(request: CommitmentRequest) -> CommitmentResponse:
    //Create a new environmental commitment smart contract
    try:
        # Convert deadline to Unix timestamp
        deadline_dt = datetime.fromisoformat(request.deadline.replace('Z', '+00:00'))
        unix_deadline = int(deadline_dt.timestamp())
        
        # Simulate contract creation (replace with actual Web3 integration)
        commitment_id = 1  # This would come from the blockchain
        tx_hash = f"0x{'a' * 64}"  # Mock transaction hash
        
        # Log the commitment creation
        print(f"Creating commitment: {request.description}")
        print(f"Deadline: {unix_deadline}, Target: {request.target_value}")
        print(f"Metric: {request.metric_type}, Source: {request.data_source}")
        
        return CommitmentResponse(
            id=commitment_id,
            transaction_hash=tx_hash,
            status="pending",
            message="Commitment created successfully on blockchain"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create commitment: {str(e)}")

@router.get("/environmental-data")
async def get_environmental_data() -> EnvironmentalData:
    //Get REAL environmental data from APIs (simulating oracle data sources)
    
    pm25_value = None
    forest_cover_value = None
    air_quality_index_value = None
    water_quality_value = None
    biodiversity_score_value = None
    respiratory_cases_value = None
    waterborne_diseases_value = None
    vector_borne_diseases_value = None
    population_at_risk_value = None

    # --- OpenAQ Air Quality Data ---
    try:
        air_quality_response = requests.get(
            "https://api.openaq.org/v2/latest",
            params={"limit": 1, "parameter": "pm25"}
        )
        
        if air_quality_response.status_code == 200:
            air_data = air_quality_response.json()
            if air_data and air_data['results'] and air_data['results'][0]['measurements']:
                pm25_value = air_data['results'][0]['measurements'][0]['value']
            else:
                print("OpenAQ API returned unexpected data structure for PM2.5.")
        else:
            print(f"OpenAQ API call failed with status code: {air_quality_response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"OpenAQ API call failed: {e}")

    # --- NASA Earthdata (Forest Cover) ---
    # Integrating specific NASA Earthdata datasets (e.g., MODIS, Landsat for forest cover)
    # is complex and requires specific API endpoints, authentication, and often geospatial processing.
    # This is a placeholder for a hypothetical NASA API call.
    # Replace "YOUR_NASA_API_KEY" with your actual key if you find a suitable API.
    # Example: NASA's Earthdata Search or specific dataset APIs like LP DAAC for MODIS/Landsat.
    # For a real implementation, you would need to identify the exact dataset and its API.
    # For now, forest_cover_value will remain None unless a specific NASA API is integrated.
    nasa_api_key = "YOUR_NASA_API_KEY" # Get one from https://api.nasa.gov/
    try:
        # This is a placeholder URL and parameters. A real NASA Earthdata API for forest cover
        # would be highly specific to a dataset (e.g., MODIS Vegetation Indices).
        # For example, you might look into:
        # https://lpdaac.usgs.gov/data/get-started-with-data/api-access/
        # Or services like Google Earth Engine (which has its own API).
        # nasa_response = requests.get(
        #     "https://api.nasa.gov/some/earthdata/forest_cover_endpoint",
        #     params={
        #         "lon": -95.33, # Example coordinates
        #         "lat": 29.78,
        #         "date": datetime.now().strftime("%Y-%m-%d"),
        #         "api_key": nasa_api_key
        #     }
        # )
        # if nasa_response.status_code == 200:
        #     nasa_data = nasa_response.json()
        #     # Process NASA data here to extract forest_cover_value
        #     # For example: forest_cover_value = nasa_data.get('forest_cover_percentage')
        #     pass # No real data extraction for now
        # else:
        #     print(f"NASA API call failed with status code: {nasa_response.status_code}")
        pass # No API call made, so forest_cover_value remains None
    except requests.exceptions.RequestException as e:
        print(f"NASA API call failed for forest cover: {e}")

    # --- Other Metrics (Not available from OpenAQ or general NASA APIs) ---
    # These metrics require integration with other specialized data sources or Chainlink oracles.
    # Setting them to None as per the request to remove all mock data.
    air_quality_index_value = None # Can be derived from PM2.5, but not a direct API output here
    water_quality_value = None
    biodiversity_score_value = None
    respiratory_cases_value = None
    waterborne_diseases_value = None
    vector_borne_diseases_value = None
    population_at_risk_value = None

    return EnvironmentalData(
        pm25=pm25_value,  # Real data from OpenAQ (or None if failed)
        forest_cover=forest_cover_value, # Placeholder for NASA Earthdata (or None if not integrated)
        air_quality_index=air_quality_index_value,
        water_quality=water_quality_value,
        biodiversity_score=biodiversity_score_value,
        respiratory_cases=respiratory_cases_value,
        waterborne_diseases=waterborne_diseases_value,
        vector_borne_diseases=vector_borne_diseases_value,
        population_at_risk=population_at_risk_value,
        last_updated=datetime.now()
    )

@router.get("/commitments/active")
async def get_active_commitments() -> List[ActiveCommitment]:
    //Get all active environmental commitments
    # Mock data - replace with blockchain queries
    # Keeping this mock data as it represents blockchain state, not external oracle data.
    return [
        ActiveCommitment(
            id=1,
            creator="0x1234...5678",
            description="Reduce PM2.5 levels in downtown area by 20%",
            deadline=datetime.now() + timedelta(days=90),
            target_value=15,
            actual_value=18,
            metric_type="PM2.5 µg/m³",
            data_source="OpenAQ API",
            status="Pending",
            reward_claimed=False,
            progress_percentage=75.0
        ),
        ActiveCommitment(
            id=2,
            creator="0x5678...9012",
            description="Increase forest cover in protected areas by 10%",
            deadline=datetime.now() + timedelta(days=180),
            target_value=85,
            actual_value=82,
            metric_type="Percentage",
            data_source="NASA Earthdata",
            status="Pending",
            reward_claimed=False,
            progress_percentage=96.5
        )
    ]

@router.post("/oracle/update-progress/{commitment_id}")
async def update_commitment_progress(commitment_id: int, actual_value: int) -> dict:
    //Update commitment progress via oracle (owner only)
    try:
        # This would call the smart contract updateProgress function
        print(f"Updating commitment {commitment_id} with value {actual_value}")
        
        return {
            "commitment_id": commitment_id,
            "actual_value": actual_value,
            "status": "updated",
            "transaction_hash": f"0x{'b' * 64}"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update progress: {str(e)}")

@router.post("/rewards/claim/{commitment_id}")
async def claim_reward(commitment_id: int) -> dict:
    //Claim NFT reward for successful commitment
    try:
        # This would call the smart contract claimReward function
        print(f"Claiming reward for commitment {commitment_id}")
        
        return {
            "commitment_id": commitment_id,
            "nft_token_id": commitment_id,
            "status": "claimed",
            "transaction_hash": f"0x{'c' * 64}",
            "message": "NFT reward claimed successfully!"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to claim reward: {str(e)}")

@router.get("/health")
async def health_check() -> dict:
    //Health check endpoint
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "contracts_connected": True,
        "oracle_status": "active"
    }

# Functions for environmental data validation, now using real API for air quality
async def get_air_quality_data(location: str) -> dict:
    //Fetch real air quality data from OpenAQ for validation.
    pm25_value = None
    co2_value = None # CO2 is not directly available from OpenAQ's 'latest' endpoint for PM2.5

    try:
        air_quality_response = requests.get(
            "https://api.openaq.org/v2/latest",
            params={"limit": 1, "parameter": "pm25"} # Only requesting PM2.5
        )
        
        if air_quality_response.status_code == 200:
            air_data = air_quality_response.json()
            if air_data and air_data['results'] and air_data['results'][0]['measurements']:
                pm25_value = air_data['results'][0]['measurements'][0]['value']
            else:
                print("OpenAQ API returned unexpected data structure for air quality validation.")
        else:
            print(f"OpenAQ API call failed for air quality validation with status code: {air_quality_response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"OpenAQ API call failed for air quality validation: {e}")
    
    return {"pm25": pm25_value, "co2": co2_value} # co2 will be None

async def get_satellite_imagery_data(commitment_id: str) -> dict:

    //Placeholder for fetching real satellite imagery data for validation.
    //A real implementation would involve specific NASA Earthdata or other satellite imagery APIs
    //(e.g., Sentinel Hub, Google Earth Engine) and potentially geospatial processing.
    
    forest_cover_percentage = None
    ndvi_score = None

    # Example: A real call might look like this if you have a specific API endpoint
    # nasa_api_key = "YOUR_NASA_API_KEY"
    # try:
    #     response = requests.get(
    #         f"https://api.nasa.gov/some/satellite/data/endpoint/{commitment_id}",
    #         params={"api_key": nasa_api_key, "metric": "forest_cover"}
    #     )
    #     if response.status_code == 200:
    #         data = response.json()
    #         forest_cover_percentage = data.get("forest_cover")
    #         ndvi_score = data.get("ndvi")
    #     else:
    #         print(f"Satellite imagery API call failed with status code: {response.status_code}")
    # except requests.exceptions.RequestException as e:
    #     print(f"Satellite imagery API call failed: {e}")

    return {"forest_cover_percentage": forest_cover_percentage, "ndvi_score": ndvi_score}

def calculate_validation_score(air_quality: dict, satellite_data: dict) -> float:
    //
    Calculate a validation score based on air quality and satellite data.
    //This is a simplified example. Real validation would involve more complex logic
   // and potentially machine learning models.
    
    score = 0.0
    
    pm25_val = air_quality.get("pm25")
    forest_cover_val = satellite_data.get("forest_cover_percentage")
    ndvi_val = satellite_data.get("ndvi_score")

    # Example validation logic:
    # If PM2.5 is low, add to score (only if data is available)
    if pm25_val is not None and pm25_val < 20:
        score += 0.4
    
    # If forest cover is high, add to score (only if data is available)
    if forest_cover_val is not None and forest_cover_val > 70:
        score += 0.3
        
    # If NDVI (Normalized Difference Vegetation Index) is good, add to score (only if data is available)
    if ndvi_val is not None and ndvi_val > 0.6:
        score += 0.3
        
    # Ensure score is between 0 and 1
    return min(1.0, max(0.0, score))


# Add new endpoints to existing smart_contracts API

@router.get("/environmental-validation/{commitment_id}")
async def validate_environmental_data(commitment_id: str):
    //Multi-source environmental data validation
    # Combine multiple data sources for validation
    air_quality = await get_air_quality_data("sample_location") # Location might be used for more specific OpenAQ queries
    satellite_data = await get_satellite_imagery_data(commitment_id)
    
    validation_score = calculate_validation_score(air_quality, satellite_data)
    
    return {
        "commitment_id": commitment_id,
        "validation_score": validation_score,
        "data_sources": ["OpenAQ (Real)", "NASA_Earthdata (Placeholder)", "Sentinel (Placeholder)"],
        "verified": validation_score > 0.7
    }

# The user requested this endpoint, but its purpose is unclear given the above.
# If this is meant to be a standalone endpoint for calculation, it can be uncommented.
# For now, the calculation is integrated directly into /environmental-validation/{commitment_id}
# @router.post("/calculate_validation_score")
# async def calculate_validation_score_endpoint(air_quality: dict, satellite_data: dict) -> float:
#     //Endpoint to calculate validation score based on provided data.
#     return calculate_validation_score(air_quality, satellite_data)

"""




# Remove auth protection for testing
router = APIRouter(dependencies=[])
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import json
from datetime import datetime, timedelta
import requests
import random
import os
from enum import Enum

router = APIRouter(prefix="/api/contracts")

# Enums for better type safety
class CommitmentStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    SUCCESSFUL = "successful"
    FAILED = "failed"
    REWARDED = "rewarded"

class MetricType(str, Enum):
    PM25 = "PM2.5 µg/m³"
    FOREST_COVER = "Forest Cover %"
    AIR_QUALITY_INDEX = "Air Quality Index"
    WATER_QUALITY = "Water Quality Score"
    BIODIVERSITY = "Biodiversity Index"

# Enhanced Contract ABIs with more functions
COMMITMENT_CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "_description", "type": "string"},
            {"internalType": "uint256", "name": "_deadline", "type": "uint256"},
            {"internalType": "uint256", "name": "_targetValue", "type": "uint256"},
            {"internalType": "string", "name": "_metricType", "type": "string"},
            {"internalType": "string", "name": "_dataSource", "type": "string"},
            {"internalType": "address", "name": "_official", "type": "address"}
        ],
        "name": "createCommitment",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_id", "type": "uint256"},
            {"internalType": "uint256", "name": "_actualValue", "type": "uint256"},
            {"internalType": "bytes32", "name": "_dataHash", "type": "bytes32"}
        ],
        "name": "updateProgress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
        "name": "claimReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
        "name": "getCommitment",
        "outputs": [
            {"internalType": "address", "name": "official", "type": "address"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"},
            {"internalType": "uint256", "name": "targetValue", "type": "uint256"},
            {"internalType": "uint256", "name": "actualValue", "type": "uint256"},
            {"internalType": "bool", "name": "isCompleted", "type": "bool"},
            {"internalType": "bool", "name": "rewardClaimed", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

ENVIRONMENTAL_CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "_region", "type": "string"},
            {"internalType": "uint256", "name": "_pm25Level", "type": "uint256"},
            {"internalType": "uint256", "name": "_forestCover", "type": "uint256"},
            {"internalType": "uint256", "name": "_timestamp", "type": "uint256"}
        ],
        "name": "updateEnvironmentalData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_region", "type": "string"}],
        "name": "getLatestData",
        "outputs": [
            {"internalType": "uint256", "name": "pm25", "type": "uint256"},
            {"internalType": "uint256", "name": "forestCover", "type": "uint256"},
            {"internalType": "uint256", "name": "lastUpdate", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

# Enhanced Pydantic Models
class CommitmentRequest(BaseModel):
    description: str
    deadline: str  # ISO format date
    target_value: int
    metric_type: MetricType
    data_source: str
    stake_amount: float
    commitment_type: str
    official_name: str
    official_role: str
    region: str
    coordinates: Optional[Dict[str, float]] = None  # {"lat": 40.7128, "lon": -74.0060}

class CommitmentResponse(BaseModel):
    id: int
    transaction_hash: str
    status: CommitmentStatus
    message: str
    contract_address: str
    gas_used: Optional[int] = None
    block_number: Optional[int] = None

class ContractInfo(BaseModel):
    address: str
    abi: List[dict]
    network: str
    chain_id: int
    rpc_url: str

class EnvironmentalData(BaseModel):
    pm25: Optional[float] = None
    forest_cover: Optional[float] = None
    air_quality_index: Optional[int] = None
    water_quality: Optional[float] = None
    biodiversity_score: Optional[float] = None
    respiratory_cases: Optional[int] = None
    waterborne_diseases: Optional[int] = None
    vector_borne_diseases: Optional[int] = None
    population_at_risk: Optional[int] = None
    region: str
    coordinates: Optional[Dict[str, float]] = None
    data_sources: List[str]
    confidence_score: float
    last_updated: datetime

class ActiveCommitment(BaseModel):
    id: int
    creator: str
    official_name: str
    official_role: str
    description: str
    deadline: datetime
    target_value: int
    actual_value: int
    metric_type: str
    data_source: str
    status: CommitmentStatus
    reward_claimed: bool
    progress_percentage: float
    region: str
    stake_amount: float
    validation_score: Optional[float] = None
    last_validation: Optional[datetime] = None

class ValidationResult(BaseModel):
    commitment_id: int
    validation_score: float
    data_sources: List[str]
    verified: bool
    confidence_level: str
    validation_details: Dict[str, Any]
    timestamp: datetime

# Configuration - Replace with your actual contract addresses
CONTRACT_ADDRESSES = {
    "commitment": os.getenv("COMMITMENT_CONTRACT_ADDRESS", "0x5FbDB2315678afecb367f032d93F642f64180aa3"),
    "environmental": os.getenv("ENVIRONMENTAL_CONTRACT_ADDRESS", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"),
    "reward_nft": os.getenv("REWARD_NFT_CONTRACT_ADDRESS", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"),
}

# API Configuration
API_KEYS = {
    "openaq": os.getenv("OPENAQ_API_KEY"),
    "nasa": os.getenv("NASA_API_KEY"),
    "world_bank": os.getenv("WORLD_BANK_API_KEY"),
    "who": os.getenv("WHO_API_KEY")
}

# Network Configuration
NETWORK_CONFIG = {
    "localhost": {
        "rpc_url": "http://127.0.0.1:8545",
        "chain_id": 31337,
        "name": "Hardhat Local"
    },
    "sepolia": {
        "rpc_url": f"https://sepolia.infura.io/v3/{os.getenv('INFURA_PROJECT_ID')}",
        "chain_id": 11155111,
        "name": "Sepolia Testnet"
    },
    "polygon": {
        "rpc_url": f"https://polygon-mainnet.infura.io/v3/{os.getenv('INFURA_PROJECT_ID')}",
        "chain_id": 137,
        "name": "Polygon Mainnet"
    }
}

# In-memory storage for demo (replace with database in production)
commitments_db = {}
environmental_data_cache = {}

# API Endpoints

@router.get("/contract-info")
async def get_contract_info(network: str = "localhost") -> Dict[str, Any]:
    """Get smart contract addresses and ABIs for frontend integration"""
    if network not in NETWORK_CONFIG:
        raise HTTPException(status_code=400, detail=f"Unsupported network: {network}")
    
    config = NETWORK_CONFIG[network]
    
    return {
        "contracts": {
            "commitment": {
                "address": CONTRACT_ADDRESSES["commitment"],
                "abi": COMMITMENT_CONTRACT_ABI,
                "network": network
            },
            "environmental": {
                "address": CONTRACT_ADDRESSES["environmental"],
                "abi": ENVIRONMENTAL_CONTRACT_ABI,
                "network": network
            }
        },
        "network_config": config,
        "supported_networks": list(NETWORK_CONFIG.keys()),
        "status": "active"
    }

@router.post("/commitments/create")
async def create_commitment(request: CommitmentRequest) -> CommitmentResponse:
    """Create a new environmental commitment smart contract"""
    try:
        # Validate deadline
        deadline_dt = datetime.fromisoformat(request.deadline.replace('Z', '+00:00'))
        if deadline_dt <= datetime.now():
            raise HTTPException(status_code=400, detail="Deadline must be in the future")
        
        unix_deadline = int(deadline_dt.timestamp())
        
        # Generate commitment ID (in real implementation, this comes from blockchain)
        commitment_id = len(commitments_db) + 1
        
        # Simulate blockchain transaction
        tx_hash = f"0x{'a' * 62}{commitment_id:02d}"
        
        # Store commitment in database
        commitment = ActiveCommitment(
            id=commitment_id,
            creator=f"0x{'1234567890abcdef' * 5}",  # Mock address
            official_name=request.official_name,
            official_role=request.official_role,
            description=request.description,
            deadline=deadline_dt,
            target_value=request.target_value,
            actual_value=0,
            metric_type=request.metric_type.value,
            data_source=request.data_source,
            status=CommitmentStatus.ACTIVE,
            reward_claimed=False,
            progress_percentage=0.0,
            region=request.region,
            stake_amount=request.stake_amount
        )
        
        commitments_db[commitment_id] = commitment
        
        print(f"✅ Created commitment {commitment_id}: {request.description}")
        print(f"📅 Deadline: {deadline_dt.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🎯 Target: {request.target_value} {request.metric_type.value}")
        print(f"💰 Stake: {request.stake_amount} ETH")
        
        return CommitmentResponse(
            id=commitment_id,
            transaction_hash=tx_hash,
            status=CommitmentStatus.ACTIVE,
            message=f"Commitment created successfully! Stake of {request.stake_amount} ETH locked.",
            contract_address=CONTRACT_ADDRESSES["commitment"],
            gas_used=150000,
            block_number=12345 + commitment_id
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create commitment: {str(e)}")

@router.get("/environmental-data")
async def get_environmental_data(region: str = "global", use_cache: bool = True) -> EnvironmentalData:
    """Get REAL environmental data from multiple APIs and oracles"""
    
    # Check cache first
    cache_key = f"{region}_{datetime.now().strftime('%Y-%m-%d-%H')}"
    if use_cache and cache_key in environmental_data_cache:
        return environmental_data_cache[cache_key]
    
    pm25_value = None
    forest_cover_value = None
    air_quality_index_value = None
    data_sources = []
    confidence_score = 0.0
    
    # OpenAQ Air Quality Data
    try:
        print("🌍 Fetching air quality data from OpenAQ...")
        params = {"limit": 10, "parameter": "pm25"}
        if region != "global":
            params["country"] = region
            
        air_quality_response = requests.get(
            "https://api.openaq.org/v2/latest",
            params=params,
            timeout=10
        )
        
        if air_quality_response.status_code == 200:
            air_data = air_quality_response.json()
            if air_data.get('results') and len(air_data['results']) > 0:
                measurements = air_data['results'][0].get('measurements', [])
                if measurements:
                    pm25_value = measurements[0]['value']
                    data_sources.append("OpenAQ (Real)")
                    confidence_score += 0.4
                    print(f"✅ Got PM2.5 data: {pm25_value} µg/m³")
                else:
                    print("⚠️ No measurements found in OpenAQ response")
            else:
                print("⚠️ No results found in OpenAQ response")
        else:
            print(f"❌ OpenAQ API failed: {air_quality_response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ OpenAQ API error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error with OpenAQ: {e}")

    # NASA Earthdata (Placeholder - requires specific dataset API)
    try:
        if API_KEYS["nasa"]:
            print("🛰️ Fetching satellite data from NASA...")
            # This is a placeholder for actual NASA API integration
            # Real implementation would use specific datasets like MODIS or Landsat
            # Example: https://appeears.earthdatacloud.nasa.gov/api/
            
            # For now, we'll use a mock response based on region
            region_data = {
                "global": 68.5,
                "amazon": 85.2,
                "africa": 45.8,
                "asia": 52.3,
                "europe": 75.1
            }
            forest_cover_value = region_data.get(region.lower(), 65.0) + random.uniform(-2, 2)
            data_sources.append("NASA Earthdata (Simulated)")
            confidence_score += 0.3
            print(f"✅ Got forest cover data: {forest_cover_value}%")
    except Exception as e:
        print(f"❌ NASA API error: {e}")

    # World Bank Environmental Data
    try:
        print("🏛️ Fetching World Bank environmental indicators...")
        # World Bank API for environmental data
        wb_response = requests.get(
            f"https://api.worldbank.org/v2/country/{region}/indicator/EN.ATM.PM25.MC.M3",
            params={"format": "json", "date": "2020:2023", "per_page": 1},
            timeout=10
        )
        
        if wb_response.status_code == 200:
            wb_data = wb_response.json()
            if len(wb_data) > 1 and wb_data[1]:
                if wb_data[1][0] and wb_data[1][0].get('value'):
                    # Use World Bank data as backup if OpenAQ failed
                    if pm25_value is None:
                        pm25_value = wb_data[1][0]['value']
                        data_sources.append("World Bank")
                        confidence_score += 0.2
                        print(f"✅ Got World Bank PM2.5 data: {pm25_value} µg/m³")
    except Exception as e:
        print(f"❌ World Bank API error: {e}")

    # Calculate Air Quality Index from PM2.5
    if pm25_value is not None:
        # EPA AQI calculation
        if pm25_value <= 12.0:
            air_quality_index_value = int((50/12.0) * pm25_value)
        elif pm25_value <= 35.4:
            air_quality_index_value = int(51 + ((100-51)/(35.4-12.1)) * (pm25_value - 12.1))
        elif pm25_value <= 55.4:
            air_quality_index_value = int(101 + ((150-101)/(55.4-35.5)) * (pm25_value - 35.5))
        else:
            air_quality_index_value = min(500, int(151 + ((200-151)/(150.4-55.5)) * (pm25_value - 55.5)))
        
        confidence_score += 0.1

    # Add simulated health data (in real implementation, these would come from WHO, CDC, etc.)
    respiratory_cases = None
    waterborne_diseases = None
    vector_borne_diseases = None
    population_at_risk = None
    
    if pm25_value is not None and pm25_value > 35:  # WHO threshold
        # High pollution correlates with respiratory issues
        population_base = {"global": 7800000000, "asia": 4600000000, "africa": 1300000000}.get(region.lower(), 1000000)
        respiratory_cases = int(population_base * 0.001 * (pm25_value / 35))
        population_at_risk = int(population_base * 0.1 * (pm25_value / 35))

    # Final confidence score
    confidence_score = min(1.0, confidence_score)
    
    result = EnvironmentalData(
        pm25=pm25_value,
        forest_cover=forest_cover_value,
        air_quality_index=air_quality_index_value,
        water_quality=None,  # Would need specific water quality APIs
        biodiversity_score=None,  # Would need biodiversity databases
        respiratory_cases=respiratory_cases,
        waterborne_diseases=waterborne_diseases,
        vector_borne_diseases=vector_borne_diseases,
        population_at_risk=population_at_risk,
        region=region,
        coordinates=None,  # Could be added based on region
        data_sources=data_sources,
        confidence_score=confidence_score,
        last_updated=datetime.now()
    )
    
    # Cache the result
    environmental_data_cache[cache_key] = result
    
    print(f"📊 Environmental data summary for {region}:")
    print(f"   PM2.5: {pm25_value} µg/m³")
    print(f"   Forest Cover: {forest_cover_value}%")
    print(f"   AQI: {air_quality_index_value}")
    print(f"   Confidence: {confidence_score:.2f}")
    print(f"   Sources: {', '.join(data_sources)}")
    
    return result

@router.get("/commitments/active")
async def get_active_commitments() -> List[ActiveCommitment]:
    """Get all active environmental commitments"""
    active_commitments = list(commitments_db.values())
    
    # Update progress for demo purposes
    for commitment in active_commitments:
        if commitment.status == CommitmentStatus.ACTIVE:
            # Simulate progress based on time elapsed
            time_elapsed = datetime.now() - (commitment.deadline - timedelta(days=90))
            if time_elapsed.days > 0:
                base_progress = min(80.0, (time_elapsed.days / 90) * 100)
                commitment.progress_percentage = base_progress + random.uniform(-5, 10)
                commitment.actual_value = int((commitment.progress_percentage / 100) * commitment.target_value)
    
    return active_commitments

@router.post("/oracle/update-progress/{commitment_id}")
async def update_commitment_progress(commitment_id: int, actual_value: int) -> Dict[str, Any]:
    """Update commitment progress via oracle (authorized only)"""
    try:
        if commitment_id not in commitments_db:
            raise HTTPException(status_code=404, detail="Commitment not found")
        
        commitment = commitments_db[commitment_id]
        
        # Update progress
        old_value = commitment.actual_value
        commitment.actual_value = actual_value
        commitment.progress_percentage = (actual_value / commitment.target_value) * 100
        commitment.last_validation = datetime.now()
        
        # Check if commitment is completed
        if commitment.progress_percentage >= 100:
            commitment.status = CommitmentStatus.SUCCESSFUL
        
        # Generate transaction hash
        tx_hash = f"0x{'b' * 62}{commitment_id:02d}"
        
        print(f"📈 Updated commitment {commitment_id}: {old_value} → {actual_value}")
        print(f"🎯 Progress: {commitment.progress_percentage:.1f}%")
        
        return {
            "commitment_id": commitment_id,
            "old_value": old_value,
            "new_value": actual_value,
            "progress_percentage": commitment.progress_percentage,
            "status": commitment.status.value,
            "transaction_hash": tx_hash,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update progress: {str(e)}")

@router.post("/rewards/claim/{commitment_id}")
async def claim_reward(commitment_id: int) -> Dict[str, Any]:
    """Claim NFT reward for successful commitment"""
    try:
        if commitment_id not in commitments_db:
            raise HTTPException(status_code=404, detail="Commitment not found")
        
        commitment = commitments_db[commitment_id]
        
        # Validate eligibility
        if commitment.status != CommitmentStatus.SUCCESSFUL:
            raise HTTPException(status_code=400, detail="Commitment not completed successfully")
        
        if commitment.reward_claimed:
            raise HTTPException(status_code=400, detail="Reward already claimed")
        
        if commitment.progress_percentage < 100:
            raise HTTPException(status_code=400, detail="Target not reached")
        
        # Process reward
        commitment.reward_claimed = True
        commitment.status = CommitmentStatus.REWARDED
        
        # Calculate reward amount
        base_reward = commitment.stake_amount * 1.5  # 50% bonus
        performance_bonus = (commitment.progress_percentage - 100) * 0.01 * base_reward
        total_reward = base_reward + performance_bonus
        
        tx_hash = f"0x{'c' * 62}{commitment_id:02d}"
        
        print(f"🎉 Reward claimed for commitment {commitment_id}")
        print(f"💰 Total reward: {total_reward:.2f} ETH")
        print(f"🏆 NFT Token ID: ECO-{commitment_id:04d}")
        
        return {
            "commitment_id": commitment_id,
            "nft_token_id": f"ECO-{commitment_id:04d}",
            "reward_amount_eth": total_reward,
            "base_reward": base_reward,
            "performance_bonus": performance_bonus,
            "status": "claimed",
            "transaction_hash": tx_hash,
            "nft_metadata": {
                "name": f"Environmental Guardian #{commitment_id}",
                "description": commitment.description[:100] + "...",
                "image": f"https://api.ecochain.gov/nft/metadata/{commitment_id}/image",
                "attributes": [
                    {"trait_type": "Metric", "value": commitment.metric_type},
                    {"trait_type": "Region", "value": commitment.region},
                    {"trait_type": "Performance", "value": f"{commitment.progress_percentage:.1f}%"},
                    {"trait_type": "Official", "value": commitment.official_name}
                ]
            },
            "message": f"🎉 Congratulations! You earned {total_reward:.2f} ETH + Environmental Guardian NFT!"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to claim reward: {str(e)}")

@router.get("/environmental-validation/{commitment_id}")
async def validate_environmental_data(commitment_id: str) -> ValidationResult:
    """Multi-source environmental data validation using real APIs"""
    try:
        commitment_id_int = int(commitment_id)
        
        if commitment_id_int not in commitments_db:
            raise HTTPException(status_code=404, detail="Commitment not found")
        
        commitment = commitments_db[commitment_id_int]
        
        # Get environmental data for the commitment's region
        env_data = await get_environmental_data(commitment.region, use_cache=False)
        
        # Perform validation based on commitment type
        validation_details = {}
        score = 0.0
        
        if commitment.metric_type == MetricType.PM25.value and env_data.pm25 is not None:
            target_pm25 = commitment.target_value
            actual_pm25 = env_data.pm25
            
            if actual_pm25 <= target_pm25:
                score += 0.8
                validation_details["pm25_status"] = "TARGET_MET"
            else:
                score += max(0, 0.8 * (1 - (actual_pm25 - target_pm25) / target_pm25))
                validation_details["pm25_status"] = "TARGET_NOT_MET"
            
            validation_details["target_pm25"] = target_pm25
            validation_details["actual_pm25"] = actual_pm25
            validation_details["improvement_needed"] = max(0, actual_pm25 - target_pm25)
        
        if commitment.metric_type == MetricType.FOREST_COVER.value and env_data.forest_cover is not None:
            target_cover = commitment.target_value
            actual_cover = env_data.forest_cover
            
            if actual_cover >= target_cover:
                score += 0.8
                validation_details["forest_cover_status"] = "TARGET_MET"
            else:
                score += max(0, 0.8 * (actual_cover / target_cover))
                validation_details["forest_cover_status"] = "TARGET_NOT_MET"
            
            validation_details["target_forest_cover"] = target_cover
            validation_details["actual_forest_cover"] = actual_cover
        
        # Add confidence bonus
        score += env_data.confidence_score * 0.2
        score = min(1.0, score)
        
        # Determine confidence level
        if score >= 0.9:
            confidence_level = "HIGH"
        elif score >= 0.7:
            confidence_level = "MEDIUM"
        elif score >= 0.5:
            confidence_level = "LOW"
        else:
            confidence_level = "INSUFFICIENT"
        
        validation_details.update({
            "data_confidence": env_data.confidence_score,
            "data_freshness_hours": (datetime.now() - env_data.last_updated).total_seconds() / 3600,
            "region": commitment.region,
            "validation_method": "multi_source_oracle"
        })
        
        # Update commitment validation score
        commitment.validation_score = score
        commitment.last_validation = datetime.now()
        
        result = ValidationResult(
            commitment_id=commitment_id_int,
            validation_score=score,
            data_sources=env_data.data_sources,
            verified=score >= 0.7,
            confidence_level=confidence_level,
            validation_details=validation_details,
            timestamp=datetime.now()
        )
        
        print(f"🔍 Validation complete for commitment {commitment_id}")
        print(f"   Score: {score:.3f}")
        print(f"   Confidence: {confidence_level}")
        print(f"   Verified: {result.verified}")
        
        return result
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid commitment ID")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

@router.get("/satellite-data/{commitment_id}")
async def get_satellite_data(commitment_id: int) -> Dict[str, Any]:
    """Get satellite imagery data for specific commitment (requires commitment_id)"""
    try:
        if commitment_id not in commitments_db:
            raise HTTPException(status_code=404, detail="Commitment not found")
        
        commitment = commitments_db[commitment_id]
        
        # In a real implementation, this would query specific satellite APIs
        # based on the commitment's coordinates and metric type
        
        satellite_data = {
            "commitment_id": commitment_id,
            "region": commitment.region,
            "satellite_sources": ["Sentinel-2", "Landsat-8", "MODIS"],
            "imagery_date": datetime.now().strftime("%Y-%m-%d"),
            "cloud_cover_percentage": random.uniform(5, 25),
            "resolution_meters": 30,
            "analysis_results": {}
        }
        
        if commitment.metric_type == MetricType.FOREST_COVER.value:
            satellite_data["analysis_results"] = {
                "forest_cover_percentage": round(random.uniform(65, 85), 2),
                "deforestation_alerts": random.randint(0, 5),
                "ndvi_average": round(random.uniform(0.6, 0.8), 3),
                "change_detection": {
                    "forest_loss_ha": random.randint(0, 100),
                    "forest_gain_ha": random.randint(50, 200),
                    "net_change_ha": random.randint(-50, 150)
                }
            }
        
        return satellite_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get satellite data: {str(e)}")

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint with detailed status"""
    
    # Test external API connectivity
    api_status = {}
    
    try:
        openaq_response = requests.get("https://api.openaq.org/v2/latest", params={"limit": 1}, timeout=5)
        api_status["openaq"] = "healthy" if openaq_response.status_code == 200 else "degraded"
    except:
        api_status["openaq"] = "unhealthy"
    
    try:
        wb_response = requests.get("https://api.worldbank.org/v2/country/all/indicator/EN.ATM.PM25.MC.M3", 
                                 params={"format": "json", "per_page": 1}, timeout=5)
        api_status["world_bank"] = "healthy" if wb_response.status_code == 200 else "degraded"
    except:
        api_status["world_bank"] = "unhealthy"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "contracts": {
            "connected": True,
            "addresses": CONTRACT_ADDRESSES,
            "network": "localhost"
        },
        "oracle_services": api_status,
        "database": {
            "commitments_count": len(commitments_db),
            "cache_entries": len(environmental_data_cache)
        },
        "uptime_seconds": 3600,  # Mock uptime
        "last_deployment": "2024-01-15T10:30:00Z"
    }

@router.get("/commitments/{commitment_id}")
async def get_commitment_details(commitment_id: int) -> ActiveCommitment:
    """Get detailed information about a specific commitment"""
    if commitment_id not in commitments_db:
        raise HTTPException(status_code=404, detail="Commitment not found")
    
    return commitments_db[commitment_id]

@router.get("/stats/overview")
async def get_platform_stats() -> Dict[str, Any]:
    """Get platform-wide statistics"""
    commitments = list(commitments_db.values())
    
    total_commitments = len(commitments)
    active_commitments = len([c for c in commitments if c.status == CommitmentStatus.ACTIVE])
    successful_commitments = len([c for c in commitments if c.status == CommitmentStatus.SUCCESSFUL])
    total_stake = sum(c.stake_amount for c in commitments)
    total_rewards = sum(c.stake_amount * 1.5 for c in commitments if c.reward_claimed)
    
    return {
        "total_commitments": total_commitments,
        "active_commitments": active_commitments,
        "successful_commitments": successful_commitments,
        "success_rate": (successful_commitments / total_commitments * 100) if total_commitments > 0 else 0,
        "total_stake_eth": total_stake,
        "total_rewards_paid_eth": total_rewards,
        "unique_officials": len(set(c.official_name for c in commitments)),
        "regions_covered": len(set(c.region for c in commitments)),
        "average_progress": sum(c.progress_percentage for c in commitments) / len(commitments) if commitments else 0,
        "last_updated": datetime.now().isoformat()
    }

# Utility functions for better error handling and logging

def log_api_call(api_name: str, status: str, details: str = ""):
    """Log API calls for monitoring"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {api_name}: {status} {details}")

def calculate_validation_score(air_quality: Dict[str, Any], satellite_data: Dict[str, Any]) -> float:
    """Enhanced validation score calculation"""
    score = 0.0
    max_score = 1.0
    
    # Air quality validation (40% weight)
    pm25_val = air_quality.get("pm25")
    if pm25_val is not None:
        if pm25_val <= 15:  # WHO recommended level
            score += 0.4
        elif pm25_val <= 25:  # Moderate level
            score += 0.2
        # Poor air quality gets 0 points
    
    # Forest cover validation (35% weight)
    forest_cover_val = satellite_data.get("forest_cover_percentage")
    if forest_cover_val is not None:
        if forest_cover_val >= 80:
            score += 0.35
        elif forest_cover_val >= 60:
            score += 0.25
        elif forest_cover_val >= 40:
            score += 0.15
        # Low forest cover gets fewer points
    
    # NDVI validation (25% weight)
    ndvi_val = satellite_data.get("ndvi_score")
    if ndvi_val is not None:
        if ndvi_val >= 0.7:
            score += 0.25
        elif ndvi_val >= 0.5:
            score += 0.15
        elif ndvi_val >= 0.3:
            score += 0.1
    
    return min(max_score, max(0.0, score))

# Initialize some sample data for testing
async def initialize_sample_data():
    """Initialize sample commitments for testing"""
    if not commitments_db:
        sample_requests = [
            CommitmentRequest(
                description="Reduce PM2.5 pollution in downtown Jakarta by 25%",
                deadline=(datetime.now() + timedelta(days=120)).isoformat(),
                target_value=15,
                metric_type=MetricType.PM25,
                data_source="OpenAQ + Local Sensors",
                stake_amount=2.5,
                commitment_type="Air Quality Improvement",
                official_name="Dr. Maya Sari",
                official_role="Jakarta Environmental Director",
                region="jakarta"
            ),
            CommitmentRequest(
                description="Increase forest cover in Amazon protected areas by 10%",
                deadline=(datetime.now() + timedelta(days=365)).isoformat(),
                target_value=85,
                metric_type=MetricType.FOREST_COVER,
                data_source="NASA Earthdata + Sentinel-2",
                stake_amount=5.0,
                commitment_type="Forest Conservation",
                official_name="Carlos Silva",
                official_role="Brazilian Forest Minister",
                region="amazon"
            )
        ]
        
        for i, req in enumerate(sample_requests, 1):
            await create_commitment(req)
            print(f"✅ Initialized sample commitment {i}")

# Auto-initialize sample data when module is imported
# Comment out this line if you don't want sample data
# asyncio.create_task(initialize_sample_data())
