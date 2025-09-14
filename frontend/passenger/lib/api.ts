import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable sending cookies with requests
  withCredentials: true, // Set to true for authentication cookies
});

// Log the base URL for debugging
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

// Request interceptor for debugging and adding auth headers
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data
    });

    // Add Authorization header if token exists
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : null,
      request: error.request ? {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      } : null
    });

    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          console.error('Unauthorized access - redirecting to login');
          // Clear invalid token
          sessionStorage.removeItem('accessToken');
          window.location.href = '/passenger/login';
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.response.data?.message || error.message);
      }
    } else if (error.request) {
      console.error('Network error - no response received. Please check if the backend server is running.');
      // Check if it's a network connectivity issue
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.error('Backend server appears to be down. Please start the backend server.');
      }
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;