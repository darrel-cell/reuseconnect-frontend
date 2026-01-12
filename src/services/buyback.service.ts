// Buyback Calculation Service
import { apiClient } from './api-client';
import { USE_MOCK_API } from '@/lib/config';
import { delay } from './api-error';

const SERVICE_NAME = 'buyback';

export interface BuybackCalculationRequest {
  assets: Array<{
    categoryId: string;
    quantity: number;
  }>;
}

export interface BuybackCalculationResponse {
  estimatedBuyback: number; // £
}

class BuybackService {
  async calculateBuyback(request: BuybackCalculationRequest): Promise<BuybackCalculationResponse> {
    // Use real API if not using mocks
    if (!USE_MOCK_API) {
      return this.calculateBuybackAPI(request);
    }

    // For mock mode, return 0 (or could implement mock logic)
    // Since this is being migrated from frontend calculation, mock is not needed
    return this.calculateBuybackAPI(request);
  }

  private async calculateBuybackAPI(request: BuybackCalculationRequest): Promise<BuybackCalculationResponse> {
    const response = await apiClient.post<BuybackCalculationResponse>('/buyback/calculate', {
      assets: request.assets,
    });
    return response;
  }
}

export const buybackService = new BuybackService();
