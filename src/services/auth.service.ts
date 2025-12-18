// Mock Authentication Service
import type { 
  User, 
  Tenant, 
  AuthState, 
  LoginCredentials, 
  SignupData, 
  InviteData,
  Invite 
} from '@/types/auth';

// Mock storage for demo
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@reuse.com',
    name: 'Admin User',
    role: 'admin',
    tenantId: 'tenant-1',
    tenantName: 'Reuse ITAD Platform',
    createdAt: '2024-01-01',
  },
  {
    id: 'user-2',
    email: 'client@techcorp.com',
    name: 'Client User',
    role: 'client',
    tenantId: 'tenant-2',
    tenantName: 'TechCorp Industries',
    createdAt: '2024-01-15',
  },
  {
    id: 'user-3',
    email: 'reseller@partner.com',
    name: 'Reseller User',
    role: 'reseller',
    tenantId: 'tenant-3',
    tenantName: 'Partner Solutions',
    createdAt: '2024-02-01',
  },
  {
    id: 'user-4',
    email: 'driver@reuse.com',
    name: 'James Wilson',
    role: 'driver',
    tenantId: 'tenant-1',
    tenantName: 'Reuse ITAD Platform',
    createdAt: '2024-03-01',
  },
];

const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Reuse ITAD Platform',
    slug: 'reuse',
    primaryColor: 'hsl(168, 70%, 35%)',
    accentColor: 'hsl(168, 60%, 45%)',
    theme: 'auto',
    createdAt: '2024-01-01',
  },
  {
    id: 'tenant-2',
    name: 'TechCorp Industries',
    slug: 'techcorp',
    primaryColor: 'hsl(221, 83%, 53%)',
    accentColor: 'hsl(221, 73%, 63%)',
    theme: 'light',
    createdAt: '2024-01-15',
  },
  {
    id: 'tenant-3',
    name: 'Partner Solutions',
    slug: 'partner',
    primaryColor: 'hsl(280, 70%, 50%)',
    accentColor: 'hsl(280, 60%, 60%)',
    theme: 'light',
    createdAt: '2024-02-01',
  },
];

const mockInvites: Invite[] = [
  {
    id: 'invite-1',
    email: 'newuser@techcorp.com',
    role: 'client',
    tenantId: 'tenant-2',
    tenantName: 'TechCorp Industries',
    invitedBy: 'user-2',
    invitedAt: '2024-12-01',
    expiresAt: '2024-12-15',
  },
];

// Simulate API delay
import { delay, shouldSimulateError, ApiError, ApiErrorType } from './api-error';

const SERVICE_NAME = 'auth';

class AuthService {
  private currentUser: User | null = null;
  private currentTenant: Tenant | null = null;
  private token: string | null = null;

