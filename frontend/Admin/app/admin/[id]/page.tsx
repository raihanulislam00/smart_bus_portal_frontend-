'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/navbar';
import Header from '../../../components/Header';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminData {
  id: string;
  name: string;
  mail: string;
  email?: string;
  phone?: string;
  country?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDetails() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;
  const { admin: authAdmin } = useAuth();
  
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authAdmin) {
      router.push('/login');
      return;
    }

    // Check if the requested admin ID matches the authenticated admin
    if (authAdmin.id.toString() === adminId) {
      setAdmin(authAdmin as unknown as AdminData);
    } else {
      router.push(`/admin/${authAdmin.id}`);
      return;
    }
    
    setLoading(false);
  }, [authAdmin, router, adminId]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #e6f0ff, #f9f9ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#1e3a8a' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👤</div>
          <p style={{ fontSize: '1.2rem' }}>Loading admin details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e6f0ff, #f9f9ff)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* <Navbar />
      <Header /> */}
      
      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Header Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          }}>
            {/* <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => router.push('/admin/dashboard')}
                style={{
                  backgroundColor: 'white',
                  color: '#1e3a8a',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '2px solid #1e3a8a',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ← Back to Dashboard
              </button>
            </div> */}
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#1e3a8a', 
              marginBottom: '8px' 
            }}>
              Admin Details
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Your administrative account information
            </p>
          </div>

          {/* Admin Information Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          }}>
            {/* Profile Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '25px', 
              marginBottom: '30px',
              paddingBottom: '25px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#1e3a8a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(30, 58, 138, 0.3)'
              }}>
                {admin?.name?.charAt(0) || '?'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  {admin?.name || 'Unknown Admin'}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
                  {admin?.email || 'No email provided'}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '25px' 
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Admin ID
                </h4>
                <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>
                  {admin?.id || 'N/A'}
                </p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Email Address
                </h4>
                <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>
                  {admin?.email || admin?.mail || 'Not provided'}
                </p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Phone Number
                </h4>
                <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>
                  {admin?.phone || 'Not provided'}
                </p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Country
                </h4>
                <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>
                  {admin?.country || 'Not specified'}
                </p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Account Created
                </h4>
                <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>
                  {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Last Updated
                </h4>
                <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>
                  {admin?.updatedAt ? new Date(admin.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Address Section */}
            {admin?.address && (
              <div style={{
                marginTop: '25px',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Address
                </h4>
                <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, lineHeight: 1.6, fontWeight: '500' }}>
                  {admin.address}
                </p>
              </div>
            )}

            <div style={{ 
              marginTop: '30px', 
              paddingTop: '25px', 
              borderTop: '2px solid #f3f4f6',
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              
              <button
                onClick={() => router.push('/admin/dashboard')}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📊 Go to Dashboard 
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}