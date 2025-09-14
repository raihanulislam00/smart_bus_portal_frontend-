'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../lib/axiosConfig';
import { triggerNotification, NOTIFICATION_EVENTS } from '../lib/notificationHelper';

interface AdminUser {
  id: number;
  name: string;
  mail: string;
  email?: string;
  phone?: string;
  address?: string;
  country: string;
  photo?: string;
  isActive: boolean;
  dateOfBirth?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
  uniqueId: string;
  joiningDate: string;
  socialMediaLink?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Try to verify with backend
        try {
          console.log('Attempting to verify token...');
          const response = await axiosInstance.get('/auth/verify');
          console.log('Verify token response:', response.data);
          
          if (response.data?.admin) {
            console.log('Auth verification successful:', response.data.admin);
            setAdmin(response.data.admin);
            sessionStorage.setItem('admin', JSON.stringify(response.data.admin));
          } else if (response.data?.user) {
            // Backend might return 'user' instead of 'admin'
            console.log('Auth verification successful (user field):', response.data.user);
            setAdmin(response.data.user);
            sessionStorage.setItem('admin', JSON.stringify(response.data.user));
          } else {
            console.log('No admin/user data in verify response:', response.data);
            setAdmin(null);
            sessionStorage.removeItem('admin');
          }
        } catch (error: any) {
          // If verification fails (401, network error, etc.), user is not authenticated
          console.log('Auth verification failed:', error.response?.status || error.message);
          console.log('Error response:', error.response?.data);
          setAdmin(null);
          sessionStorage.removeItem('admin');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAdmin(null);
        sessionStorage.removeItem('admin');
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    if (!initialized) {
      initializeAuth();
    }
  }, []); // Empty dependency array - run only once on mount

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const response = await axiosInstance.post('/auth/login', { 
        mail: email,
        password 
      });
      
      console.log('Login response:', response.data);
      
      if (response.data?.user) {
        const adminData = response.data.user;
        sessionStorage.setItem('admin', JSON.stringify(adminData));
        setAdmin(adminData);
        console.log('Login successful, admin set:', adminData);
        // Don't redirect here - let the component handle it
      } else {
        throw new Error('Login failed - no admin data received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const currentAdmin = admin; // Store admin info before clearing
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Trigger logout notification before clearing admin data
      if (currentAdmin) {
        triggerNotification(NOTIFICATION_EVENTS.ADMIN_LOGOUT, {
          adminName: currentAdmin.name,
        });
      }
      
      setAdmin(null);
      sessionStorage.removeItem('admin');
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout
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
