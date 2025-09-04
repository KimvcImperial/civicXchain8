const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


// Types for better error handling - REMOVE the interface, keep only the class
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

// Error class for better error handling - MOVE this BEFORE the ApiClient class
export class ApiError extends Error {
  public status: number;
  public data?: any;

  constructor({ message, status, data }: { message: string; status: number; data?: any }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 10000; // 10 seconds
  private defaultRetries: number = 3;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Add authentication token to requests
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Enhanced fetch with timeout and retries
  private async fetchWithTimeout(
    url: string, 
    options: RequestInit & { timeout?: number; retries?: number } = {}
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, retries = this.defaultRetries, ...fetchOptions } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          data: errorData,
        });
      }

      return response;
    } catch (err: unknown) {
      //const error = err as Error;
      const error = err as Error & { status?: number };
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError({
          message: 'Request timeout',
          status: 408,
        });
      }

      const hasStatus = (err: any): err is Error & { status: number } => {
        return typeof err.status === 'number';
      };
      

      // Retry logic for network errors
      if (retries > 0 && (error.name === 'TypeError' || (hasStatus(error) && error.status >= 500))) {
        console.log(`Retrying request... ${retries} attempts left`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.fetchWithTimeout(url, { ...options, retries: retries - 1 });
      }

      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  async get<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      ...config,
    });
    return response.json();
  }

  async post<T = any>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      ...config,
    });
    return response.json();
  }

  async put<T = any>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...config,
    });
    return response.json();
  }

  async delete<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      ...config,
    });
    return response.json();
  }

  // File upload method
  async uploadFile<T = any>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Method to update auth token
  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // Method to clear auth token
  clearAuthToken() {
    localStorage.removeItem('auth_token');
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Specific API methods for your CivicXChain platform
export const civicApi = {
  // Commitment APIs
  commitments: {
    getAll: () => apiClient.get('/api/commitments'),
    getById: (id: string) => apiClient.get(`/api/commitments/${id}`),
    create: (data: any) => apiClient.post('/api/commitments', data),
    update: (id: string, data: any) => apiClient.put(`/api/commitments/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/commitments/${id}`),
  },

  // Environmental Data APIs
  environmental: {
    getSatelliteData: (params?: any) => apiClient.get('/api/environmental/satellite', { headers: params }),
    getAirQuality: (location: string) => apiClient.get(`/api/environmental/air-quality?location=${location}`),
    getWeatherData: (location: string) => apiClient.get(`/api/environmental/weather?location=${location}`),
    getComprehensiveReport: (params: any) => apiClient.post('/api/environmental/comprehensive-report', params),
  },

  // Smart Contract APIs
  smartContracts: {
    getContractInfo: () => apiClient.get('/api/smart-contracts/info'),
    createCommitment: (data: any) => apiClient.post('/api/smart-contracts/commitments/create', data),
    getValidationStatus: (commitmentId: string) => apiClient.get(`/api/smart-contracts/validation/${commitmentId}`),
  },

  // Reward System APIs
  rewards: {
    claimReward: (data: any) => apiClient.post('/api/rewards/claim', data),
    getRewardHistory: (userId: string) => apiClient.get(`/api/rewards/history/${userId}`),
    mintNFT: (data: any) => apiClient.post('/api/rewards/nft/mint', data),
    awardTokens: (data: any) => apiClient.post('/api/rewards/tokens/award', data),
  },

  // Health check
  health: {
    check: () => apiClient.get('/health'),
    database: () => apiClient.get('/api/database/health'),
    environmental: () => apiClient.get('/api/environmental/health'),
  },
};