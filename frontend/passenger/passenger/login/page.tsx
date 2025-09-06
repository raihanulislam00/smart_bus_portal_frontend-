'use client'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

interface LoginFormData {
  username: string;
  password: string;
}

export default function PassengerLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      // Send POST request to backend login endpoint
      const response = await axios.post('http://localhost:3002/passenger/login', {
        username: data.username,
        password: data.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login successful:', response.data);
      setSubmitMessage('Login successful! Redirecting...');
      
      // Store JWT token if provided
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Redirect to dashboard or home page after successful login
      setTimeout(() => {
        window.location.href = '';
      }, 2000);

    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401) {
        setSubmitError('Invalid username or password. Please try again.');
      } else if (error.response?.data?.message) {
        const errorMessage = Array.isArray(error.response.data.message) 
          ? error.response.data.message.join(', ')
          : error.response.data.message;
        setSubmitError(errorMessage);
      } else {
        setSubmitError('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Passenger Login</h2>
        
        {/* Success Message */}
        {submitMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {submitMessage}
          </div>
        )}
        
        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Username: <span className="text-red-500">*</span></label>
            <input 
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              {...register("username", { 
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" }
              })} 
              disabled={isLoading}
            />
            {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password: <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              {...register("password", { required: "Password is required" })} 
              disabled={isLoading}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            className={`w-full py-2 text-white rounded transition duration-300 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <a href="/passenger/signup" className="text-blue-600 hover:underline">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
}
