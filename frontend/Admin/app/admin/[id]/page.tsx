'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../../components/navbar';

interface AdminData {
  username: string;
  fullName: string;
  mail: string;
  phone: string;
  address: string;
}

export default function AdminDetails({
  params,
}: {
  params: { id: string };
}) {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setId(resolvedParams.id);
      
      const mockAdminData: AdminData = {
        username: `admin_${resolvedParams.id}`,
        fullName: `Admin ${resolvedParams.id}`,
        mail: `admin${resolvedParams.id}@bus.com`,
        phone: `01632641440`,
        address: `${resolvedParams.id} Kuril, Dhaka`,
      };

      setAdmin(mockAdminData);
    };

    resolveParams();
  }, [params]);

  const styles = {
    container: {
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      paddingTop: '20px'
    },
    content: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
      textAlign: 'center' as const,
      color: '#4a90e2',
      marginBottom: '30px',
      fontSize: '28px'
    },
    fieldContainer: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    label: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    value: {
      fontSize: '16px',
      color: '#333'
    },
    loading: {
      textAlign: 'center' as const,
      padding: '50px',
      fontSize: '18px',
      color: '#666'
    }
  };

  if (!admin || !id) {
    return (
      <div style={styles.container}>
        <NavBar />
        <div style={styles.loading}>
          Loading admin details...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <NavBar />
      <div style={styles.content}>
        <h1 style={styles.title}>Admin Details</h1>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Admin ID: {id}
        </p>

        <div style={styles.fieldContainer}>
          <div style={styles.label}>Username</div>
          <div style={styles.value}>{admin.username}</div>
        </div>

        <div style={styles.fieldContainer}>
          <div style={styles.label}>Full Name</div>
          <div style={styles.value}>{admin.fullName}</div>
        </div>

        <div style={styles.fieldContainer}>
          <div style={styles.label}>Email Address</div>
          <div style={styles.value}>{admin.mail}</div>
        </div>

        <div style={styles.fieldContainer}>
          <div style={styles.label}>Phone Number</div>
          <div style={styles.value}>{admin.phone}</div>
        </div>

        <div style={styles.fieldContainer}>
          <div style={styles.label}>Address</div>
          <div style={styles.value}>{admin.address}</div>
        </div>
      </div>
    </div>
  );
}
