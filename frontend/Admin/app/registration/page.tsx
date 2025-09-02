'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import NavBar from '../../components/navbar';

interface FormData {
  username: string;
  fullName: string;
  password: string;
  mail: string;
  phone: string;
  address: string;
}

export default function Registration() {
  const styles = {
    container: {
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      padding: '20px',
    },
    formContainer: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
      textAlign: 'center' as const,
      color: '#4a90e2',
      marginBottom: '30px',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#666',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4a90e2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '20px',
    },
    buttonHover: {
      backgroundColor: '#357ABD',
    },
  };

  const [formData, setFormData] = useState<FormData>({
    username: '',
    fullName: '',
    password: '',
    mail: '',
    phone: '',
    address: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    //alert('Registration done');
  };

  return (
    <div>
      <NavBar />
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                style={styles.input}
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="fullName" style={styles.label}>
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                style={styles.input}
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                style={styles.input}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="mail" style={styles.label}>
                Email
              </label>
              <input
                id="mail"
                name="mail"
                type="email"
                style={styles.input}
                placeholder="Enter email"
                value={formData.mail}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="phone" style={styles.label}>
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                style={styles.input}
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="address" style={styles.label}>
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                style={styles.input}
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button type="submit" style={styles.button}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
