import api from './api';
import { AxiosResponse } from 'axios';

// Types for authentication
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  fullName: string;
  mail?: string;
  password: string;
  gender?: 'male' | 'female';
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  access_token: string;
  passenger: {
    id: number;
    username: string;
    fullName: string;
  };
}

export interface Passenger {
  id: number;
  username: string;
  fullName: string;
  mail?: string;
  gender?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  photoPath?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Service with HTTPOnly Cookies
export class AuthService {
    /**
   * Login passenger with username and password
   * Returns user data on successful authentication
   */
  static async login(username: string, password: string): Promise<Passenger> {
    try {
      const response: AxiosResponse<{ access_token: string; passenger: Passenger }> = await api.post('/passenger/login', {
        username,
        password,
      });

      const { access_token, passenger } = response.data;
      
      // Store user data temporarily in session storage
      // (Will be replaced with HTTPOnly cookie authentication)
      sessionStorage.setItem('currentUser', JSON.stringify(passenger));
      sessionStorage.setItem('accessToken', access_token);

      // Dispatch login event to update navbar
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('passenger-login'));
      }

      return passenger;
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Signup new passenger
   */
  static async signup(signupData: SignupData): Promise<Passenger> {
    try {
      const response: AxiosResponse<Passenger> = await api.post('/passenger', signupData);
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  /**
   * Logout current passenger
   */
  static async logout(): Promise<void> {
    try {
      // Clear session storage
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('accessToken');
      
      // Call logout endpoint to clear HTTPOnly cookies (when implemented)
      await api.post('/passenger/logout');
      
      // Dispatch logout event to update navbar
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('passenger-logout'));
      }
    } catch (error: any) {
      console.error('Logout error:', error.response?.data?.message || error.message);
      // Even if logout fails, clear local data
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('accessToken');
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  }

  /**
   * Get current passenger profile (requires authentication via HTTPOnly cookie)
   */
  static async getCurrentPassenger(): Promise<Passenger> {
    try {
      // First check if we have user data in session storage
      const userData = sessionStorage.getItem('currentUser');
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const user = JSON.parse(userData);
      
      // Fetch fresh data from API to ensure we have latest information
      try {
        const response: AxiosResponse<Passenger> = await api.get(`/passenger/${user.id}`);
        const freshData = response.data;
        
        // Update session storage with fresh data
        sessionStorage.setItem('currentUser', JSON.stringify(freshData));
        
        return freshData;
      } catch (apiError) {
        // If API call fails, fall back to session storage data
        console.warn('Failed to fetch fresh user data, using cached data:', apiError);
        return user;
      }
    } catch (error: any) {
      console.error('Get current passenger error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get current passenger');
    }
  }

  /**
   * Check if user is authenticated by making a request to protected endpoint
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      // For now, just check if we have user data in session storage
      const userData = sessionStorage.getItem('currentUser');
      return !!userData;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update current passenger profile
   */
  static async updateProfile(updateData: Partial<SignupData>): Promise<Passenger> {
    try {
      // First get current passenger to get ID
      const currentPassenger = await this.getCurrentPassenger();
      const response: AxiosResponse<Passenger> = await api.put(`/passenger/${currentPassenger.id}`, updateData);
      
      // Update session storage with fresh data
      sessionStorage.setItem('currentUser', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Upload passenger photo
   */
  static async uploadPhoto(photoFile: File): Promise<Passenger> {
    try {
      // First get current passenger to get ID
      const currentPassenger = await this.getCurrentPassenger();
      
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response: AxiosResponse<Passenger> = await api.post(
        `/passenger/upload/${currentPassenger.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Update session storage with fresh data
      sessionStorage.setItem('currentUser', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      console.error('Upload photo error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to upload photo');
    }
  }

  /**
   * Get photo URL
   */
  static getPhotoUrl(filename: string): string {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return `${baseURL}/passenger/photo/${filename}`;
  }
}

// Ticket Management Service
export interface CreateTicketData {
  routeName: string;
  journeyDate: string;
  seatNumber: string;
  price: number;
}

export interface Ticket {
  id: number;
  routeName: string;
  journeyDate: string;
  seatNumber: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class TicketService {
  /**
   * Create ticket for current passenger
   */
  static async createTicket(ticketData: CreateTicketData): Promise<Ticket> {
    try {
      // Get current passenger first
      const currentPassenger = await AuthService.getCurrentPassenger();
      const response: AxiosResponse<Ticket> = await api.post(
        `/passenger/${currentPassenger.id}/tickets`, 
        ticketData
      );
      return response.data;
    } catch (error: any) {
      console.error('Create ticket error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create ticket');
    }
  }

  /**
   * Get tickets for current passenger
   */
  static async getMyTickets(): Promise<Ticket[]> {
    try {
      const currentPassenger = await AuthService.getCurrentPassenger();
      const response: AxiosResponse<Ticket[]> = await api.get(`/passenger/${currentPassenger.id}/tickets`);
      return response.data;
    } catch (error: any) {
      console.error('Get tickets error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get tickets');
    }
  }

  /**
   * Get a single ticket by ID for current passenger
   */
  static async getTicketById(ticketId: string | number): Promise<Ticket> {
    try {
      const currentPassenger = await AuthService.getCurrentPassenger();
      const response: AxiosResponse<Ticket> = await api.get(`/passenger/${currentPassenger.id}/tickets/${ticketId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get ticket by ID error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get ticket details');
    }
  }

  /**
   * Cancel ticket
   */
  static async cancelTicket(ticketId: number): Promise<Ticket> {
    try {
      const currentPassenger = await AuthService.getCurrentPassenger();
      const response: AxiosResponse<Ticket> = await api.delete(
        `/passenger/${currentPassenger.id}/tickets/${ticketId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Cancel ticket error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to cancel ticket');
    }
  }
}