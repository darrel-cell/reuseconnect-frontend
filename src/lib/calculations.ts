// Calculation utilities
// These are pure calculation functions, not data access
// Note: These functions accept category data as parameters to avoid direct mock data access

import type { AssetCategory } from '@/types/jobs';

export const vehicleEmissions: Record<string, number> = {
  car: 0.17, // kg CO2 per km
  van: 0.24,
  truck: 0.89,
};

export function calculateTravelEmissions(distanceKm: number, vehicleType: string): number {
  return Math.round(distanceKm * (vehicleEmissions[vehicleType] || 0.24) * 2); // Round trip
}

export function calculateReuseCO2e(
  assets: { categoryId: string; quantity: number }[],
  categories: AssetCategory[]
): number {
  return assets.reduce((total, asset) => {
    const category = categories.find(c => c.id === asset.categoryId);
    return total + (category?.co2ePerUnit || 0) * asset.quantity;
  }, 0);
}

export function calculateBuybackEstimate(
  assets: { categoryId: string; quantity: number }[],
  categories: AssetCategory[]
): number {
  return assets.reduce((total, asset) => {
    const category = categories.find(c => c.id === asset.categoryId);
    return total + (category?.avgBuybackValue || 0) * asset.quantity;
  }, 0);
}

