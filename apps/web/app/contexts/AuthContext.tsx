'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { DecodedToken, User } from '@/app/services/types';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, signup as apiSignup } from "../services/auth";

interface AuthContextType {
  user: User | null;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, role: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const access_token = localStorage.getItem('access_token');
    if (storedUser && access_token) {
      setUser(JSON.parse(storedUser));
      const decodedToken = jwtDecode<DecodedToken>(access_token);
      setRole(decodedToken.role);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiLogin({ email, password });
    const decodedToken = jwtDecode<DecodedToken>(response.access_token);
    const user: User = {
      id: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
    };
    setUser(user);
    setRole(decodedToken.role);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const signup = async (name: string, role: string, email: string, password: string) => {
    const response = await apiSignup({ name, role, email, password });
    const decodedToken = jwtDecode<DecodedToken>(response.access_token);
    const user: User = {
      id: decodedToken.sub,
      name: name,
      email: decodedToken.email,
    };
    setUser(user);
    setRole(decodedToken.role);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', response.access_token);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  return <AuthContext.Provider value={{ user, role, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}