  async login(credentials: LoginCredentials): Promise<AuthState> {
    await delay(1000);

    // Simulate errors
    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      if (config.errorType === ApiErrorType.NETWORK_ERROR) {
        throw new ApiError(
          ApiErrorType.NETWORK_ERROR,
          'Network error. Please check your connection and try again.',
          0
        );
      }
      if (config.errorType === ApiErrorType.RATE_LIMIT) {
        throw new ApiError(
          ApiErrorType.RATE_LIMIT,
          'Too many login attempts. Please wait a moment and try again.',
          429,
          { retryAfter: 60 }
        );
      }
      throw new ApiError(
        config.errorType || ApiErrorType.SERVER_ERROR,
        'Login failed. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }
    
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'Email and password are required.',
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'Please enter a valid email address.',
        400
      );
    }
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user || credentials.password !== 'password') {
      throw new ApiError(
        ApiErrorType.UNAUTHORIZED,
        'Invalid email or password. Please check your credentials and try again.',
        401
      );
    }

    const tenant = mockTenants.find(t => t.id === user.tenantId);
    this.currentUser = user;
    this.currentTenant = tenant || null;
    this.token = `mock-token-${user.id}`;

    // Store in localStorage for persistence
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('user_id', user.id);

    return {
      user,
      tenant: tenant || null,
      token: this.token,
      isAuthenticated: true,
    };
  }

  async signup(data: SignupData): Promise<AuthState> {
    await delay(1500);

    // Simulate errors
    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.SERVER_ERROR,
        'Failed to create account. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    // Validate input
    if (!data.email || !data.password || !data.name || !data.companyName) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'All fields are required.',
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'Please enter a valid email address.',
        400
      );
    }

    // Validate password strength
    if (data.password.length < 8) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'Password must be at least 8 characters long.',
        400
      );
    }

    // Check if user already exists
    if (mockUsers.some(u => u.email === data.email)) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'An account with this email already exists. Please use a different email or try logging in.',
        409
      );
    }

    // Create new tenant
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: data.companyName,
      slug: data.companyName.toLowerCase().replace(/\s+/g, '-'),
      primaryColor: 'hsl(168, 70%, 35%)',
      accentColor: 'hsl(168, 60%, 45%)',
      theme: 'auto',
      createdAt: new Date().toISOString(),
    };

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role || 'client',
      tenantId: newTenant.id,
      tenantName: newTenant.name,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    mockTenants.push(newTenant);

    this.currentUser = newUser;
    this.currentTenant = newTenant;
    this.token = `mock-token-${newUser.id}`;

    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('user_id', newUser.id);

    return {
      user: newUser,
      tenant: newTenant,
      token: this.token,
      isAuthenticated: true,
    };
  }

  async acceptInvite(inviteData: InviteData): Promise<AuthState> {
    await delay(1500);

    // Simulate errors
    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.SERVER_ERROR,
        'Failed to accept invite. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    // Validate input
    if (!inviteData.inviteToken || !inviteData.email || !inviteData.name || !inviteData.password) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'All fields are required.',
        400
      );
    }

    const invite = mockInvites.find(i => i.id === inviteData.inviteToken);
    if (!invite || invite.email !== inviteData.email) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        'Invalid or expired invite. Please check your invite link and try again.',
        404
      );
    }

    if (new Date(invite.expiresAt) < new Date()) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'This invite has expired. Please request a new invite.',
        400,
        { expiresAt: invite.expiresAt }
      );
    }

    // Check if invite was already accepted
    if (invite.acceptedAt) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'This invite has already been accepted.',
        400
      );
    }

    const tenant = mockTenants.find(t => t.id === invite.tenantId);
    if (!tenant) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        'Tenant not found. Please contact support.',
        404
      );
    }

    // Validate password strength
    if (inviteData.password.length < 8) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'Password must be at least 8 characters long.',
        400
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: inviteData.email,
      name: inviteData.name,
      role: invite.role,
      tenantId: invite.tenantId,
      tenantName: invite.tenantName,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    invite.acceptedAt = new Date().toISOString();

    this.currentUser = newUser;
    this.currentTenant = tenant;
    this.token = `mock-token-${newUser.id}`;

    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('user_id', newUser.id);

    return {
      user: newUser,
      tenant,
      token: this.token,
      isAuthenticated: true,
    };
  }

  async getInvite(token: string): Promise<Invite | null> {
    await delay(500);

    // Simulate errors
    if (shouldSimulateError(SERVICE_NAME)) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      if (config.errorType === ApiErrorType.NOT_FOUND) {
        throw new ApiError(
          ApiErrorType.NOT_FOUND,
          'Invite not found or has expired.',
          404,
          { token }
        );
      }
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to load invite. Please try again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }

    const invite = mockInvites.find(i => i.id === token);
    
    if (!invite) {
      return null;
    }

    // Check if expired
    if (new Date(invite.expiresAt) < new Date()) {
      throw new ApiError(
        ApiErrorType.VALIDATION_ERROR,
        'This invite has expired.',
        400,
        { expiresAt: invite.expiresAt }
      );
    }

    return invite;
  }

  async logout(): Promise<void> {
    await delay(300);
    this.currentUser = null;
    this.currentTenant = null;
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  }

  async getCurrentAuth(): Promise<AuthState | null> {
    await delay(300);

    // Simulate errors (less common for auth check)
    if (shouldSimulateError(SERVICE_NAME) && Math.random() < 0.1) {
      const config = JSON.parse(localStorage.getItem(`error_sim_${SERVICE_NAME}`) || '{}');
      throw new ApiError(
        config.errorType || ApiErrorType.NETWORK_ERROR,
        'Failed to verify authentication. Please log in again.',
        config.errorType === ApiErrorType.NETWORK_ERROR ? 0 : 500
      );
    }
    
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    
    if (!token || !userId) {
      return null;
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return null;
    }

    const tenant = mockTenants.find(t => t.id === user.tenantId);
    this.currentUser = user;
    this.currentTenant = tenant || null;
    this.token = token;

    return {
      user,
      tenant: tenant || null,
      token,
      isAuthenticated: true,
    };
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenant;
  }
}

export const authService = new AuthService();

