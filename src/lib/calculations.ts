import type { AssetCategory } from '@/types/jobs';

export const vehicleEmissions: Record<string, number> = {
  petrol: 0.21,
  diesel: 0.19,
  electric: 0.0,
  car: 0.17,
  van: 0.24,
  truck: 0.89,
};

export const WAREHOUSE_COORDINATES = {
  lat: 51.5174,
  lng: 0.1904,
};

/**
 * Geocode a postcode to get coordinates (using OpenStreetMap Nominatim)
 */
export async function geocodePostcode(postcode: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(postcode)}&limit=1&countrycodes=gb`
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}

// Import road distance function
import { calculateRoundTripRoadDistance } from './routing';

/**
 * Calculate round trip road distance from collection site to warehouse
 * Uses road distance for accurate calculations
 */
export async function calculateRoundTripDistance(
  collectionLat: number,
  collectionLng: number
): Promise<number> {
  return calculateRoundTripRoadDistance(
    collectionLat,
    collectionLng,
    WAREHOUSE_COORDINATES.lat,
    WAREHOUSE_COORDINATES.lng
  );
}

export function kmToMiles(km: number): number {
  return km * 0.621371;
}



