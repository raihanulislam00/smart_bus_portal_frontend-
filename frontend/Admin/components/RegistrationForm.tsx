'use client';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { triggerNotification, NOTIFICATION_EVENTS } from '../lib/notificationHelper';

interface FormData {
  name: string;
  mail: string;
  password: string;
  phone: string;
  socialMediaLink: string;
  country: string;
}

interface FormErrors {
  name?: string;
  mail?: string;
  password?: string;
  phone?: string;
  socialMediaLink?: string;
  country?: string;
}

export default function RegistrationForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mail: '',
    password: '',
    phone: '',
    socialMediaLink: '',
    country: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
      
      return () => window.removeEventListener('resize', checkIsMobile);
    }
  }, []);

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const getInputStyle = (fieldName: string, hasError: boolean) => ({
    ...styles.input,
    borderColor: hasError ? '#ef4444' : focusedField === fieldName ? '#667eea' : '#e5e7eb',
    boxShadow: focusedField === fieldName ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none',
    transform: focusedField === fieldName ? 'translateY(-1px)' : 'translateY(0)',
  });

  const getSelectStyle = (fieldName: string, hasError: boolean) => ({
    ...styles.select,
    borderColor: hasError ? '#ef4444' : focusedField === fieldName ? '#667eea' : '#e5e7eb',
    boxShadow: focusedField === fieldName ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none',
    transform: focusedField === fieldName ? 'translateY(-1px)' : 'translateY(0)',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      newErrors.name = 'Name must contain only letters and spaces';
    }

    if (!formData.mail) {
      newErrors.mail = 'Email is required';
    } else if (formData.mail.length < 7) {
      newErrors.mail = 'Email must be at least 7 characters long';
    } else if (formData.mail.length > 50) {
      newErrors.mail = 'Email must not exceed 50 characters';
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    } else if (formData.phone.length > 20) {
      newErrors.phone = 'Phone number must not exceed 20 characters';
    } else if (!/^[\d\+\-\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number can only contain digits, +, -, (), and spaces';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/.*[@#$&].*/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one of these special characters: @, #, $, or &';
    }

    if (!formData.socialMediaLink) {
      newErrors.socialMediaLink = 'Social Media Link is required';
    } else {
      try {
        new URL(formData.socialMediaLink);
      } catch {
        newErrors.socialMediaLink = 'Please enter a valid URL';
      }
    }

    if (formData.country && formData.country.length > 30) {
      newErrors.country = 'Country must not exceed 30 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Call the backend NestJS API for registration
      const response = await fetch('http://localhost:4000/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for CORS
        body: JSON.stringify({
          name: formData.name,
          mail: formData.mail,
          password: formData.password,
          phone: formData.phone,
          socialMediaLink: formData.socialMediaLink,
          country: formData.country || 'Unknown'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      // Trigger registration notification
      triggerNotification(NOTIFICATION_EVENTS.ADMIN_REGISTERED, {
        adminName: formData.name,
        email: formData.mail,
      });

      setSubmitStatus('success');
      
      setFormData({
        name: '',
        mail: '',
        password: '',
        phone: '',
        socialMediaLink: '',
        country: ''
      });
      
      // Show success message and redirect
      alert('Registration successful! You will be redirected to login page.');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setSubmitStatus('error');
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
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
    select: {
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
      cursor: 'pointer',
      WebkitAppearance: 'none' as const,
      MozAppearance: 'none' as const,
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 16px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      paddingRight: '48px',
    },
    error: {
      color: '#ef4444',
      fontSize: '14px',
      marginTop: '6px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
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
      opacity: isSubmitting ? 0.7 : 1,
      transform: isSubmitting ? 'scale(0.98)' : 'scale(1)',
    },
    success: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '16px 20px',
      borderRadius: '12px',
      marginBottom: '24px',
      textAlign: 'center' as const,
      border: '1px solid #bbf7d0',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    errorMessage: {
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
    },
    formFooter: {
      textAlign: 'center' as const,
      marginTop: '32px',
      padding: '20px 0',
      borderTop: '1px solid #e5e7eb',
    },
    loginLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s ease-in-out',
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
      
      {submitStatus === 'success' && (
        <div style={styles.success}>
          <span>✓</span>
          Registration successful! Redirecting to login page...
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div style={styles.errorMessage}>
          <span>⚠</span>
          Registration failed. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Full Name <span style={styles.required}>*</span>
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              style={getInputStyle('name', !!errors.name)}
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <div style={styles.error}>
              <span>⚠</span>
              {errors.name}
            </div>
          )}
        </div>

        <div style={{
          ...styles.row,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        }}>
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
                onFocus={() => handleFocus('mail')}
                onBlur={handleBlur}
                style={getInputStyle('mail', !!errors.mail)}
                placeholder="Enter your email"
              />
            </div>
            {errors.mail && (
              <div style={styles.error}>
                <span>⚠</span>
                {errors.mail}
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Phone Number <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus('phone')}
                onBlur={handleBlur}
                style={getInputStyle('phone', !!errors.phone)}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && (
              <div style={styles.error}>
                <span>⚠</span>
                {errors.phone}
              </div>
            )}
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Social Media Link</label>
          <div style={styles.inputWrapper}>
            <input
              type="url"
              name="socialMediaLink"
              value={formData.socialMediaLink}
              onChange={handleChange}
              onFocus={() => handleFocus('socialMediaLink')}
              onBlur={handleBlur}
              style={getInputStyle('socialMediaLink', !!errors.socialMediaLink)}
              placeholder="https://example.com/profile"
            />
          </div>
          {errors.socialMediaLink && (
            <div style={styles.error}>
              <span>⚠</span>
              {errors.socialMediaLink}
            </div>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Password <span style={styles.required}>*</span>
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              style={getInputStyle('password', !!errors.password)}
              placeholder="Enter your password"
            />
          </div>
          {errors.password && (
            <div style={styles.error}>
              <span>⚠</span>
              {errors.password}
            </div>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Country <span style={styles.required}>*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            onFocus={() => handleFocus('country')}
            onBlur={handleBlur}
            style={getSelectStyle('country', !!errors.country)}
          >
            <option value="">Select Country</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="India">India</option>
            <option value="Pakistan">Pakistan</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
          </select>
          {errors.country && (
            <div style={styles.error}>
              <span>⚠</span>
              {errors.country}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting && <div style={styles.loadingSpinner}></div>}
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div style={styles.formFooter}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Already have an account?{' '}
          <a href="/login" style={styles.loginLink}>
            Login here
          </a>
        </p>
      </div>
    </>
  );
}
