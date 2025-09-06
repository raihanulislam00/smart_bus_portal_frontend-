'use client'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

interface SignupFormData {
  username: string;
  fullName: string;
  mail: string;
  password: string;
  gender: string;
  phone: string;
  address: string;
}

export default function PassengerSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SignupFormData>();

  // Vanilla JS validation functions
  const validateUsername = (username: string): string | null => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters long';
    if (username.length > 100) return 'Username must not exceed 100 characters';
    return null;
  };

  const validateFullName = (fullName: string): string | null => {
    if (!fullName) return 'Full name is required';
    if (fullName.length < 3) return 'Full name must be at least 3 characters long';
    if (fullName.length > 150) return 'Full name must not exceed 150 characters';
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Email must be a valid email address';
    if (email.length < 7) return 'Email must be at least 7 characters long';
    if (email.length > 50) return 'Email must not exceed 50 characters';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    if (!/^(?=.*[A-Z]).+$/.test(password)) return 'Password must contain at least one uppercase letter';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return 'Phone is required';
    if (phone.length !== 11) return 'Phone must be exactly 11 digits';
    if (!/^\d+$/.test(phone)) return 'Phone number must contain only numbers';
    return null;
  };

  const validateGender = (gender: string): string | null => {
    if (!gender) return 'Gender is required';
    if (!['male', 'female'].includes(gender)) return 'Gender must be either male or female';
    return null;
  };

  const validateAddress = (address: string): string | null => {
    if (!address) return 'Address is required';
    if (address.length > 200) return 'Address must not exceed 200 characters';
    return null;
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setSubmitMessage('');
    setSubmitError('');

    // Perform vanilla JS validation
    const validationErrors: string[] = [];
    
    const usernameError = validateUsername(data.username);
    if (usernameError) validationErrors.push(usernameError);

    const fullNameError = validateFullName(data.fullName);
    if (fullNameError) validationErrors.push(fullNameError);

    const emailError = validateEmail(data.mail);
    if (emailError) validationErrors.push(emailError);

    const passwordError = validatePassword(data.password);
    if (passwordError) validationErrors.push(passwordError);

    const phoneError = validatePhone(data.phone);
    if (phoneError) validationErrors.push(phoneError);

    const genderError = validateGender(data.gender);
    if (genderError) validationErrors.push(genderError);

    const addressError = validateAddress(data.address);
    if (addressError) validationErrors.push(addressError);

    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(', '));
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for backend (matching the CreatePassengerDto structure)
      const signupData = {
        username: data.username,
        fullName: data.fullName,
        mail: data.mail,
        password: data.password,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        isActive: true // Set default value
      };

      // Send POST request to backend
      const response = await axios.post('http://localhost:3002/passenger', signupData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Signup successful:', response.data);
      setSubmitMessage('Account created successfully! You can now login.');
      reset(); // Clear the form

    } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.response?.data?.message) {
        // Handle validation errors from backend
        const errorMessage = Array.isArray(error.response.data.message) 
          ? error.response.data.message.join(', ')
          : error.response.data.message;
        setSubmitError(errorMessage);
      } else if (error.response?.status === 409) {
        setSubmitError('Username or email already exists. Please try different credentials.');
      } else {
        setSubmitError('Failed to create account. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Passenger Signup</h2>
        
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              {...register("username", { 
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
                maxLength: { value: 100, message: "Username must not exceed 100 characters" }
              })} 
              disabled={isLoading}
            />
            {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Name: <span className="text-red-500">*</span></label>
            <input 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              {...register("fullName", { 
                required: "Full name is required",
                minLength: { value: 3, message: "Full name must be at least 3 characters" },
                maxLength: { value: 150, message: "Full name must not exceed 150 characters" }
              })} 
              disabled={isLoading}
            />
            {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email: <span className="text-red-500">*</span></label>
            <input 
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              {...register("mail", { 
                required: "Email is required",
                pattern: { 
                  value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, 
                  message: "Invalid email format" 
                },
                minLength: { value: 7, message: "Email must be at least 7 characters" },
                maxLength: { value: 50, message: "Email must not exceed 50 characters" }
              })} 
              disabled={isLoading}
            />
            {errors.mail && <span className="text-red-500 text-sm">{errors.mail.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password: <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
                pattern: { 
                  value: /^(?=.*[A-Z]).+$/, 
                  message: "Password must contain at least one uppercase letter" 
                }
              })} 
              disabled={isLoading}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Gender: <span className="text-red-500">*</span></label>
            <select 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              {...register("gender", { required: "Gender is required" })}
              disabled={isLoading}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <span className="text-red-500 text-sm">{errors.gender.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone: <span className="text-red-500">*</span></label>
            <input 
              type="tel" 
              placeholder="01234567890"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              {...register("phone", { 
                required: "Phone is required",
                pattern: { 
                  value: /^\d{11}$/, 
                  message: "Phone must be exactly 11 digits" 
                }
              })} 
              disabled={isLoading}
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Address: <span className="text-red-500">*</span></label>
            <textarea 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              rows={3} 
              {...register("address", { 
                required: "Address is required",
                maxLength: { value: 200, message: "Address must not exceed 200 characters" }
              })} 
              disabled={isLoading}
            />
            {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
          </div>

          <button 
            type="submit" 
            className={`w-full py-2 text-white rounded transition duration-300 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 cursor-pointer'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <a href="/passenger/login" className="text-blue-600 hover:underline">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
}
