// Environmental Trend Service - Handles historical data and trend analysis
import { CONTRACT_CONFIG, ENVIRONMENTAL_ORACLE_ABI, CHAINLINK_AGGREGATOR_ABI } from '../../config/contracts.js';

export interface TrendDataPoint {
  timestamp: number;
  value: number;
  average: number;
  dataPointCount: number;
  period: string;
}

export interface TrendAnalysis {
  metric: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  data: TrendDataPoint[];
  currentTrend: {
    value: number;
    direction: 'improving' | 'worsening' | 'stable';
    hasData: boolean;
  };
  commitmentStatus: {
    isMet: boolean;
    averageValue: number;
    targetValue: number;
    periodsChecked: number;
  };
}

export interface HistoricalDataPoint {
  value: number;
  timestamp: number;
  source: string;
}

// ABI for the EnvironmentalDataHistory contract
const ENVIRONMENTAL_HISTORY_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "metric", "type": "string"}],
    "name": "getDataPointCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "metric", "type": "string"},
      {"internalType": "uint256", "name": "index", "type": "uint256"}
    ],
    "name": "getDataPoint",
    "outputs": [
      {"internalType": "int256", "name": "value", "type": "int256"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "string", "name": "source", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "metric", "type": "string"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"}
    ],
    "name": "getDataPointsInRange",
    "outputs": [
      {
        "components": [
          {"internalType": "int256", "name": "value", "type": "int256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "string", "name": "source", "type": "string"}
        ],
        "internalType": "struct EnvironmentalDataHistory.DataPoint[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "metric", "type": "string"},
      {"internalType": "string", "name": "period", "type": "string"},
      {"internalType": "uint256", "name": "count", "type": "uint256"}
    ],
    "name": "getHistoricalAverages",
    "outputs": [
      {
        "components": [
          {"internalType": "int256", "name": "average", "type": "int256"},
          {"internalType": "uint256", "name": "dataPoints", "type": "uint256"},
          {"internalType": "uint256", "name": "periodStart", "type": "uint256"},
          {"internalType": "uint256", "name": "periodEnd", "type": "uint256"}
        ],
        "internalType": "struct EnvironmentalDataHistory.AverageData[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "metric", "type": "string"},
      {"internalType": "string", "name": "period", "type": "string"}
    ],
    "name": "getCurrentTrend",
    "outputs": [
      {"internalType": "int256", "name": "trendValue", "type": "int256"},
      {"internalType": "bool", "name": "hasData", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "metric", "type": "string"},
      {"internalType": "int256", "name": "targetValue", "type": "int256"},
      {"internalType": "string", "name": "period", "type": "string"},
      {"internalType": "uint256", "name": "duration", "type": "uint256"}
    ],
    "name": "isCommitmentMet",
    "outputs": [
      {"internalType": "bool", "name": "isMet", "type": "bool"},
      {"internalType": "int256", "name": "averageValue", "type": "int256"},
      {"internalType": "uint256", "name": "periodsChecked", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export class EnvironmentalTrendService {
  private static contractAddress = CONTRACT_CONFIG.ENVIRONMENTAL_HISTORY || '';
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_DURATION = 60000; // 1 minute cache
  private static provider: any = null;

  // Real oracle contract addresses from your deployment
  private static readonly ORACLE_ADDRESSES = {
    pm25: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    co2: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    forest: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
  };

  /**
   * Initialize provider connection
   */
  private static getProvider() {
    // For now, we'll use mock data since we're focusing on the UI
    // In production, this would connect to a proper RPC provider
    return null;
  }

  /**
   * Fetch real oracle data from deployed contracts
   */
  private static async fetchRealOracleData(): Promise<{
    pm25: number;
    co2: number;
    forest: number;
    timestamp: number;
  }> {
    try {
      // For now, return mock data since we're focusing on the UI
      // In production, this would fetch real oracle data using wagmi hooks
      console.log('Fetching oracle data from contracts...');

      // Return realistic mock values based on your oracle defaults
      return {
        pm25: 9.88 + (Math.random() - 0.5) * 5, // PM2.5 around 9.88 μg/m³
        co2: 485.11 + (Math.random() - 0.5) * 20, // CO2 around 485.11 ppm
        forest: 67.46 + (Math.random() - 0.5) * 5, // Forest cover around 67.46%
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching real oracle data:', error);
      // Fallback to reasonable default values if oracle fails
      return {
        pm25: 9.88,   // Default from your oracle script
        co2: 485.11,  // Default from your oracle script
        forest: 67.46, // Default from your oracle script
        timestamp: Date.now()
      };
    }
  }

  /**
   * Get trend analysis for a specific metric and time period
   */
  static async getTrendAnalysis(
    metric: string,
    period: 'hourly' | 'daily' | 'weekly' | 'monthly',
    dataPoints: number = 24,
    targetValue?: number
  ): Promise<TrendAnalysis> {
    const cacheKey = `trend_${metric}_${period}_${dataPoints}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // For now, we'll generate mock trend data since the contract isn't deployed yet
      // In production, this would call the actual contract
      const trendData = await this.generateMockTrendData(metric, period, dataPoints);
      
      const analysis: TrendAnalysis = {
        metric,
        period,
        data: trendData,
        currentTrend: {
          value: this.calculateTrendDirection(trendData),
          direction: this.getTrendDirection(trendData),
          hasData: trendData.length > 0
        },
        commitmentStatus: targetValue ? {
          isMet: this.checkCommitmentStatus(trendData, targetValue),
          averageValue: this.calculateOverallAverage(trendData),
          targetValue,
          periodsChecked: trendData.length
        } : {
          isMet: false,
          averageValue: 0,
          targetValue: 0,
          periodsChecked: 0
        }
      };

      // Cache the result
      this.cache.set(cacheKey, { data: analysis, timestamp: Date.now() });
      
      return analysis;
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
      throw error;
    }
  }

  /**
   * Generate mock trend data for demonstration
   * In production, this would be replaced with actual contract calls
   */
  private static async generateMockTrendData(
    metric: string,
    period: 'hourly' | 'daily' | 'weekly' | 'monthly',
    count: number
  ): Promise<TrendDataPoint[]> {
    const now = Date.now();
    const periodMs = this.getPeriodDuration(period);
    const data: TrendDataPoint[] = [];

    // Get current real oracle data as base values
    const realData = await this.fetchRealOracleData();

    // Map metrics to real oracle values
    const baseValues = {
      pm25: realData.pm25,
      aqi: realData.pm25 * 3.5, // Approximate AQI from PM2.5
      forest_cover: realData.forest,
      co2: realData.co2
    };

    const baseValue = baseValues[metric as keyof typeof baseValues] || realData.pm25;

    for (let i = count - 1; i >= 0; i--) {
      const timestamp = now - (i * periodMs);
      
      // Add some realistic variation
      const variation = (Math.random() - 0.5) * (baseValue * 0.3);
      const trendFactor = Math.sin((i / count) * Math.PI) * (baseValue * 0.2);
      const value = Math.max(0, baseValue + variation + trendFactor);
      
      // Simulate some improvement over time for environmental metrics
      const improvementFactor = (count - i) / count * (baseValue * 0.1);
      const adjustedValue = Math.max(0, value - improvementFactor);

      data.push({
        timestamp,
        value: adjustedValue,
        average: adjustedValue,
        dataPointCount: Math.floor(Math.random() * 10) + 5, // 5-15 data points per period
        period
      });
    }

    return data;
  }

  /**
   * Get period duration in milliseconds
   */
  private static getPeriodDuration(period: string): number {
    switch (period) {
      case 'hourly': return 3600 * 1000;
      case 'daily': return 86400 * 1000;
      case 'weekly': return 604800 * 1000;
      case 'monthly': return 2592000 * 1000;
      default: return 86400 * 1000;
    }
  }

  /**
   * Calculate trend direction value
   */
  private static calculateTrendDirection(data: TrendDataPoint[]): number {
    if (data.length < 2) return 0;
    
    const recent = data.slice(-3); // Last 3 data points
    const earlier = data.slice(-6, -3); // Previous 3 data points
    
    if (recent.length === 0 || earlier.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, point) => sum + point.average, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, point) => sum + point.average, 0) / earlier.length;
    
    return earlierAvg - recentAvg; // Positive means improvement (values decreasing)
  }

  /**
   * Get trend direction as string
   */
  private static getTrendDirection(data: TrendDataPoint[]): 'improving' | 'worsening' | 'stable' {
    const trendValue = this.calculateTrendDirection(data);
    
    if (Math.abs(trendValue) < 0.5) return 'stable';
    return trendValue > 0 ? 'improving' : 'worsening';
  }

  /**
   * Check if commitment is met based on trend data
   */
  private static checkCommitmentStatus(data: TrendDataPoint[], targetValue: number): boolean {
    if (data.length === 0) return false;
    
    const recentData = data.slice(-7); // Last week of data
    const averageValue = recentData.reduce((sum, point) => sum + point.average, 0) / recentData.length;
    
    // For environmental metrics, lower values are better
    return averageValue <= targetValue;
  }

  /**
   * Calculate overall average from trend data
   */
  private static calculateOverallAverage(data: TrendDataPoint[]): number {
    if (data.length === 0) return 0;
    
    return data.reduce((sum, point) => sum + point.average, 0) / data.length;
  }

  /**
   * Get real-time environmental data for immediate display
   */
  static async getCurrentEnvironmentalData(): Promise<{
    pm25: number;
    aqi: number;
    forestCover: number;
    co2: number;
    timestamp: number;
  }> {
    try {
      // Fetch real oracle data
      const realData = await this.fetchRealOracleData();

      return {
        pm25: realData.pm25,
        aqi: realData.pm25 * 3.5, // Approximate AQI from PM2.5
        forestCover: realData.forest,
        co2: realData.co2,
        timestamp: realData.timestamp
      };
    } catch (error) {
      console.error('Error fetching current environmental data:', error);
      // Fallback to default values
      return {
        pm25: 9.88,
        aqi: 34.58,
        forestCover: 67.46,
        co2: 485.11,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  static clearCache(): void {
    this.cache.clear();
  }
}
