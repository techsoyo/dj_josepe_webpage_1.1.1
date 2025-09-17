'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import authService from '../services/authService';
import LoadingSpinner from '../components/shared/LoadingSpinner'; // Assuming a loading spinner component exists

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const isValid = await authService.checkAuth();
        setIsAuthenticated(isValid);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    await authService.login(credentials);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// This hook can be used by any component to get auth state and functions
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// This component replaces AuthGate. It checks auth state and redirects if necessary.
export function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}