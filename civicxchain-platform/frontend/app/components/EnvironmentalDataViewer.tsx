import React, { useState, useEffect } from 'react';
import brain from '../brain';

interface EnvironmentalData {
  air_quality: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
    status: string;
    aqi: number;
    location: string;
    timestamp: string;
  };
  forest_cover: {
    percentage: number;
    change: number;
    status: string;
    area_km2: number;
    deforestation_rate: number;
    last_updated: string;
  };
  water_quality: {
    score: number;
    status: string;
    ph: number;
    dissolved_oxygen: number;
    turbidity: number;
    temperature: number;
    contaminants: string[];
    location: string;
  };
  satellite_verification: {
    last_update: string;
    confidence: number;
    status: string;
    source: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  weather: {
    temperature: number;
    humidity: number;
    pressure: number;
    visibility: number;
    wind_speed: number;
    wind_direction: number;
  };
}

interface EnvironmentalDataViewerProps {
  commitmentId: string;
}

export default function EnvironmentalDataViewer({ commitmentId }: EnvironmentalDataViewerProps) {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchEnvironmentalData();
    const interval = setInterval(fetchEnvironmentalData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [commitmentId]);

  const fetchEnvironmentalData = async () => {
    try {
      setLoading(true);
      setError(null);

      const lat = 40.7128;
      const lng = -74.0060;
  

      // Fetch comprehensive environmental report
      const response = await brain.get_comprehensive_environmental_report();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to fetch environmental data: ${response.status}`);
      }

      // Fetch additional specific data sources
      const [airQualityResponse, satelliteResponse, weatherResponse] = await Promise.all([
        brain.get_air_quality_data().catch(err => ({ json: () => null })),
        brain.get_satellite_imagery({lat, lng}).catch(err => ({ json: () => null })),
        brain.get_weather_data({lat, lng}).catch(err => ({ json: () => null }))
      ]);

      const airQualityData = airQualityResponse ? await airQualityResponse.json() : null;
      const satelliteData = satelliteResponse ? await satelliteResponse.json() : null;
      const weatherData = weatherResponse ? await weatherResponse.json() : null;

      // Combine all data sources
      const combinedData: EnvironmentalData = {
        air_quality: {
          pm25: airQualityData?.[0]?.pm25 || (data as any)?.air_quality?.pm25 || 0,
          pm10: airQualityData?.[0]?.pm10 || (data as any)?.air_quality?.pm10 || 0,
          o3: airQualityData?.[0]?.o3 || (data as any)?.air_quality?.o3 || 0,
          no2: airQualityData?.[0]?.no2 || (data as any)?.air_quality?.no2 || 0,
          so2: airQualityData?.[0]?.so2 || (data as any)?.air_quality?.so2 || 0,
          co: airQualityData?.[0]?.co || (data as any)?.air_quality?.co || 0,
          status: calculateAirQualityStatus(airQualityData?.[0]?.pm25 || (data as any)?.air_quality?.pm25 || 0),
          aqi: airQualityData?.[0]?.air_quality_index || (data as any)?.air_quality?.aqi || 0,
          location: airQualityData?.[0]?.location || (data as any)?.air_quality?.location || 'Unknown',
          timestamp: airQualityData?.[0]?.last_updated || new Date().toISOString()
        },
        forest_cover: {
          percentage: (satelliteData as any)?.forest_coverage || (data as any)?.forest_cover?.percentage || 0,
          change: (satelliteData as any)?.forest_change || (data as any)?.forest_cover?.change || 0,
          status: (satelliteData as any)?.forest_change >= 0 ? 'stable' : 'declining',
          area_km2: (satelliteData as any)?.forest_area || (data as any)?.forest_cover?.area_km2 || 0,
          deforestation_rate: Math.abs((satelliteData as any)?.forest_change ?? 0),
          last_updated: (satelliteData as any)?.timestamp || new Date().toISOString()
        },
        water_quality: {
          score: (data as any)?.water_quality?.score || calculateWaterQualityScore((data as any)?.water_quality),
          status: (data as any)?.water_quality?.status || 'Unknown',
          ph: (data as any)?.water_quality?.ph || 7.0,
          dissolved_oxygen: (data as any)?.water_quality?.dissolved_oxygen || 0,
          turbidity: (data as any)?.water_quality?.turbidity || 0,
          temperature: (data as any)?.water_quality?.temperature || 0,
          contaminants: (data as any)?.water_quality?.contaminants || [],
          location: (data as any)?.water_quality?.location || 'Unknown'
        },
        satellite_verification: {
          last_update: (satelliteData as any)?.timestamp || new Date().toISOString(),
          confidence: (satelliteData as any)?.confidence || (data as any)?.satellite_verification?.confidence || 0,
          status: (satelliteData as any)?.status || (data as any)?.satellite_verification?.status || 'pending',
          source: (satelliteData as any)?.source || 'Multiple Sources',
          coordinates: {
            lat: (satelliteData as any)?.coordinates?.lat || (data as any)?.coordinates?.lat || 0,
            lng: (satelliteData as any)?.coordinates?.lng || (data as any)?.coordinates?.lng || 0
          }
        },
        weather: {
          temperature: weatherData?.temperature || (data as any)?.weather?.temperature || 0,
          humidity: weatherData?.humidity || (data as any)?.weather?.humidity || 0,
          pressure: weatherData?.pressure || (data as any)?.weather?.pressure || 0,
          visibility: weatherData?.visibility || (data as any)?.weather?.visibility || 0,
          wind_speed: weatherData?.wind_speed || (data as any)?.weather?.wind_speed || 0,
          wind_direction: weatherData?.wind_direction || (data as any)?.weather?.wind_direction || 0
        }
      };

      setEnvironmentalData(combinedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching environmental data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch environmental data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate air quality status based on PM2.5
  const calculateAirQualityStatus = (pm25: number): string => {
    if (pm25 <= 12) return 'Good';
    if (pm25 <= 35.4) return 'Moderate';
    if (pm25 <= 55.4) return 'Unhealthy for Sensitive Groups';
    if (pm25 <= 150.4) return 'Unhealthy';
    if (pm25 <= 250.4) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Helper function to calculate water quality score
  const calculateWaterQualityScore = (waterData: any): number => {
    if (!waterData) return 0;
    
    let score = 100;
    
    // Deduct points based on various factors
    if (waterData.ph < 6.5 || waterData.ph > 8.5) score -= 20;
    if (waterData.dissolved_oxygen < 5) score -= 25;
    if (waterData.turbidity > 4) score -= 15;
    if (waterData.contaminants && waterData.contaminants.length > 0) score -= 30;
    
    return Math.max(0, score);
  };

  // Helper function to get status color classes
  const getStatusColorClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'good':
      case 'stable':
      case 'verified':
        return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'moderate':
      case 'declining':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30';
      case 'unhealthy':
      case 'poor':
      case 'critical':
        return 'bg-red-500/20 text-red-400 border border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-cyan-400 text-lg flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          Loading real-time environmental data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-6">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Environmental Data</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchEnvironmentalData}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-400 px-4 py-2 rounded-lg transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!environmentalData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400 text-lg">No environmental data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Real-Time Environmental Monitor</h2>
        <button
          onClick={fetchEnvironmentalData}
          disabled={loading}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Refresh Data'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Air Quality Card */}
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center">
              <span className="text-cyan-400 text-lg">🌬️</span>
            </div>
            <h3 className="text-lg font-semibold text-cyan-400">Air Quality</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {environmentalData.air_quality.pm25.toFixed(1)} <span className="text-sm text-gray-400">μg/m³</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColorClass(environmentalData.air_quality.status)}`}>
                {environmentalData.air_quality.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              AQI: <span className="text-cyan-400">{environmentalData.air_quality.aqi}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              {environmentalData.air_quality.location}
            </div>
          </div>
        </div>

        {/* Forest Cover Card */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-emerald-400/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center">
              <span className="text-emerald-400 text-lg">🌳</span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-400">Forest Cover</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {environmentalData.forest_cover.percentage.toFixed(1)}<span className="text-sm text-gray-400">%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColorClass(environmentalData.forest_cover.status)}`}>
                {environmentalData.forest_cover.change > 0 ? '+' : ''}{environmentalData.forest_cover.change.toFixed(2)}%
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Area: <span className="text-emerald-400">{environmentalData.forest_cover.area_km2.toFixed(0)} km²</span>
            </div>
            
            <div className="text-xs text-gray-500">
              Deforestation rate: {environmentalData.forest_cover.deforestation_rate.toFixed(2)}%/year
            </div>
          </div>
        </div>

        {/* Water Quality Card */}
        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-400/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-lg">💧</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-400">Water Quality</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {environmentalData.water_quality.score}<span className="text-sm text-gray-400">/100</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColorClass(environmentalData.water_quality.status)}`}>
                {environmentalData.water_quality.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              pH: <span className="text-blue-400">{environmentalData.water_quality.ph.toFixed(1)}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              DO: {environmentalData.water_quality.dissolved_oxygen.toFixed(1)} mg/L
            </div>
          </div>
        </div>

        {/* Satellite Verification Card */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-lg">🛰️</span>
            </div>
            <h3 className="text-lg font-semibold text-purple-400">Satellite Data</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {environmentalData.satellite_verification.confidence}<span className="text-sm text-gray-400">%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColorClass(environmentalData.satellite_verification.status)}`}>
                {environmentalData.satellite_verification.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Source: <span className="text-purple-400">{environmentalData.satellite_verification.source}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              {environmentalData.satellite_verification.coordinates.lat.toFixed(4)}, {environmentalData.satellite_verification.coordinates.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Data Section */}
      <div className="bg-gradient-to-br from-gray-900/30 to-slate-900/30 border border-gray-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Current Weather Conditions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{environmentalData.weather.temperature.toFixed(1)}°C</div>
            <div className="text-sm text-gray-400">Temperature</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{environmentalData.weather.humidity}%</div>
            <div className="text-sm text-gray-400">Humidity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{environmentalData.weather.pressure.toFixed(0)}</div>
            <div className="text-sm text-gray-400">Pressure (hPa)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{environmentalData.weather.visibility.toFixed(1)}</div>
            <div className="text-sm text-gray-400">Visibility (km)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{environmentalData.weather.wind_speed.toFixed(1)}</div>
            <div className="text-sm text-gray-400">Wind (m/s)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{environmentalData.weather.wind_direction}°</div>
            <div className="text-sm text-gray-400">Direction</div>
          </div>
        </div>
      </div>

      {/* Real-time Data Stream Indicator */}
      <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Live Data Stream Active</span>
        </div>
        <p className="text-gray-400 text-sm">
          Environmental data sourced from multiple APIs including OpenAQ, NASA Earth Data, and weather services.
          Last update: {lastUpdated.toLocaleTimeString()}
        </p>
        {error && (
          <p className="text-red-400 text-sm mt-2">
            Some data sources may be temporarily unavailable.
          </p>
        )}
      </div>
    </div>
  );
}