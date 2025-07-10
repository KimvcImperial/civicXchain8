from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

router = APIRouter()

class SatelliteDataResponse(BaseModel):
    coordinates: dict
    deforestation_rate: float
    vegetation_index: float
    last_updated: str

@router.get("/satellite-imagery/{commitment_id}")
async def get_satellite_data(commitment_id: str):
    """Fetch satellite imagery data for deforestation monitoring"""
    # Simulated NASA/ESA satellite data
    return {
        "commitment_id": commitment_id,
        "deforestation_rate": round(random.uniform(0.1, 5.0), 2),
        "vegetation_index": round(random.uniform(0.3, 0.8), 2),
        "forest_cover_change": round(random.uniform(-3.0, 1.0), 2),
        "last_updated": datetime.now().isoformat(),
        "data_source": "Landsat-8/Sentinel-2"
    }