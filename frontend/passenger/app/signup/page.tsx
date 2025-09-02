"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import NavBar from '../../components/navbar';

interface FormData {
  username: string;
  fullName: string;
  password: string;
  mail: string;
  phone: string;
  address: string;
  gender: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    fullName: '',
    password: '',
    mail: '',
    phone: '',
    address: '',
    gender: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    alert('Signup done');
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Username" 
                  value={formData.username} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="fullName" className="sr-only">Full Name</label>
                <input 
                  id="fullName" 
                  name="fullName" 
                  type="text" 
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Full Name" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Password" 
                  value={formData.password} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="mail" className="sr-only">Email</label>
                <input 
                  id="mail" 
                  name="mail" 
                  type="email" 
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Email address" 
                  value={formData.mail} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">Phone</label>
                <input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Phone Number" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="address" className="sr-only">Address</label>
                <input 
                  id="address" 
                  name="address" 
                  type="text" 
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Address" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label htmlFor="gender" className="sr-only">Gender</label>
                <select 
                  id="gender" 
                  name="gender" 
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  value={formData.gender} 
                  onChange={handleChange} 
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

