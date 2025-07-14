// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export interface ApiError {
  error: string;
  details?: string;
}

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Making API request to:', url);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async getAirQualityData(location: string): Promise<any> {
    const params = new URLSearchParams({
      location,
    });
    
    return this.request(`/air-quality?${params}`);
  }

  static async getSatelliteData(): Promise<any> {
    return this.request('/satellite-data');
  }

  static async getAllCommitments(): Promise<any> {
    return this.request('/commitments');
  }
}

// Export individual functions for backward compatibility
export const getAirQualityData = ApiClient.getAirQualityData.bind(ApiClient);
export const getSatelliteData = ApiClient.getSatelliteData.bind(ApiClient);
export const getAllCommitments = ApiClient.getAllCommitments.bind(ApiClient);