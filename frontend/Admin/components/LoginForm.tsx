'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { triggerNotification, NOTIFICATION_EVENTS } from '../lib/notificationHelper';

interface FormData {
  mail: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    mail: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Only redirect if authenticated AND not currently on login page AND not in the middle of login process
  useEffect(() => {
    if (!isLoading && isAuthenticated && !loading) {
      console.log('User is authenticated, redirecting to dashboard');
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, loading, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.mail || !formData.password) {
      setError('Please fill out all fields');
      return;
    }

    setLoading(true);

    try {
      await login(formData.mail, formData.password);
      
      // Trigger login notification
      triggerNotification(NOTIFICATION_EVENTS.ADMIN_LOGIN, {
        adminName: formData.mail.split('@')[0], // Use email prefix as name for now
        email: formData.mail,
      });
      
      // Redirect will be handled by the useEffect above
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    inputGroup: {
      position: 'relative' as const,
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      letterSpacing: '0.025em',
    },
    required: {
      color: '#ef4444',
      marginLeft: '2px',
    },
    inputWrapper: {
      position: 'relative' as const,
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '400',
      color: '#1f2937',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box' as const,
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    passwordInput: {
      paddingRight: '60px',
    },
    showPasswordButton: {
      position: 'absolute' as const,
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '14px',
      fontWeight: '500',
      padding: '4px',
    },
    submitButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '18px 32px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '12px',
      transition: 'all 0.2s ease-in-out',
      position: 'relative' as const,
      overflow: 'hidden',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      opacity: loading ? 0.7 : 1,
      transform: loading ? 'scale(0.98)' : 'scale(1)',
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '16px 20px',
      borderRadius: '12px',
      marginBottom: '24px',
      textAlign: 'center' as const,
      border: '1px solid #fecaca',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      display: 'inline-block',
      marginRight: '8px',
    },
    formFooter: {
      textAlign: 'center' as const,
      marginTop: '32px',
      padding: '20px 0',
      borderTop: '1px solid #e5e7eb',
    },
    registerLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s ease-in-out',
    },
    forgotPassword: {
      marginTop: '16px',
    },
    forgotPasswordLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
    },
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {error && (
        <div style={styles.error}>
          <span>⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Email <span style={styles.required}>*</span>
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Password <span style={styles.required}>*</span>
          </label>
          <div style={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...styles.passwordInput,
              }}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              style={styles.showPasswordButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* <div style={styles.forgotPassword}>
          <Link href="/forgot-password" style={styles.forgotPasswordLink}>
            Forgot your password?
          </Link>
        </div> */}

        <button
          type="submit"
          style={styles.submitButton}
          disabled={loading}
        >
          {loading && <div style={styles.loadingSpinner}></div>}
          {loading ? 'Signing In...' : 'Login'}
        </button>
      </form>

      <div style={styles.formFooter}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link href="/registration" style={styles.registerLink}>
            Register here
          </Link>
        </p>
      </div>
    </>
  );
}
