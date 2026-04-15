import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  department: 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'EEE' | 'IT';
  role: string;
  avatar: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from stored token on page load
  // ONLY restore session if user is on dashboard or a protected page
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isProtectedPage = window.location.pathname === '/dashboard';

    if (!token || !isProtectedPage) {
      setLoading(false);
      return;
    }

    authAPI.me()
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
