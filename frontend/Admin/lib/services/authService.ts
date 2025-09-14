import axiosInstance from '../axiosConfig';

export interface LoginCredentials {
  email: string;  // Frontend uses email, we'll convert to mail for backend
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    photo?: string;
    isActive: boolean;
    dateOfBirth: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  photo?: File;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post('/auth/login', {
        mail: credentials.email,  // Convert email to mail for backend
        password: credentials.password
      });
      
      // With HTTPOnly cookies, the server sets the auth cookie automatically
      // We only store user data in sessionStorage for UI purposes (non-sensitive data)
      if (response.data.user) {
        try {
          sessionStorage.setItem('admin', JSON.stringify(response.data.user));
        } catch (storageError) {
          console.error('Error storing user data:', storageError);
          // Continue anyway, the app can still function
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(registrationData: RegistrationData): Promise<any> {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.entries(registrationData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await axiosInstance.post('/admin/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      // Use the same endpoint as AuthContext
      const response = await axiosInstance.get('/auth/verify');
      return response.status === 200 && !!response.data?.admin;
    } catch (error) {
      console.error('Token verification failed:', error);
      // Don't automatically logout here to prevent page reload loops
      // Let the calling component handle the failed verification
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to clear HTTPOnly cookie on server
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with client-side logout even if API call fails
    } finally {
      // Clear user data from sessionStorage
      sessionStorage.removeItem('admin');
      // Don't use window.location.href here to prevent page reloads
      // Let the calling component handle navigation
    }
  }

  getCurrentUser(): any {
    try {
      const userStr = sessionStorage.getItem('admin');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing user data from sessionStorage:', error);
      // Clear corrupted data
      sessionStorage.removeItem('admin');
    }
    return null;
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      // Check if user is authenticated by making a request to verify endpoint
      // HTTPOnly cookie will be automatically sent
      const response = await axiosInstance.get('/auth/verify');
      return response.status === 200 && !!response.data?.admin;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
