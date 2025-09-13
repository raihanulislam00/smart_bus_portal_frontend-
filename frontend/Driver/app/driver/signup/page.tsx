'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3004',
  withCredentials: true, 
  timeout: 10000, 
});

export default function DriverSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nid: '',
    nidImage: null as File | null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    nid: '',
    nidImage: ''
  });

  
  function validateName(name: string): string {
    if (name.length < 3) return 'Name must be at least 3 characters long';
    for (let i = 0; i < name.length; i++) {
      const c = name[i];
      if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c === ' ')) {
        return 'Name can only contain letters and spaces';
      }
    }
    return '';
  }

  function validateEmail(email: string): string {
    if (!email.includes('@') || !email.includes('.')) return 'Please enter a valid email address';
    if (email.indexOf('@') > email.lastIndexOf('.')) return 'Please enter a valid email address';
    return '';
  }

  function validatePassword(password: string): string {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    let hasLower = false, hasUpper = false, hasDigit = false;
    for (let i = 0; i < password.length; i++) {
      const c = password[i];
      if (c >= 'a' && c <= 'z') hasLower = true;
      if (c >= 'A' && c <= 'Z') hasUpper = true;
      if (c >= '0' && c <= '9') hasDigit = true;
    }
    if (!hasLower) return 'Password must contain at least one lowercase letter';
    if (!hasUpper) return 'Password must contain at least one uppercase letter';
    if (!hasDigit) return 'Password must contain at least one number';
    return '';
  }

  function validateNID(nid: string): string {
    if (nid.length < 10 || nid.length > 17) return 'NID must be between 10 and 17 digits';
    for (let i = 0; i < nid.length; i++) {
      if (nid[i] < '0' || nid[i] > '9') return 'NID must be between 10 and 17 digits';
    }
    return '';
  }

  function validateNIDImage(file: File | null): string {
    if (!file) return 'NID Image is required';
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) return 'File must be a JPG, JPEG, or PNG image';
    if (file.size > 2 * 1024 * 1024) return 'Image size must be less than 2MB';
    return '';
  }

  function validateForm() {
    const newFieldErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      nid: validateNID(formData.nid),
      nidImage: validateNIDImage(formData.nidImage)
    };
    setFieldErrors(newFieldErrors);
    return !Object.values(newFieldErrors).some(error => error !== '');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('nid', formData.nid);
      if (formData.nidImage) {
        data.append('nidImage', formData.nidImage);
      }

      
      const response = await api.post('/driver/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.status === 201 || response.status === 200) {
        router.push('/driver/login');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (axios.isAxiosError(err)) {
        const statusCode = err.response?.status;
        const responseData = err.response?.data;
        
        console.log('Status Code:', statusCode);
        console.log('Response Data:', responseData);

        if (statusCode === 400) {
          
          const errorMessage = responseData.message;
          if (Array.isArray(errorMessage)) {
            setError(errorMessage.join(', '));
          } else {
            setError(errorMessage || 'Invalid input data');
          }
        } else if (statusCode === 409) {
          setError('A driver with this email or NID already exists');
        } else if (statusCode === 413) {
          setError('File size too large. Please choose a smaller image.');
        } else if (!err.response) {
          setError('Network error: Could not connect to the server. Please check if the backend is running.');
        } else {
          setError(`Error (${statusCode}): ${responseData?.message || 'Failed to register. Please try again.'}`);
        }
      } else {
        console.error('Non-Axios error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Driver Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {Object.values(fieldErrors).some(e => e) && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded mb-4">
              <ul className="list-disc pl-5">
                {Object.entries(fieldErrors).map(([key, val]) => val && (
                  <li key={key}>{val}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                NID Number
              </label>
              <input
                type="text"
               
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.nid}
                onChange={(e) => setFormData({...formData, nid: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                NID Image
              </label>
              <input
                type="file"
                accept="image/*"
                
                className="mt-1 block w-full"
                onChange={(e) => setFormData({...formData, nidImage: e.target.files?.[0] || null})}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-sm text-center">
              Already have an account?{' '}
              <Link href="/driver/login" className="text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}