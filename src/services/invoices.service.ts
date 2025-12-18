// Invoices Service (for client billing)
import type { Invoice } from '@/mocks/mock-entities';
import { mockInvoices } from '@/mocks/mock-entities';
import { delay, shouldSimulateError, ApiError, ApiErrorType } from './api-error';
import { USE_MOCK_API } from '@/lib/config';
import type { User } from '@/types/auth';

const SERVICE_NAME = 'invoices';

class InvoicesService {
  async getInvoices(user?: User | null, filter?: { status?: string }): Promise<Invoice[]> {
    if (USE_MOCK_API) {
      return this.getInvoicesMock(user, filter);
    }
    throw new Error('Real API not implemented yet');
  }

  private async getInvoicesMock(user?: User | null, filter?: { status?: string }): Promise<Invoice[]> {
    await delay(500);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch invoices. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    let invoices = [...mockInvoices];

    // Filter by user role
    if (user) {
      if (user.role === 'admin') {
        // Admin sees all invoices
      } else if (user.role === 'client') {
        // Client sees only their invoices
        invoices = invoices.filter(i => i.clientId === user.tenantId);
      } else if (user.role === 'reseller') {
        // Reseller sees invoices for their clients (would need client mapping)
        // For now, return empty or filter by reseller's clients
        invoices = [];
      }
    }

    // Apply filters
    if (filter?.status) {
      invoices = invoices.filter(i => i.status === filter.status);
    }

    return invoices;
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    if (USE_MOCK_API) {
      return this.getInvoiceMock(id);
    }
    throw new Error('Real API not implemented yet');
  }

  private async getInvoiceMock(id: string): Promise<Invoice | null> {
    await delay(300);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      if (config.errorType === ApiErrorType.NOT_FOUND) {
        throw new ApiError(
          ApiErrorType.NOT_FOUND,
          `Invoice with ID "${id}" was not found.`,
          404,
          { invoiceId: id }
        );
      }
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch invoice. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    return mockInvoices.find(i => i.id === id) || null;
  }
}

export const invoicesService = new InvoicesService();

