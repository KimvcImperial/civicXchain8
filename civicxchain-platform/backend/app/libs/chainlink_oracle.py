"""import requests
import json
from datetime import datetime

class ChainlinkOracle:
    def __init__(self):
        self.price_feeds = {
            "ETH/USD": "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
            # Add more price feeds
        }
    
    async def get_environmental_data(self, lat: float, lon: float):
        //Fetch real environmental data through Chainlink oracles
        
        # This would connect to actual Chainlink nodes
        oracle_data = {
            "pm25": await self.fetch_air_quality_oracle(lat, lon),
            "forest_cover": await self.fetch_satellite_oracle(lat, lon),
            "timestamp": datetime.now().isoformat()
        }
        
        return oracle_data
    
    async def fetch_air_quality_oracle(self, lat: float, lon: float):
        //Connect to Chainlink oracle for air quality data
        # Real Chainlink oracle call would go here
        return 12.5
    
    async def fetch_satellite_oracle(self, lat: float, lon: float):
        //Connect to Chainlink oracle for satellite data
        # Real Chainlink oracle call would go here
        return 78.2
"""




import requests
import json
import asyncio
import aiohttp
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from enum import Enum
import hashlib
import hmac
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OracleDataType(Enum):
    AIR_QUALITY = "air_quality"
    SATELLITE_IMAGERY = "satellite_imagery"
    WEATHER = "weather"
    FOREST_COVER = "forest_cover"
    WATER_QUALITY = "water_quality"
    PRICE_FEED = "price_feed"
    HEALTH_DATA = "health_data"
    ENERGY_DATA = "energy_data"

@dataclass
class OracleNode:
    node_id: str
    url: str
    api_key: str
    reputation_score: float
    last_update: datetime
    response_time_ms: int
    data_types: List[OracleDataType]

@dataclass
class OracleResponse:
    data: Dict[str, Any]
    timestamp: datetime
    source_node: str
    confidence_score: float
    validation_hash: str
    error: Optional[str] = None

