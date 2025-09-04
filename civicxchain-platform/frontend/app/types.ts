import { ReactNode } from "react";

// Real types for EcoChain Governance app

export interface CreateCommitmentRequest {
    title: string;
    description: string;
    category: string;
    target_value: number;
    deadline: string;
    official_name: string;
    official_role: string;
    stake_amount: number;
    metric_type: string;
    data_source: string;
    commitment_type: string;
  }
  
  export interface UpdateCommitmentProgressRequest {
    commitmentId: number;
    actual_value: number;
  }
  
  export interface Commitment {
    official_name: ReactNode;
    current_value: number;
    category: any;
    current_progress: number;
    id: number;
    creator: string;
    title: string;
    description: string;
    deadline: string;
    target_value: number;
    actual_value: number;
    metric_type: string;
    unit: string;
    latitude?: number;
    longitude?: number;
    monitoring_region?: string;
    stake_amount: number;
    status: string;
    created_at: string;
    progress_percentage?: number;
    reward_claimed?: boolean;
  }
  
  export interface ClaimRewardRequest {
    commitmentId: number;
  }
  
  export interface EnvironmentalData {
    pm25?: number;
    pm10?: number;
    no2?: number;
    o3?: number;
    so2?: number;
    co?: number;
    forest_cover?: number;
    air_quality_index?: number;
    water_quality?: number;
    biodiversity_score?: number;
    respiratory_cases?: number;
    waterborne_diseases?: number;
    vector_borne_diseases?: number;
    population_at_risk?: number;
    location: string;
    latitude?: number;
    longitude?: number;
    data_source: string;
    last_updated: string;
    measurement_unit?: string;
    quality_status: string;
  }
  
  export interface SatelliteData {
    id: number;
    commitment_id: number;
    latitude: number;
    longitude: number;
    forest_cover_percentage?: number;
    pm25_level?: number;
    satellite_source: string;
    measurement_date: string;
    is_validated: boolean;
  }
  
  export interface WeatherData {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    pressure: number;
    precipitation: number;
    uv_index: number;
    visibility: number;
    weather_condition: string;
    location: string;
    timestamp: string;
  }
  
  export interface HealthData {
    respiratory_diseases: number;
    cardiovascular_cases: number;
    waterborne_diseases: number;
    vector_borne_diseases: number;
    air_pollution_related: number;
    total_population: number;
    risk_assessment: string;
    reporting_period: string;
    health_facilities: number;
    data_source: string;
    last_updated: string;
  }
