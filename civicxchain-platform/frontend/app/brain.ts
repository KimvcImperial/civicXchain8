import { 
    CreateCommitmentRequest, 
    UpdateCommitmentProgressRequest,
    Commitment,
    ClaimRewardRequest,
    EnvironmentalData,
    SatelliteData,
    WeatherData,
    HealthData
  } from './types';
  
  // Real API base URL - replace with your actual API endpoint
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  class BrainClient {
    private baseUrl: string;
  
    constructor(baseUrl: string = API_BASE_URL) {
      this.baseUrl = baseUrl;
    }
  
    private async makeRequest<T>(
      endpoint: string, 
      options: RequestInit = {}
    ): Promise<{
      status: any; ok: boolean; json: () => Promise<T> 
}> {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });
  
        return {
          ok: response.ok,
          status: response.status,
          json: async () => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          }
        };
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    }
  
    // Health check
    async check_health() {
      return this.makeRequest('/_healthz');
    }
  
    // Commitment management
    async get_all_commitments() {
      return this.makeRequest<Commitment[]>('/api/database/commitments');
    }
  
    async create_commitment(p0: {}, data: CreateCommitmentRequest) {
      return this.makeRequest<Commitment>('/api/smart-contracts/create-commitment', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async update_commitment_progress(data: UpdateCommitmentProgressRequest) {
      return this.makeRequest(`/api/smart-contracts/update-progress`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  
    async claim_reward(data: ClaimRewardRequest) {
      return this.makeRequest(`/api/smart-contracts/claim-reward`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    // Environmental data
    async get_environmental_data() {
      return this.makeRequest<EnvironmentalData>('/api/environmental-data/comprehensive');
    }
  
    async get_air_quality_data(params?: { location?: string; limit?: number; radius?: number }) {
      const queryParams = new URLSearchParams();
      if (params?.location) queryParams.append('location', params.location);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.radius) queryParams.append('radius', params.radius.toString());
      
      const query = queryParams.toString();
      return this.makeRequest<EnvironmentalData[]>(`/api/environmental-data/air-quality${query ? `?${query}` : ''}`);
    }
  
    async get_satellite_data(params: { commitmentId: number }) {
      return this.makeRequest<SatelliteData[]>(`/api/database/satellite-data?commitmentId=${params.commitmentId}`);
    }
  
    async get_satellite_imagery(params: { lat: number; lng: number; start_date?: string; end_date?: string }) {
      const queryParams = new URLSearchParams({
        lat: params.lat.toString(),
        lng: params.lng.toString(),
      });
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      
      return this.makeRequest(`/api/environmental-data/satellite-imagery?${queryParams.toString()}`);
    }
  
    async get_weather_data(params: { lat: number; lng: number }) {
      const queryParams = new URLSearchParams({
        lat: params.lat.toString(),
        lng: params.lng.toString(),
      });
      return this.makeRequest<WeatherData>(`/api/environmental-data/weather?${queryParams.toString()}`);
    }
  
    async get_health_data(params?: { location?: string; time_period?: string }) {
      const queryParams = new URLSearchParams();
      if (params?.location) queryParams.append('location', params.location);
      if (params?.time_period) queryParams.append('time_period', params.time_period);
      
      const query = queryParams.toString();
      return this.makeRequest<HealthData>(`/api/environmental-data/health${query ? `?${query}` : ''}`);
    }
  
    // Validation and status
    async get_validation_status() {
      return this.makeRequest('/api/database/validation-status');
    }
  
    async get_active_commitments() {
      return this.makeRequest('/api/smart-contracts/active-commitments');
    }
  
    // Database initialization
    async initialize_database() {
      return this.makeRequest('/api/database/initialize', {
        method: 'POST',
      });
    }
  
    // Contract info
    async get_contract_info() {
      return this.makeRequest('/api/smart-contracts/contract-info');
    }
  
    // Comprehensive reports
    async get_comprehensive_environmental_report(params?: { location?: string; lat?: number; lng?: number }) {
      const queryParams = new URLSearchParams();
      if (params?.location) queryParams.append('location', params.location);
      if (params?.lat) queryParams.append('lat', params.lat.toString());
      if (params?.lng) queryParams.append('lng', params.lng.toString());
      
      const query = queryParams.toString();
      return this.makeRequest(`/api/environmental-data/comprehensive-report${query ? `?${query}` : ''}`);
    }
  
    async get_available_data_sources() {
      return this.makeRequest('/api/environmental-data/data-sources');
    }
  
    async environmental_data_health_check() {
      return this.makeRequest('/api/environmental-data/health-check');
    }
  }
  
  // Create and export a singleton instance
  const brain = new BrainClient();
  export default brain;