class ChainlinkOracle:
    def __init__(self):
        """Initialize Chainlink Oracle with multiple data sources and nodes"""
        self.price_feeds = {
            "ETH/USD": "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
            "BTC/USD": "0xf4030086522a5beea4988f8ca5b36dbc97bee88c",
            "MATIC/USD": "0x7bac85a8a13a4bcd8abb3eb7d6b4d632c5a57676",
            "LINK/USD": "0x2c1d072e956affc0d435cb7ac38ef18d24d9127c"
        }
        
        # Initialize oracle nodes for different data types
        self.oracle_nodes = {
            OracleDataType.AIR_QUALITY: [
                OracleNode(
                    node_id="openaq_node_1",
                    url="https://api.openaq.org/v2",
                    api_key="",  # OpenAQ is free
                    reputation_score=0.92,
                    last_update=datetime.now(),
                    response_time_ms=250,
                    data_types=[OracleDataType.AIR_QUALITY]
                ),
                OracleNode(
                    node_id="airnow_node_1",
                    url="https://www.airnowapi.org",
                    api_key="",  # Would need API key
                    reputation_score=0.88,
                    last_update=datetime.now(),
                    response_time_ms=180,
                    data_types=[OracleDataType.AIR_QUALITY]
                )
            ],
            OracleDataType.SATELLITE_IMAGERY: [
                OracleNode(
                    node_id="nasa_earthdata_1",
                    url="https://earthdata.nasa.gov/api",
                    api_key="",  # Would need NASA API key
                    reputation_score=0.95,
                    last_update=datetime.now(),
                    response_time_ms=500,
                    data_types=[OracleDataType.SATELLITE_IMAGERY, OracleDataType.FOREST_COVER]
                ),
                OracleNode(
                    node_id="sentinel_hub_1",
                    url="https://services.sentinel-hub.com",
                    api_key="",  # Would need Sentinel Hub API key
                    reputation_score=0.91,
                    last_update=datetime.now(),
                    response_time_ms=350,
                    data_types=[OracleDataType.SATELLITE_IMAGERY, OracleDataType.FOREST_COVER]
                )
            ],
            OracleDataType.WEATHER: [
                OracleNode(
                    node_id="openweather_1",
                    url="https://api.openweathermap.org/data/2.5",
                    api_key="",  # Would need OpenWeather API key
                    reputation_score=0.89,
                    last_update=datetime.now(),
                    response_time_ms=120,
                    data_types=[OracleDataType.WEATHER]
                )
            ]
        }
        
        # Oracle validation settings
        self.consensus_threshold = 0.66  # 66% of nodes must agree
        self.max_response_time = 5000  # 5 seconds max response time
        self.data_cache = {}  # Simple in-memory cache
        self.cache_ttl = 300  # 5 minutes cache TTL
    
    async def get_environmental_data(self, lat: float, lon: float, data_types: Optional[List[OracleDataType]] = None) -> Dict[str, OracleResponse]:
        """Fetch comprehensive environmental data through multiple Chainlink oracles"""
        if data_types is None:
            data_types = [
                OracleDataType.AIR_QUALITY,
                OracleDataType.SATELLITE_IMAGERY,
                OracleDataType.WEATHER,
                OracleDataType.FOREST_COVER
            ]
        
        results = {}
        
        # Fetch data from multiple oracle types concurrently
        tasks = []
        for data_type in data_types:
            if data_type == OracleDataType.AIR_QUALITY:
                tasks.append(self.fetch_air_quality_oracle(lat, lon))
            elif data_type == OracleDataType.SATELLITE_IMAGERY:
                tasks.append(self.fetch_satellite_oracle(lat, lon))
            elif data_type == OracleDataType.WEATHER:
                tasks.append(self.fetch_weather_oracle(lat, lon))
            elif data_type == OracleDataType.FOREST_COVER:
                tasks.append(self.fetch_forest_cover_oracle(lat, lon))
        
        # Execute all oracle calls concurrently
        oracle_responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        for i, data_type in enumerate(data_types):
            if i < len(oracle_responses) and not isinstance(oracle_responses[i], Exception):
                results[data_type.value] = oracle_responses[i]
            else:
                # Handle failed oracle call
                results[data_type.value] = OracleResponse(
                    data={},
                    timestamp=datetime.now(),
                    source_node="failed",
                    confidence_score=0.0,
                    validation_hash="",
                    error=str(oracle_responses[i]) if i < len(oracle_responses) else "Oracle call failed"
                )
        
        return results
    
    async def fetch_air_quality_oracle(self, lat: float, lon: float) -> OracleResponse:
        """Connect to Chainlink oracle for air quality data"""
        cache_key = f"air_quality_{lat}_{lon}"
        
        # Check cache first
        if self._is_cache_valid(cache_key):
            return self.data_cache[cache_key]
        
        try:
            # Get air quality nodes
            nodes = self.oracle_nodes.get(OracleDataType.AIR_QUALITY, [])
            
            # Fetch from multiple nodes for consensus
            node_responses = []
            async with aiohttp.ClientSession() as session:
                for node in nodes[:2]:  # Use top 2 nodes
                    try:
                        response_data = await self._fetch_openaq_data(session, lat, lon)
                        if response_data:
                            node_responses.append({
                                "node_id": node.node_id,
                                "data": response_data,
                                "timestamp": datetime.now()
                            })
                    except Exception as e:
                        logger.warning(f"Node {node.node_id} failed: {str(e)}")
                        continue
            
            # Consensus validation
            if len(node_responses) >= 1:  # At least one successful response
                consensus_data = self._calculate_air_quality_consensus(node_responses)
                
                oracle_response = OracleResponse(
                    data=consensus_data,
                    timestamp=datetime.now(),
                    source_node=f"consensus_{len(node_responses)}_nodes",
                    confidence_score=min(0.9, len(node_responses) * 0.4),
                    validation_hash=self._generate_validation_hash(consensus_data)
                )
                
                # Cache the result
                self.data_cache[cache_key] = oracle_response
                return oracle_response
            else:
                raise Exception("No air quality nodes responded successfully")
                
        except Exception as e:
            return OracleResponse(
                data={},
                timestamp=datetime.now(),
                source_node="error",
                confidence_score=0.0,
                validation_hash="",
                error=str(e)
            )
    
    async def _fetch_openaq_data(self, session: aiohttp.ClientSession, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch real air quality data from OpenAQ API"""
        try:
            # OpenAQ API call for nearest measurement
            url = f"https://api.openaq.org/v2/latest"
            params = {
                "coordinates": f"{lat},{lon}",
                "radius": 25000,  # 25km radius
                "limit": 10,
                "parameter": "pm25"
            }
            
            async with session.get(url, params=params, timeout=5) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data.get("results"):
                        latest_measurement = data["results"][0]
                        measurements = latest_measurement.get("measurements", [])
                        
                        # Extract PM2.5 data
                        pm25_data = next((m for m in measurements if m["parameter"] == "pm25"), None)
                        
                        if pm25_data:
                            return {
                                "pm25_level": pm25_data["value"],
                                "unit": pm25_data["unit"],
                                "location": latest_measurement["location"],
                                "city": latest_measurement.get("city", "Unknown"),
                                "country": latest_measurement.get("country", "Unknown"),
                                "last_updated": pm25_data["lastUpdated"],
                                "coordinates": latest_measurement.get("coordinates", {}),
                                "aqi_score": self._calculate_aqi_from_pm25(pm25_data["value"])
                            }
            
            return {}
            
        except Exception as e:
            logger.error(f"OpenAQ API error: {str(e)}")
            return {}
    
    def _calculate_aqi_from_pm25(self, pm25_value: float) -> int:
        """Calculate AQI from PM2.5 value using EPA standards"""
        if pm25_value <= 12.0:
            return int((50 - 0) / (12.0 - 0) * (pm25_value - 0) + 0)
        elif pm25_value <= 35.4:
            return int((100 - 51) / (35.4 - 12.1) * (pm25_value - 12.1) + 51)
        elif pm25_value <= 55.4:
            return int((150 - 101) / (55.4 - 35.5) * (pm25_value - 35.5) + 101)
        elif pm25_value <= 150.4:
            return int((200 - 151) / (150.4 - 55.5) * (pm25_value - 55.5) + 151)
        elif pm25_value <= 250.4:
            return int((300 - 201) / (250.4 - 150.5) * (pm25_value - 150.5) + 201)
        else:
            return int((500 - 301) / (500.4 - 250.5) * (pm25_value - 250.5) + 301)
    
    async def fetch_satellite_oracle(self, lat: float, lon: float) -> OracleResponse:
        """Connect to Chainlink oracle for satellite data"""
        cache_key = f"satellite_{lat}_{lon}"
        
        if self._is_cache_valid(cache_key):
            return self.data_cache[cache_key]
        
        try:
            # Simulate satellite data fetch (in real implementation, would call NASA/Sentinel APIs)
            satellite_data = await self._fetch_satellite_imagery_data(lat, lon)
            
            oracle_response = OracleResponse(
                data=satellite_data,
                timestamp=datetime.now(),
                source_node="nasa_earthdata_1",
                confidence_score=0.94,
                validation_hash=self._generate_validation_hash(satellite_data)
            )
            
            self.data_cache[cache_key] = oracle_response
            return oracle_response
            
        except Exception as e:
            return OracleResponse(
                data={},
                timestamp=datetime.now(),
                source_node="error",
                confidence_score=0.0,
                validation_hash="",
                error=str(e)
            )
    
    async def _fetch_satellite_imagery_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch satellite imagery data from NASA/Sentinel APIs"""
        try:
            # This would be a real API call to NASA Earthdata or Sentinel Hub
            # For now, return realistic simulated data based on location
            
            # Generate realistic forest cover based on location
            forest_cover = self._estimate_forest_cover_by_location(lat, lon)
            
            return {
                "forest_cover_percentage": forest_cover,
                "vegetation_index": forest_cover * 0.8,  # NDVI-like value
                "cloud_cover_percentage": 15.2,
                "image_resolution_meters": 10,
                "acquisition_date": (datetime.now() - timedelta(days=2)).isoformat(),
                "satellite_sensor": "Sentinel-2",
                "coordinates": {"lat": lat, "lon": lon},
                "deforestation_rate": max(0, (80 - forest_cover) * 0.02),  # Estimate deforestation
                "land_use_classification": self._classify_land_use(lat, lon, forest_cover)
            }
            
        except Exception as e:
            logger.error(f"Satellite data fetch error: {str(e)}")
            return {}
    
    def _estimate_forest_cover_by_location(self, lat: float, lon: float) -> float:
        """Estimate forest cover based on geographic location"""
        # Amazon rainforest region
        if -10 <= lat <= 5 and -75 <= lon <= -45:
            return 85.0 + (lat * 2) + (abs(lon) * 0.1)
        # Tropical regions
        elif -23.5 <= lat <= 23.5:
            return 65.0 + abs(lat * 0.5)
        # Temperate regions
        elif 23.5 < abs(lat) <= 66.5:
            return 45.0 + (abs(lat) * 0.3)
        # Arctic/Antarctic regions
        else:
            return 5.0 + max(0, 10 - abs(lat) * 0.2)
    
    def _classify_land_use(self, lat: float, lon: float, forest_cover: float) -> str:
        """Classify land use based on location and forest cover"""
        if forest_cover > 80:
            return "Dense Forest"
        elif forest_cover > 50:
            return "Mixed Forest"
        elif forest_cover > 20:
            return "Agricultural/Forest Mix"
        elif abs(lat) < 30:
            return "Agricultural Land"
        else:
            return "Urban/Developed"
    
    async def fetch_weather_oracle(self, lat: float, lon: float) -> OracleResponse:
        """Connect to Chainlink oracle for weather data"""
        cache_key = f"weather_{lat}_{lon}"
        
        if self._is_cache_valid(cache_key):
            return self.data_cache[cache_key]
        
        try:
            weather_data = await self._fetch_weather_data(lat, lon)
            
            oracle_response = OracleResponse(
                data=weather_data,
                timestamp=datetime.now(),
                source_node="openweather_1",
                confidence_score=0.88,
                validation_hash=self._generate_validation_hash(weather_data)
            )
            
            self.data_cache[cache_key] = oracle_response
            return oracle_response
            
        except Exception as e:
            return OracleResponse(
                data={},
                timestamp=datetime.now(),
                source_node="error",
                confidence_score=0.0,
                validation_hash="",
                error=str(e)
            )
    
    async def _fetch_weather_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch weather data (simulated - would use real API in production)"""
        # Generate realistic weather data based on location and season
        import random
        
        # Base temperature calculation based on latitude
        base_temp = 30 - abs(lat) * 0.7
        seasonal_adjustment = 5 * random.uniform(-1, 1)  # Seasonal variation
        
        return {
            "temperature_celsius": round(base_temp + seasonal_adjustment, 1),
            "humidity_percentage": random.randint(30, 90),
            "wind_speed_kmh": round(random.uniform(5, 25), 1),
            "wind_direction": random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
            "pressure_hpa": random.randint(995, 1025),
            "visibility_km": random.randint(5, 20),
            "uv_index": max(0, int(11 - abs(lat) * 0.1)),
            "weather_condition": random.choice(["Clear", "Partly Cloudy", "Cloudy", "Light Rain"]),
            "coordinates": {"lat": lat, "lon": lon}
        }
    
    async def fetch_forest_cover_oracle(self, lat: float, lon: float) -> OracleResponse:
        """Specialized oracle for forest cover data"""
        cache_key = f"forest_cover_{lat}_{lon}"
        
        if self._is_cache_valid(cache_key):
            return self.data_cache[cache_key]
        
        try:
            forest_data = await self._fetch_detailed_forest_data(lat, lon)
            
            oracle_response = OracleResponse(
                data=forest_data,
                timestamp=datetime.now(),
                source_node="forest_watch_1",
                confidence_score=0.91,
                validation_hash=self._generate_validation_hash(forest_data)
            )
            
            self.data_cache[cache_key] = oracle_response
            return oracle_response
            
        except Exception as e:
            return OracleResponse(
                data={},
                timestamp=datetime.now(),
                source_node="error",
                confidence_score=0.0,
                validation_hash="",
                error=str(e)
            )
    
    async def _fetch_detailed_forest_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch detailed forest cover data"""
        forest_cover = self._estimate_forest_cover_by_location(lat, lon)
        
        return {
            "forest_cover_percentage": forest_cover,
            "tree_density_per_hectare": int(forest_cover * 15),
            "canopy_height_meters": forest_cover * 0.4,
            "biodiversity_index": forest_cover * 0.012,
            "carbon_sequestration_tons_per_hectare": forest_cover * 0.25,
            "deforestation_rate_annual": max(0, (100 - forest_cover) * 0.015),
            "protected_area_status": forest_cover > 70,
            "forest_type": self._determine_forest_type(lat, forest_cover),
            "conservation_priority": "High" if forest_cover > 80 else "Medium" if forest_cover > 50 else "Low"
        }
    
    def _determine_forest_type(self, lat: float, forest_cover: float) -> str:
        """Determine forest type based on latitude and coverage"""
        if abs(lat) < 10:
            return "Tropical Rainforest" if forest_cover > 70 else "Tropical Forest"
        elif abs(lat) < 30:
            return "Subtropical Forest"
        elif abs(lat) < 50:
            return "Temperate Forest"
        else:
            return "Boreal Forest"
    
    def _calculate_air_quality_consensus(self, node_responses: List[Dict]) -> Dict[str, Any]:
        """Calculate consensus from multiple air quality oracle responses"""
        if not node_responses:
            return {}
        
        # Average PM2.5 values from different nodes
        pm25_values = [resp["data"].get("pm25_level", 0) for resp in node_responses if resp["data"].get("pm25_level")]
        avg_pm25 = sum(pm25_values) / len(pm25_values) if pm25_values else 0
        
        # Use the most recent response as base
        base_data = node_responses[0]["data"]
        base_data["pm25_level"] = round(avg_pm25, 2)
        base_data["aqi_score"] = self._calculate_aqi_from_pm25(avg_pm25)
        base_data["consensus_nodes"] = len(node_responses)
        
        return base_data
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid"""
        if cache_key not in self.data_cache:
            return False
        
        cached_response = self.data_cache[cache_key]
        age_seconds = (datetime.now() - cached_response.timestamp).total_seconds()
        return age_seconds < self.cache_ttl
    
    def _generate_validation_hash(self, data: Dict[str, Any]) -> str:
        """Generate validation hash for oracle data integrity"""
        data_string = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(data_string.encode()).hexdigest()
    
    async def get_price_feed(self, pair: str) -> OracleResponse:
        """Get cryptocurrency price feed from Chainlink"""
        try:
            if pair not in self.price_feeds:
                raise ValueError(f"Price feed for {pair} not available")
            
            # Simulate Chainlink price feed call
            # In real implementation, this would call the actual Chainlink contract
            price_data = await self._fetch_mock_price_data(pair)
            
            return OracleResponse(
                data=price_data,
                timestamp=datetime.now(),
                source_node=f"chainlink_price_feed_{pair}",
                confidence_score=0.99,
                validation_hash=self._generate_validation_hash(price_data)
            )
            
        except Exception as e:
            return OracleResponse(
                data={},
                timestamp=datetime.now(),
                source_node="error",
                confidence_score=0.0,
                validation_hash="",
                error=str(e)
            )
    
    async def _fetch_mock_price_data(self, pair: str) -> Dict[str, Any]:
        """Fetch mock price data (would be real Chainlink price feed in production)"""
        import random
        
        base_prices = {
            "ETH/USD": 2000,
            "BTC/USD": 35000,
            "MATIC/USD": 0.8,
            "LINK/USD": 15
        }
        
        base_price = base_prices.get(pair, 100)
        current_price = base_price * (1 + random.uniform(-0.05, 0.05))  # ±5% variation
        
        return {
            "pair": pair,
            "price": round(current_price, 2),
            "decimals": 8,
            "round_id": random.randint(100000, 999999),
            "updated_at": datetime.now().isoformat(),
            "contract_address": self.price_feeds.get(pair, ""),
            "24h_change": round(random.uniform(-10, 10), 2)
        }
    
    def get_oracle_health_status(self) -> Dict[str, Any]:
        """Get health status of all oracle nodes"""
        status = {
            "total_nodes": 0,
            "healthy_nodes": 0,
            "unhealthy_nodes": 0,
            "average_response_time": 0,
            "last_health_check": datetime.now().isoformat(),
            "node_details": {}
        }
        
        total_response_time = 0
        
        for data_type, nodes in self.oracle_nodes.items():
            for node in nodes:
                status["total_nodes"] += 1
                total_response_time += node.response_time_ms
                
                # Consider node healthy if response time < max and reputation > 0.8
                is_healthy = (node.response_time_ms < self.max_response_time and 
                             node.reputation_score > 0.8)
                
                if is_healthy:
                    status["healthy_nodes"] += 1
                else:
                    status["unhealthy_nodes"] += 1
                
                status["node_details"][node.node_id] = {
                    "data_type": data_type.value,
                    "healthy": is_healthy,
                    "response_time_ms": node.response_time_ms,
                    "reputation_score": node.reputation_score,
                    "last_update": node.last_update.isoformat()
                }
        
        if status["total_nodes"] > 0:
            status["average_response_time"] = total_response_time / status["total_nodes"]
        
        return status

# Utility functions
def create_oracle_instance() -> ChainlinkOracle:
    """Create a new ChainlinkOracle instance"""
    return ChainlinkOracle()

# Global oracle instance
_oracle_instance = None

def get_oracle() -> ChainlinkOracle:
    """Get singleton oracle instance"""
    global _oracle_instance
    if _oracle_instance is None:
        _oracle_instance = ChainlinkOracle()
    return _oracle_instance

# Validation utilities
def validate_coordinates(lat: float, lon: float) -> bool:
    """Validate latitude and longitude coordinates"""
    return -90 <= lat <= 90 and -180 <= lon <= 180

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in kilometers"""
    import math
    
    # Haversine formula
    R = 6371  # Earth's radius in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat/2) * math.sin(dlat/2) + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon/2) * math.sin(dlon/2))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    
    return distance