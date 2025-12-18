// Users Service (for admin user management)
import type { ExtendedUser } from '@/mocks/mock-entities';
import { mockExtendedUsers } from '@/mocks/mock-entities';
import { delay, shouldSimulateError, ApiError, ApiErrorType } from './api-error';
import { USE_MOCK_API } from '@/lib/config';
import type { User } from '@/types/auth';

const SERVICE_NAME = 'users';

class UsersService {
  async getUsers(filter?: { role?: string; tenantId?: string; isActive?: boolean }): Promise<ExtendedUser[]> {
    if (USE_MOCK_API) {
      return this.getUsersMock(filter);
    }
    throw new Error('Real API not implemented yet');
  }

  private async getUsersMock(filter?: { role?: string; tenantId?: string; isActive?: boolean }): Promise<ExtendedUser[]> {
    await delay(500);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch users. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    let users = [...mockExtendedUsers];

    if (filter) {
      if (filter.role) {
        users = users.filter(u => u.role === filter.role);
      }
      if (filter.tenantId) {
        users = users.filter(u => u.tenantId === filter.tenantId);
      }
      if (filter.isActive !== undefined) {
        users = users.filter(u => u.isActive === filter.isActive);
      }
    }

    return users;
  }

  async getUser(id: string): Promise<ExtendedUser | null> {
    if (USE_MOCK_API) {
      return this.getUserMock(id);
    }
    throw new Error('Real API not implemented yet');
  }

  private async getUserMock(id: string): Promise<ExtendedUser | null> {
    await delay(300);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      if (config.errorType === ApiErrorType.NOT_FOUND) {
        throw new ApiError(
          ApiErrorType.NOT_FOUND,
          `User with ID "${id}" was not found.`,
          404,
          { userId: id }
        );
      }
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to fetch user. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    return mockExtendedUsers.find(u => u.id === id) || null;
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<ExtendedUser> {
    if (USE_MOCK_API) {
      return this.updateUserStatusMock(id, isActive);
    }
    throw new Error('Real API not implemented yet');
  }

  private async updateUserStatusMock(id: string, isActive: boolean): Promise<ExtendedUser> {
    await delay(600);

    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      if (config.errorType === ApiErrorType.NOT_FOUND) {
        throw new ApiError(
          ApiErrorType.NOT_FOUND,
          `User with ID "${id}" was not found.`,
          404,
          { userId: id }
        );
      }
      throw new ApiError(
        config.errorType || ApiErrorType.SERVER_ERROR,
        'Failed to update user status. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    const user = mockExtendedUsers.find(u => u.id === id);
    if (!user) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        `User with ID "${id}" was not found.`,
        404,
        { userId: id }
      );
    }

    user.isActive = isActive;
    return user;
  }
}

export const usersService = new UsersService();

