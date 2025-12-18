// Authentication Context
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AuthState, LoginCredentials, SignupData, InviteData } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  acceptInvite: (data: InviteData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tenant: null,
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    authService.getCurrentAuth().then((auth) => {
      if (auth) {
        setAuthState(auth);
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const auth = await authService.login(credentials);
      setAuthState(auth);
      // Navigation handled by the Login component
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const auth = await authService.signup(data);
      setAuthState(auth);
      // Navigation handled by the Signup component
    } catch (error) {
      throw error;
    }
  };

  const acceptInvite = async (data: InviteData) => {
    try {
      const auth = await authService.acceptInvite(data);
      setAuthState(auth);
      // Navigation handled by the AcceptInvite component
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      user: null,
      tenant: null,
      token: null,
      isAuthenticated: false,
    });
    // Navigation handled by the component calling logout
    window.location.href = '/login';
  };

  const hasRole = (roles: string[]): boolean => {
    if (!authState.user) return false;
    return roles.includes(authState.user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        acceptInvite,
        logout,
        isLoading,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

