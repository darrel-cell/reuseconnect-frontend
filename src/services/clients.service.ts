// Clients Service (for reseller and admin client management)
import type { Client } from '@/mocks/mock-entities';
import { mockClients } from '@/mocks/mock-entities';
import { delay, shouldSimulateError, ApiError, ApiErrorType } from './api-error';
import { USE_MOCK_API } from '@/lib/config';
import type { User } from '@/types/auth';

const SERVICE_NAME = 'clients';

class ClientsService {
  async getClients(user?: User | null, filter?: { status?: string; resellerId?: string }): Promise<Client[]> {
    if (USE_MOCK_API) {
      return this.getClientsMock(user, filter);
    }
    throw new Error('Real API not implemented yet');
  }

  private async getClientsMock(user?: User | null, filter?: { status?: string; resellerId?: string }): Promise<Client[]> {
    await delay(500);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch clients. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    let clients = [...mockClients];

    // Filter by user role
    if (user) {
      if (user.role === 'admin') {
        // Admin sees all clients
      } else if (user.role === 'reseller') {
        // Reseller sees only their clients
        clients = clients.filter(c => c.resellerId === user.tenantId);
      } else if (user.role === 'client') {
        // Client sees only themselves
        clients = clients.filter(c => c.tenantId === user.tenantId);
      }
    }

    // Apply filters
    if (filter) {
      if (filter.status) {
        clients = clients.filter(c => c.status === filter.status);
      }
      if (filter.resellerId) {
        clients = clients.filter(c => c.resellerId === filter.resellerId);
      }
    }

    return clients;
  }

  async getClient(id: string): Promise<Client | null> {
    if (USE_MOCK_API) {
      return this.getClientMock(id);
    }
    throw new Error('Real API not implemented yet');
  }

  private async getClientMock(id: string): Promise<Client | null> {
    await delay(300);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      if (config.errorType === ApiErrorType.NOT_FOUND) {
        throw new ApiError(
          ApiErrorType.NOT_FOUND,
          `Client with ID "${id}" was not found.`,
          404,
          { clientId: id }
        );
      }
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch client. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    return mockClients.find(c => c.id === id) || null;
  }

  async updateClientStatus(clientId: string, status: 'active' | 'inactive' | 'pending'): Promise<Client> {
    if (USE_MOCK_API) {
      return this.updateClientStatusMock(clientId, status);
    }
    throw new Error('Real API not implemented yet');
  }

  private async updateClientStatusMock(clientId: string, status: 'active' | 'inactive' | 'pending'): Promise<Client> {
    await delay(600);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.SERVER_ERROR,
        'Failed to update client status. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    const client = mockClients.find(c => c.id === clientId);
    if (!client) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        `Client with ID "${clientId}" was not found.`,
        404,
        { clientId }
      );
    }

    client.status = status;
    return client;
  }
}

export const clientsService = new ClientsService();

