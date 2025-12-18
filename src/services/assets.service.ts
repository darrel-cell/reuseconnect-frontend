// Assets Service
import type { AssetCategory } from '@/types/jobs';
import { assetCategories } from '@/mocks/mock-data';
import { delay, shouldSimulateError, ApiError, ApiErrorType } from './api-error';

const SERVICE_NAME = 'assets';

class AssetsService {
  async getAssetCategories(): Promise<AssetCategory[]> {
    await delay(300);

    // Simulate errors (less common for static data)
    if (shouldSimulateError(SERVICE_NAME) && Math.random() < 0.1) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch asset categories. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    return [...assetCategories];
  }

  async getAssetCategory(id: string): Promise<AssetCategory | null> {
    await delay(200);

    // Simulate errors
    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      if (config.errorType === ApiErrorType.NOT_FOUND) {
        throw new ApiError(
          ApiErrorType.NOT_FOUND,
          `Asset category with ID "${id}" was not found.`,
          404,
          { categoryId: id }
        );
      }
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch asset category. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    const category = assetCategories.find(cat => cat.id === id);
    
    if (!category && shouldSimulateError(SERVICE_NAME)) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        `Asset category with ID "${id}" was not found.`,
        404,
        { categoryId: id }
      );
    }

    return category || null;
  }
}

export const assetsService = new AssetsService();

