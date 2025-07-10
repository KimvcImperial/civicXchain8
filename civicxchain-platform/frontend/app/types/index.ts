export interface Commitment {
    id: string;
    title: string;
    description: string;
    category: string;
    target_value: number;
    current_progress: number;
    deadline: string;
    status: 'active' | 'completed' | 'failed';
    official_name: string;
    official_role: string;
    stake_amount: number;
    created_at: string;
    satellite_verified: boolean;
  }
  
  export interface EnvironmentalData {
    location: string;
    pm25: number;
    co2: number;
    forest_cover: number;
    water_quality: number;
    timestamp: string;
    source: string;
  }
  
  export interface SatelliteData {
    location: string;
    forest_cover_percentage: number;
    change_detected: boolean;
    last_updated: string;
    confidence_score: number;
  }
  
  export interface CreateCommitmentRequest {
    title: string;
    description: string;
    category: string;
    target_value: number;
    deadline: string;
    official_name: string;
    official_role: string;
    stake_amount: number;
  }