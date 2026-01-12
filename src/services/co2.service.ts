// CO₂ Calculation Service
import { apiClient } from './api-client';

export interface CO2CalculationRequest {
  assets: Array<{
    categoryId: string;
    quantity: number;
  }>;
  distanceKm?: number;
  vehicleType?: 'car' | 'van' | 'truck' | 'petrol' | 'diesel' | 'electric';
  collectionCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CO2CalculationResponse {
  reuseSavings: number; // kg CO2e
  travelEmissions: number; // kg CO2e (for selected/default vehicle type)
  netImpact: number; // kg CO2e
  distanceKm: number; // Total round trip distance
  distanceMiles: number; // Total round trip distance in miles
  vehicleEmissions: {
    petrol: number; // kg CO2e
    diesel: number; // kg CO2e
    electric: number; // kg CO2e
  };
  equivalencies: {
    treesPlanted: number;
    householdDays: number;
    carMiles: number;
    flightHours: number;
  };
}

// CO2e equivalencies
const co2eEquivalencies = {
  treesPlanted: (kg: number) => Math.round(kg / 21), // 1 tree absorbs ~21kg CO2/year
  householdDays: (kg: number) => Math.round(kg / 27), // UK household ~27kg CO2/day
  carMiles: (kg: number) => Math.round(kg / 0.21), // ~0.21kg CO2 per mile
  flightHours: (kg: number) => Math.round(kg / 250), // ~250kg CO2 per flight hour
};

class CO2Service {
  async calculateCO2e(request: CO2CalculationRequest): Promise<CO2CalculationResponse> {
    const payload: any = {
      assets: request.assets,
    };

    // Add optional fields if provided
    if (request.distanceKm !== undefined) {
      payload.distanceKm = request.distanceKm;
    }
    if (request.collectionCoordinates) {
      payload.collectionLat = request.collectionCoordinates.lat;
      payload.collectionLng = request.collectionCoordinates.lng;
    }
    if (request.vehicleType) {
      payload.vehicleType = request.vehicleType;
    }

    const response = await apiClient.post<CO2CalculationResponse>('/co2/calculate', payload);
    return response;
  }

  async getJobCO2e(jobId: string): Promise<CO2CalculationResponse | null> {
    try {
      const response = await apiClient.get<CO2CalculationResponse>(`/co2/job/${jobId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch CO₂e data for job:', error);
      return null;
    }
  }
}

export const co2Service = new CO2Service();

