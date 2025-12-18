// Tenant Theme Context for White-Label Branding
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Tenant } from '@/types/auth';

interface TenantThemeContextType {
  primaryColor: string;
  accentColor: string;
  logo?: string;
  tenantName: string;
  applyTheme: () => void;
}

const TenantThemeContext = createContext<TenantThemeContextType | undefined>(undefined);

export function TenantThemeProvider({ children }: { children: ReactNode }) {
  const { tenant } = useAuth();
  const [theme, setTheme] = useState({
    primaryColor: 'hsl(168, 70%, 35%)',
    accentColor: 'hsl(168, 60%, 45%)',
    logo: '/logo.avif' as string | undefined, // Default platform logo
    tenantName: 'Reuse ITAD Platform',
  });

  useEffect(() => {
    if (tenant) {
      setTheme({
        primaryColor: tenant.primaryColor || 'hsl(168, 70%, 35%)',
        accentColor: tenant.accentColor || 'hsl(168, 60%, 45%)',
        logo: tenant.logo || '/logo.avif', // Use tenant logo or fallback to default
        tenantName: tenant.name,
      });
      applyTheme(tenant);
    }
  }, [tenant]);

  const applyTheme = (tenantData?: Tenant) => {
    const data = tenantData || tenant;
    if (!data) return;

    const root = document.documentElement;
    
    // Apply primary color
    if (data.primaryColor) {
      const primary = parseColor(data.primaryColor);
      root.style.setProperty('--primary', primary);
    }

    // Apply accent color
    if (data.accentColor) {
      const accent = parseColor(data.accentColor);
      root.style.setProperty('--accent', accent);
    }
  };

  // Parse HSL color string to CSS variable format
  const parseColor = (color: string): string => {
    // If already in HSL format, return as is
    if (color.startsWith('hsl(')) {
      return color;
    }
    // Otherwise, assume it's a hex or other format and convert
    return color;
  };

  return (
    <TenantThemeContext.Provider
      value={{
        primaryColor: theme.primaryColor,
        accentColor: theme.accentColor,
        logo: theme.logo,
        tenantName: theme.tenantName,
        applyTheme: () => applyTheme(tenant || undefined),
      }}
    >
      {children}
    </TenantThemeContext.Provider>
  );
}

export function useTenantTheme() {
  const context = useContext(TenantThemeContext);
  if (context === undefined) {
    throw new Error('useTenantTheme must be used within a TenantThemeProvider');
  }
  return context;
}

