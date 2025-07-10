import requests
import asyncio
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class EnvironmentalDataRequest(BaseModel):
    location: str
    parameter: str = "pm25"

class AirQualityResponse(BaseModel):
    location: str
    parameter: str
    value: float
    unit: str
    timestamp: str

@router.get("/air-quality/{location}")
async def get_air_quality(location: str):
    """Fetch real PM2.5 data from OpenAQ"""
    try:
        url = f"https://api.openaq.org/v2/latest"
        params = {
            "location": location,
            "parameter": "pm25",
            "limit": 1
        }
        response = requests.get(url, params=params)
        data = response.json()
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/forest-cover/{lat}/{lon}")
async def get_forest_cover(lat: float, lon: float):
    """Fetch forest cover data"""
    # For now, return simulated data
    # You can integrate with NASA Earthdata later
    return {
        "coordinates": {"lat": lat, "lon": lon},
        "forest_cover_percentage": 75.5,
        "change_since_last_year": -2.3,
        "status": "decreasing"
    }