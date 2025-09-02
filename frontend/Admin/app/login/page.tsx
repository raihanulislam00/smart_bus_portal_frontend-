'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import NavBar from '../../components/navbar';

interface FormData {
  email: string;
  password: string;
}

export default function Signin() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Please fill out all fields');
      return;
    }
  };

  return (
    <div className="container">
      <NavBar />
      <div className="form-wrapper">
        <h2 className="form-title">Sign In</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-btn">Log in</button>
        </form>
      </div>

      <style jsx>{`
        .container {
          background-color: #f0f8ff;
          min-height: 100vh;
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .form-wrapper {
          background-color: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
          margin-top: 40px;
        }

        .form-title {
          text-align: center;
          color: #4a90e2;
          font-size: 24px;
          margin-bottom: 30px;
        }

        .form {
          display: flex;
          flex-direction: column;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .input-group label {
          margin-bottom: 5px;
          color: #333;
          font-size: 14px;
        }

        .input-group input {
          padding: 10px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #ccc;
          outline: none;
          transition: border-color 0.3s;
        }

        .input-group input:focus {
          border-color: #4a90e2;
        }

        .submit-btn {
          padding: 12px;
          background-color: #4a90e2;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
        }

        .submit-btn:hover {
          background-color: #3a78c2;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
