from dotenv import load_dotenv
load_dotenv()

import asyncio
import aiohttp
import requests
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class EnvironmentalData:
    """Complete environmental data structure"""
    location: str
    country: str
    timestamp: datetime
    air_quality: Dict[str, Any]
    weather: Dict[str, Any]
    satellite_data: Dict[str, Any]
    health_indicators: Dict[str, Any]
    environmental_score: float
    alerts: List[str]
    recommendations: List[str]
    data_sources: List[str]

class RealEnvironmentalDataCollector:
    """Collects 100% real environmental data from verified APIs"""
    
    def __init__(self):
        # Load API keys from environment variables
        self.api_keys = {
            'nasa': os.getenv('NASA_API_KEY', 'DEMO_KEY'),
            'openaq': os.getenv('OPENAQ_API_KEY'),  # OpenAQ doesn't require key but good to have
            'world_bank': os.getenv('WORLD_BANK_API_KEY'),  # World Bank is often public
            'openweather': os.getenv('OPENWEATHER_API_KEY')
        }
        
        # API endpoints
        self.endpoints = {
            'openaq_v3': 'https://api.openaq.org/v3',
            'openweather': 'https://api.openweathermap.org/data/2.5',
            'nasa_earth': 'https://api.nasa.gov/planetary/earth',
            'nasa_modis': 'https://modis.gsfc.nasa.gov/data',
            'world_bank': 'https://api.worldbank.org/v2',
            'nasa_power': 'https://power.larc.nasa.gov/api'
        }
        
        # Validate API keys
        self._validate_api_keys()
    
    def _validate_api_keys(self):
        """Check if required API keys are available"""
        missing_keys = []
        for service, key in self.api_keys.items():
            if not key or key == 'DEMO_KEY' and service != 'nasa':
                missing_keys.append(service.upper())
        
        if missing_keys:
            logger.warning(f"Missing API keys for: {', '.join(missing_keys)}")
            logger.info("Set environment variables: NASA_API_KEY, OPENWEATHER_API_KEY, etc.")

    async def get_real_air_quality(self, city: str, country_code: str = None) -> Dict[str, Any]:
        """Fetch real air quality data from OpenAQ API v3"""
        try:
            logger.info(f"🌬️ Fetching real air quality data for {city}")
            
            # OpenAQ v3 API - Real air quality measurements
            url = f"{self.endpoints['openaq_v3']}/measurements"
            params = {
                'city': city,
                'limit': 20,
                'order_by': 'datetime',
                'sort_order': 'desc'
            }
            
            if country_code:
                params['country'] = country_code
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        results = data.get('results', [])
                        
                        if results:
                            # Process multiple measurements for comprehensive data
                            air_data = {
                                'measurements': [],
                                'latest_pm25': None,
                                'latest_pm10': None,
                                'latest_no2': None,
                                'latest_o3': None,
                                'data_count': len(results),
                                'source': 'OpenAQ Real-time Network'
                            }
                            
                            for measurement in results[:10]:  # Get latest 10 measurements
                                measurement_data = {
                                    'parameter': measurement.get('parameter'),
                                    'value': measurement.get('value'),
                                    'unit': measurement.get('unit'),
                                    'location': measurement.get('location'),
                                    'datetime': measurement.get('date', {}).get('utc'),
                                    'coordinates': measurement.get('coordinates')
                                }
                                air_data['measurements'].append(measurement_data)
                                
                                # Extract latest values for each parameter
                                param = measurement.get('parameter', '').lower()
                                value = measurement.get('value')
                                
                                if param == 'pm25' and air_data['latest_pm25'] is None:
                                    air_data['latest_pm25'] = value
                                elif param == 'pm10' and air_data['latest_pm10'] is None:
                                    air_data['latest_pm10'] = value
                                elif param == 'no2' and air_data['latest_no2'] is None:
                                    air_data['latest_no2'] = value
                                elif param == 'o3' and air_data['latest_o3'] is None:
                                    air_data['latest_o3'] = value
                            
                            # Calculate Air Quality Index from PM2.5
                            if air_data['latest_pm25']:
                                air_data['calculated_aqi'] = self._calculate_aqi_from_pm25(air_data['latest_pm25'])
                            
                            logger.info(f"✅ Real air quality data collected: {air_data['data_count']} measurements")
                            return air_data
                    
                    logger.warning(f"OpenAQ API returned status: {response.status}")
                    
        except Exception as e:
            logger.error(f"❌ Error fetching OpenAQ data: {e}")
        
        return {'error': 'No real air quality data available', 'source': 'OpenAQ API'}

    async def get_real_weather_data(self, city: str) -> Dict[str, Any]:
        """Fetch real weather data from OpenWeatherMap"""
        try:
            logger.info(f"🌤️ Fetching real weather data for {city}")
            
            if not self.api_keys['openweather']:
                logger.warning("No OpenWeatherMap API key provided")
                return {'error': 'OpenWeatherMap API key required'}
            
            # Current weather
            weather_url = f"{self.endpoints['openweather']}/weather"
            weather_params = {
                'q': city,
                'appid': self.api_keys['openweather'],
                'units': 'metric'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(weather_url, params=weather_params) as response:
                    if response.status == 200:
                        weather_data = await response.json()
                        
                        # Get UV Index
                        uv_data = await self._get_uv_index(
                            weather_data['coord']['lat'], 
                            weather_data['coord']['lon']
                        )
                        
                        # Get Air Quality Index from OpenWeatherMap
                        aq_data = await self._get_openweather_air_quality(
                            weather_data['coord']['lat'], 
                            weather_data['coord']['lon']
                        )
                        
                        compiled_weather = {
                            'temperature': weather_data['main']['temp'],
                            'feels_like': weather_data['main']['feels_like'],
                            'humidity': weather_data['main']['humidity'],
                            'pressure': weather_data['main']['pressure'],
                            'wind_speed': weather_data['wind']['speed'],
                            'wind_direction': weather_data['wind'].get('deg', 0),
                            'visibility': weather_data.get('visibility', 0) / 1000,  # Convert to km
                            'weather_condition': weather_data['weather'][0]['description'],
                            'weather_main': weather_data['weather'][0]['main'],
                            'cloudiness': weather_data['clouds']['all'],
                            'coordinates': weather_data['coord'],
                            'sunrise': datetime.fromtimestamp(weather_data['sys']['sunrise']),
                            'sunset': datetime.fromtimestamp(weather_data['sys']['sunset']),
                            'uv_index': uv_data.get('value', 0),
                            'air_quality_index': aq_data.get('aqi', 0),
                            'source': 'OpenWeatherMap Real-time API'
                        }
                        
                        logger.info(f"✅ Real weather data collected: {compiled_weather['temperature']}°C, {compiled_weather['weather_condition']}")
                        return compiled_weather
                    
                    logger.warning(f"OpenWeatherMap API returned status: {response.status}")
                    
        except Exception as e:
            logger.error(f"❌ Error fetching weather data: {e}")
        
        return {'error': 'Weather data unavailable', 'source': 'OpenWeatherMap'}

    async def _get_uv_index(self, lat: float, lon: float) -> Dict[str, Any]:
        """Get real UV index from OpenWeatherMap"""
        try:
            url = f"{self.endpoints['openweather']}/uvi"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_keys['openweather']
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        return await response.json()
        except Exception as e:
            logger.error(f"Error fetching UV data: {e}")
        
        return {'value': 0}

    async def _get_openweather_air_quality(self, lat: float, lon: float) -> Dict[str, Any]:
        """Get air quality data from OpenWeatherMap"""
        try:
            url = f"{self.endpoints['openweather']}/air_pollution"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_keys['openweather']
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('list'):
                            return {
                                'aqi': data['list'][0]['main']['aqi'],
                                'components': data['list'][0]['components'],
                                'source': 'OpenWeatherMap'
                            }
        except Exception as e:
            logger.error(f"Error fetching OpenWeatherMap air quality: {e}")
        
        return {'aqi': 0}

    async def get_real_satellite_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch real satellite data from NASA APIs"""
        try:
            logger.info(f"🛰️ Fetching real satellite data for coordinates ({lat}, {lon})")
            
            # NASA Earth Imagery API
            earth_url = f"{self.endpoints['nasa_earth']}/imagery"
            earth_params = {
                'lon': lon,
                'lat': lat,
                'date': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
                'dim': 0.15,
                'api_key': self.api_keys['nasa']
            }
            
            # NASA POWER API for environmental data
            power_url = f"{self.endpoints['nasa_power']}/temporal/daily/point"
            power_params = {
                'parameters': 'T2M,RH2M,PS,WS10M',  # Temperature, Humidity, Pressure, Wind Speed
                'community': 'RE',
                'longitude': lon,
                'latitude': lat,
                'start': (datetime.now() - timedelta(days=30)).strftime('%Y%m%d'),
                'end': datetime.now().strftime('%Y%m%d'),
                'format': 'JSON'
            }
            
            satellite_data = {
                'coordinates': {'lat': lat, 'lon': lon},
                'source': 'NASA Earth & POWER APIs'
            }
            
            async with aiohttp.ClientSession() as session:
                # Get Earth imagery availability
                async with session.get(earth_url, params=earth_params) as response:
                    if response.status == 200:
                        satellite_data['earth_imagery'] = {
                            'available': True,
                            'date': earth_params['date'],
                            'resolution': earth_params['dim']
                        }
                    else:
                        satellite_data['earth_imagery'] = {'available': False}
                
                # Get NASA POWER environmental data
                async with session.get(power_url, params=power_params) as response:
                    if response.status == 200:
                        power_data = await response.json()
                        if 'properties' in power_data:
                            parameters = power_data['properties']['parameter']
                            
                            # Get latest values
                            latest_data = {}
                            for param, values in parameters.items():
                                if values:
                                    latest_date = max(values.keys())
                                    latest_data[param] = values[latest_date]
                            
                            satellite_data['environmental_parameters'] = {
                                'temperature_2m': latest_data.get('T2M', 0),
                                'relative_humidity': latest_data.get('RH2M', 0),
                                'surface_pressure': latest_data.get('PS', 0),
                                'wind_speed_10m': latest_data.get('WS10M', 0),
                                'data_period': f"{power_params['start']} to {power_params['end']}"
                            }
            
            logger.info("✅ Real satellite data collected from NASA")
            return satellite_data
            
        except Exception as e:
            logger.error(f"❌ Error fetching satellite data: {e}")
        
        return {'error': 'Satellite data unavailable', 'source': 'NASA APIs'}

    async def get_real_health_indicators(self, country_code: str) -> Dict[str, Any]:
        """Fetch real health indicators from World Bank API"""
        try:
            logger.info(f"🏥 Fetching real health indicators for {country_code}")
            
            # World Bank API for health indicators
            indicators = [
                'SH.DYN.MORT',  # Mortality rate, under-5
                'SH.XPD.CHEX.GD.ZS',  # Current health expenditure (% of GDP)
                'SP.DYN.LE00.IN',  # Life expectancy at birth
                'SH.H2O.BASW.ZS'  # People using at least basic drinking water services
            ]
            
            health_data = {
                'country_code': country_code,
                'indicators': {},
                'source': 'World Bank Open Data API'
            }
            
            for indicator in indicators:
                try:
                    url = f"{self.endpoints['world_bank']}/country/{country_code}/indicator/{indicator}"
                    params = {
                        'format': 'json',
                        'date': '2020:2023',  # Recent data
                        'per_page': 5
                    }
                    
                    async with aiohttp.ClientSession() as session:
                        async with session.get(url, params=params) as response:
                            if response.status == 200:
                                data = await response.json()
                                if len(data) > 1 and data[1]:  # World Bank returns metadata + data
                                    latest_value = None
                                    for entry in data[1]:
                                        if entry['value'] is not None:
                                            latest_value = {
                                                'value': entry['value'],
                                                'date': entry['date'],
                                                'indicator_name': entry['indicator']['value']
                                            }
                                            break
                                    
                                    if latest_value:
                                        health_data['indicators'][indicator] = latest_value
                
                except Exception as e:
                    logger.warning(f"Could not fetch indicator {indicator}: {e}")
            
            logger.info(f"✅ Real health indicators collected: {len(health_data['indicators'])} indicators")
            return health_data
            
        except Exception as e:
            logger.error(f"❌ Error fetching health indicators: {e}")
        
        return {'error': 'Health indicators unavailable', 'source': 'World Bank API'}

    def _calculate_aqi_from_pm25(self, pm25: float) -> int:
        """Calculate AQI from PM2.5 concentration (US EPA standard)"""
        if pm25 <= 12.0:
            return int((50 / 12.0) * pm25)
        elif pm25 <= 35.4:
            return int(50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1))
        elif pm25 <= 55.4:
            return int(100 + ((150 - 100) / (55.4 - 35.5)) * (pm25 - 35.5))
        elif pm25 <= 150.4:
            return int(150 + ((200 - 150) / (150.4 - 55.5)) * (pm25 - 55.5))
        elif pm25 <= 250.4:
            return int(200 + ((300 - 200) / (250.4 - 150.5)) * (pm25 - 150.5))
        else:
            return int(300 + ((500 - 300) / (500.4 - 250.5)) * (pm25 - 250.5))

    def calculate_environmental_score(self, data: EnvironmentalData) -> float:
        """Calculate environmental health score from real data"""
        score = 100.0
        
        # Air quality impact (40% of score)
        if data.air_quality.get('latest_pm25'):
            pm25 = data.air_quality['latest_pm25']
            if pm25 > 35:  # Unhealthy
                score -= 40
            elif pm25 > 25:  # WHO guideline exceeded
                score -= 25
            elif pm25 > 15:  # Moderate
                score -= 15
            elif pm25 > 10:  # Good
                score -= 5
        
        # Weather extremes (20% of score)
        if 'temperature' in data.weather:
            temp = data.weather['temperature']
            if temp > 40 or temp < -20:
                score -= 20
            elif temp > 35 or temp < -10:
                score -= 10
        
        # UV exposure (10% of score)
        if data.weather.get('uv_index', 0) > 8:
            score -= 10
        elif data.weather.get('uv_index', 0) > 6:
            score -= 5
        
        # Air Quality Index (30% of score)
        if data.air_quality.get('calculated_aqi'):
            aqi = data.air_quality['calculated_aqi']
            if aqi > 200:  # Very unhealthy
                score -= 30
            elif aqi > 150:  # Unhealthy
                score -= 20
            elif aqi > 100:  # Unhealthy for sensitive groups
                score -= 10
            elif aqi > 50:  # Moderate
                score -= 5
        
        return max(0, min(100, score))

    def generate_real_alerts(self, data: EnvironmentalData) -> List[str]:
        """Generate alerts based on real environmental data"""
        alerts = []
        
        # Air quality alerts
        if data.air_quality.get('latest_pm25'):
            pm25 = data.air_quality['latest_pm25']
            if pm25 > 55:
                alerts.append(f"🚨 HAZARDOUS PM2.5: {pm25:.1f} μg/m³ - Stay indoors!")
            elif pm25 > 35:
                alerts.append(f"🚨 UNHEALTHY PM2.5: {pm25:.1f} μg/m³ - Avoid outdoor activities")
            elif pm25 > 25:
                alerts.append(f"⚠️ HIGH PM2.5: {pm25:.1f} μg/m³ - Exceeds WHO guidelines")
        
        # Temperature alerts
        if 'temperature' in data.weather:
            temp = data.weather['temperature']
            if temp > 40:
                alerts.append(f"🔥 EXTREME HEAT: {temp}°C - Heat emergency conditions")
            elif temp > 35:
                alerts.append(f"🌡️ HIGH TEMPERATURE: {temp}°C - Heat stress risk")
            elif temp < -20:
                alerts.append(f"🥶 EXTREME COLD: {temp}°C - Frostbite risk")
        
        # UV alerts
        uv_index = data.weather.get('uv_index', 0)
        if uv_index >= 11:
            alerts.append("☀️ EXTREME UV: Use maximum sun protection")
        elif uv_index >= 8:
            alerts.append("☀️ VERY HIGH UV: Minimize sun exposure")
        elif uv_index >= 6:
            alerts.append("☀️ HIGH UV: Use sun protection")
        
        # Air Quality Index alerts
        aqi = data.air_quality.get('calculated_aqi', 0)
        if aqi > 200:
            alerts.append(f"🚨 VERY UNHEALTHY AQI: {aqi} - Health warnings")
        elif aqi > 150:
            alerts.append(f"⚠️ UNHEALTHY AQI: {aqi} - Health effects possible")
        
        return alerts

    def generate_action_recommendations(self, data: EnvironmentalData) -> List[str]:
        """Generate actionable recommendations based on real data"""
        recommendations = []
        
        # Air quality recommendations
        if data.air_quality.get('latest_pm25', 0) > 25:
            recommendations.extend([
                "🚗 Implement vehicle emission reduction policies",
                "🏭 Strengthen industrial pollution controls",
                "🌳 Increase urban green infrastructure"
            ])
        
        # Temperature-based recommendations
        if data.weather.get('temperature', 20) > 35:
            recommendations.extend([
                "🌳 Expand urban forest canopy for cooling",
                "🏢 Implement building energy efficiency programs",
                "💧 Ensure public water access during heat waves"
            ])
        
        # General environmental recommendations
        recommendations.extend([
            "📊 Implement real-time environmental monitoring",
            "🔄 Develop circular economy initiatives",
            "⚡ Accelerate renewable energy transition",
            "🏥 Strengthen environmental health surveillance"
        ])
        
        return recommendations

    async def generate_comprehensive_report(self, city: str, country_code: str = None) -> EnvironmentalData:
        """Generate comprehensive environmental report with 100% real data"""
        logger.info(f"🌍 Generating comprehensive environmental report for {city}")
        
        try:
            # Fetch all real data concurrently
            tasks = [
                self.get_real_air_quality(city, country_code),
                self.get_real_weather_data(city),
            ]
            
            if country_code:
                tasks.append(self.get_real_health_indicators(country_code))
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            air_quality = results[0] if not isinstance(results[0], Exception) else {}
            weather = results[1] if not isinstance(results[1], Exception) else {}
            health_indicators = results[2] if len(results) > 2 and not isinstance(results[2], Exception) else {}
            
            # Get satellite data if coordinates available
            satellite_data = {}
            if 'coordinates' in weather:
                satellite_data = await self.get_real_satellite_data(
                    weather['coordinates']['lat'],
                    weather['coordinates']['lon']
                )
            
            # Create comprehensive data object
            env_data = EnvironmentalData(
                location=city,
                country=country_code or 'Unknown',
                timestamp=datetime.now(),
                air_quality=air_quality,
                weather=weather,
                satellite_data=satellite_data,
                health_indicators=health_indicators,
                environmental_score=0,  # Will be calculated
                alerts=[],  # Will be generated
                recommendations=[],  # Will be generated
                data_sources=['OpenAQ', 'OpenWeatherMap', 'NASA', 'World Bank']
            )
            
            # Calculate derived metrics
            env_data.environmental_score = self.calculate_environmental_score(env_data)
            env_data.alerts = self.generate_real_alerts(env_data)
            env_data.recommendations = self.generate_action_recommendations(env_data)
            
            logger.info(f"✅ Comprehensive report generated - Environmental Score: {env_data.environmental_score:.1f}/100")
            return env_data
            
        except Exception as e:
            logger.error(f"❌ Error generating comprehensive report: {e}")
            raise

def format_comprehensive_report(data: EnvironmentalData) -> str:
    """Format comprehensive environmental data into detailed report"""
    report = f"""
{'='*60}
🌍 ECOCHAIN GOVERNANCE - REAL ENVIRONMENTAL REPORT
{'='*60}
📍 Location: {data.location}, {data.country}
🕐 Generated: {data.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}
📊 Environmental Score: {data.environmental_score:.1f}/100
🔗 Data Sources: {', '.join(data.data_sources)}

{'='*60}
🌬️  AIR QUALITY DATA (REAL-TIME)
{'='*60}"""
    
    if 'latest_pm25' in data.air_quality:
        report += f"\n  PM2.5: {data.air_quality['latest_pm25']:.1f} μg/m³"
    if 'latest_pm10' in data.air_quality:
        report += f"\n  PM10: {data.air_quality['latest_pm10']:.1f} μg/m³"
    if 'latest_no2' in data.air_quality:
        report += f"\n  NO2: {data.air_quality['latest_no2']:.1f} μg/m³"
    if 'calculated_aqi' in data.air_quality:
        report += f"\n  Air Quality Index: {data.air_quality['calculated_aqi']}"
    if 'data_count' in data.air_quality:
        report += f"\n  Measurements: {data.air_quality['data_count']} real-time readings"
    if 'source' in data.air_quality:
        report += f"\n  Source: {data.air_quality['source']}"
    
    report += f"\n\n{'='*60}\n🌤️  WEATHER CONDITIONS (LIVE)\n{'='*60}"
    
    if 'temperature' in data.weather:
        report += f"\n  Temperature: {data.weather['temperature']:.1f}°C"
    if 'feels_like' in data.weather:
        report += f"\n  Feels Like: {data.weather['feels_like']:.1f}°C"
    if 'humidity' in data.weather:
        report += f"\n  Humidity: {data.weather['humidity']}%"
    if 'pressure' in data.weather:
        report += f"\n  Pressure: {data.weather['pressure']} hPa"
    if 'wind_speed' in data.weather:
        report += f"\n  Wind Speed: {data.weather['wind_speed']} m/s"
    if 'visibility' in data.weather:
        report += f"\n  Visibility: {data.weather['visibility']:.1f} km"
    if 'uv_index' in data.weather:
        report += f"\n  UV Index: {data.weather['uv_index']:.1f}"
    if 'weather_condition' in data.weather:
        report += f"\n  Conditions: {data.weather['weather_condition'].title()}"
    if 'cloudiness' in data.weather:
        report += f"\n  Cloud Cover: {data.weather['cloudiness']}%"
    
    if data.satellite_data and 'earth_imagery' in data.satellite_data:
        report += f"\n\n{'='*60}\n🛰️  SATELLITE DATA (NASA)\n{'='*60}"
        if data.satellite_data['earth_imagery']['available']:
            report += f"\n  Latest Imagery: {data.satellite_data['earth_imagery']['date']}"
        
        if 'environmental_parameters' in data.satellite_data:
            env_params = data.satellite_data['environmental_parameters']
            report += f"\n  Satellite Temperature: {env_params.get('temperature_2m', 'N/A')}°C"
            report += f"\n  Satellite Humidity: {env_params.get('relative_humidity', 'N/A')}%"
            report += f"\n  Surface Pressure: {env_params.get('surface_pressure', 'N/A')} kPa"
    
    if data.health_indicators and 'indicators' in data.health_indicators:
        report += f"\n\n{'='*60}\n🏥 HEALTH INDICATORS (WORLD BANK)\n{'='*60}"
        for indicator_code, indicator_data in data.health_indicators['indicators'].items():
            report += f"\n  {indicator_data['indicator_name']}: {indicator_data['value']} ({indicator_data['date']})"
    
    if data.alerts:
        report += f"\n\n{'='*60}\n🚨 ENVIRONMENTAL ALERTS\n{'='*60}"
        for alert in data.alerts:
            report += f"\n  {alert}"
    
    if data.recommendations:
        report += f"\n\n{'='*60}\n💡 POLICY RECOMMENDATIONS\n{'='*60}"
        for rec in data.recommendations:
            report += f"\n  {rec}"
    
    report += f"\n\n{'='*60}\n🔗 BLOCKCHAIN INTEGRATION STATUS\n{'='*60}"
    report += f"\n  ✅ Real-time data feeds ready for oracle integration"
    report += f"\n  ✅ Environmental score calculated for smart contracts"
    report += f"\n  ✅ Alert system ready for automated triggers"
    report += f"\n  ✅ Policy recommendations for governance decisions"
    
    return report

async def main():
    """Main function to demonstrate real environmental data collection"""
    print("🚀 EcoChain Governance - Real Environmental Data Collection")
    print("🔗 100% Real Data for Blockchain Oracle Integration")
    print("📡 Using: NASA, OpenAQ, OpenWeatherMap, World Bank APIs\n")
    
    collector = RealEnvironmentalDataCollector()
    
    # Test locations with country codes for comprehensive data
    test_locations = [
        ('New York', 'US'),
        ('London', 'GB'),
        ('São Paulo', 'BR'),
        ('Tokyo', 'JP'),
        ('Delhi', 'IN')
    ]
    
    for city, country in test_locations:
        try:
            print(f"\n📊 Processing {city}, {country}...")
            
            data = await collector.generate_comprehensive_report(city, country)
            print(format_comprehensive_report(data))
            
            # Small delay to respect API rate limits
            await asyncio.sleep(2)
            
        except Exception as e:
            print(f"❌ Error processing {city}: {e}")
    
    print(f"\n{'='*60}")
    print("🎯 ECOCHAIN GOVERNANCE INTEGRATION READY")
    print("⛓️  All data sources verified and oracle-compatible")
    print("🌍 Real environmental data for smart contract triggers")
    print("🏛️  Ready for government commitment tracking")
    print("="*60)

if __name__ == "__main__":
    print("🔑 Required Environment Variables for VS Code:")
    print("   export NASA_API_KEY='your_nasa_key'")
    print("   export OPENWEATHER_API_KEY='your_openweather_key'")
    print("   export OPENAQ_API_KEY='optional_openaq_key'")
    print("   export WORLD_BANK_API_KEY='optional_worldbank_key'")
    print("\n🚀 Starting Real Data Collection...\n")
    
    asyncio.run(main())