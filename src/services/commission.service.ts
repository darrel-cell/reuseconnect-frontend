// Commission Service (for reseller earnings)
import type { Commission } from '@/mocks/mock-entities';
import { mockCommissions } from '@/mocks/mock-entities';
import { delay, shouldSimulateError, ApiError, ApiErrorType } from './api-error';
import { USE_MOCK_API } from '@/lib/config';
import type { User } from '@/types/auth';

const SERVICE_NAME = 'commission';

class CommissionService {
  async getCommissions(user?: User | null, filter?: { status?: string; period?: string }): Promise<Commission[]> {
    if (USE_MOCK_API) {
      return this.getCommissionsMock(user, filter);
    }
    throw new Error('Real API not implemented yet');
  }

  private async getCommissionsMock(user?: User | null, filter?: { status?: string; period?: string }): Promise<Commission[]> {
    await delay(500);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch commission records. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    let commissions = [...mockCommissions];

    // Filter by user role
    if (user) {
      if (user.role === 'admin') {
        // Admin sees all commissions
      } else if (user.role === 'reseller') {
        // Reseller sees only their commissions
        commissions = commissions.filter(c => c.resellerId === user.tenantId);
      } else {
        // Other roles don't see commissions
        commissions = [];
      }
    }

    // Apply filters
    if (filter) {
      if (filter.status) {
        commissions = commissions.filter(c => c.status === filter.status);
      }
      if (filter.period) {
        commissions = commissions.filter(c => c.period === filter.period);
      }
    }

    return commissions;
  }

  async getCommissionSummary(user?: User | null): Promise<{
    totalPending: number;
    totalApproved: number;
    totalPaid: number;
    totalAmount: number;
    byPeriod: Record<string, number>;
  }> {
    if (USE_MOCK_API) {
      return this.getCommissionSummaryMock(user);
    }
    throw new Error('Real API not implemented yet');
  }

  private async getCommissionSummaryMock(user?: User | null): Promise<{
    totalPending: number;
    totalApproved: number;
    totalPaid: number;
    totalAmount: number;
    byPeriod: Record<string, number>;
  }> {
    await delay(400);

    const commissions = await this.getCommissionsMock(user);

    const summary = {
      totalPending: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0),
      totalApproved: commissions.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.commissionAmount, 0),
      totalPaid: commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0),
      totalAmount: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
      byPeriod: {} as Record<string, number>,
    };

    // Group by period
    commissions.forEach(c => {
      summary.byPeriod[c.period] = (summary.byPeriod[c.period] || 0) + c.commissionAmount;
    });

    return summary;
  }
}

export const commissionService = new CommissionService();

