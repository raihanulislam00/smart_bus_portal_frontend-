'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import adminService from '../../../lib/services/adminService';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Header from '../../../components/Header';
import { triggerNotification, NOTIFICATION_EVENTS } from '../../../lib/notificationHelper';

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  photo?: string;
  isActive: boolean;
  dateOfBirth: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileSettings() {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<AdminProfile>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!admin) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [admin, router]);

  const fetchProfile = async () => {
    if (!admin) return;
    try {
      const data = await adminService.getProfile(admin.id);
      setProfile(data);
      setProfileForm(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    
    try {
      const updateData = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        address: profileForm.address,
        country: profileForm.country,
        dateOfBirth: profileForm.dateOfBirth,
        gender: profileForm.gender
      };
      
      const updatedProfile = await adminService.updateProfile(admin.id, updateData);
      setProfile(updatedProfile);
      setEditingProfile(false);
      
      // Trigger profile update notification
      triggerNotification(NOTIFICATION_EVENTS.PROFILE_UPDATED, {
        adminName: admin.name,
        updatedFields: Object.keys(updateData),
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!admin) return;
    
    try {
      const updatedProfile = await adminService.updateAdmin(admin.id, { photo: file });
      setProfile(updatedProfile);
      setPhotoFile(null);
      setPhotoPreview(null);
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <p style={{ fontSize: '1.2rem' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .action-button:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        .photo-upload-container {
          position: relative;
          display: inline-block;
        }
        
        .photo-upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          cursor: pointer;
          color: white;
          font-size: 14px;
        }
        
        .photo-upload-container:hover .photo-upload-overlay {
          opacity: 1;
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #e6f0ff, #f9f9ff)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navbar />
        <Header />
        
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: '#1e3a8a', 
                    marginBottom: '8px' 
                  }}>
                    Profile Settings
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Manage your account information and preferences
                  </p>
                </div>
                <button
                  className="action-button"
                  onClick={() => setEditingProfile(!editingProfile)}
                  style={{
                    backgroundColor: editingProfile ? '#6b7280' : '#1e3a8a',
                    color: 'white',
                    padding: '15px 25px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{editingProfile ? '❌' : '✏️'}</span> 
                  {editingProfile ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
            }}>
              {editingProfile ? (
                // Edit Form
                <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Photo Upload Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div className="photo-upload-container">
                      <div style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: photoPreview ? 'transparent' : '#1e3a8a',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        backgroundImage: photoPreview ? `url(${photoPreview})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}>
                        {!photoPreview && (profile?.name?.charAt(0) || '?')}
                        <div className="photo-upload-overlay">
                          📷 Upload
                        </div>
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      style={{
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        border: '2px dashed #d1d5db'
                      }}
                    >
                      Choose Photo
                    </label>
                    
                    {photoFile && (
                      <button
                        type="button"
                        onClick={() => handlePhotoUpload(photoFile)}
                        style={{
                          backgroundColor: '#059669',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Upload Photo
                      </button>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '25px' 
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Name</label>
                      <input
                        type="text"
                        value={profileForm.name || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        style={{
                          width: '100%',
                          border: '2px solid #d1d5db',
                          borderRadius: '12px',
                          padding: '15px 20px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                        required
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email</label>
                      <input
                        type="email"
                        value={profileForm.email || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        style={{
                          width: '100%',
                          border: '2px solid #d1d5db',
                          borderRadius: '12px',
                          padding: '15px 20px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                        required
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Phone</label>
                      <input
                        type="text"
                        value={profileForm.phone || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        style={{
                          width: '100%',
                          border: '2px solid #d1d5db',
                          borderRadius: '12px',
                          padding: '15px 20px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Country</label>
                      <input
                        type="text"
                        value={profileForm.country || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        style={{
                          width: '100%',
                          border: '2px solid #d1d5db',
                          borderRadius: '12px',
                          padding: '15px 20px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Date of Birth</label>
                      <input
                        type="date"
                        value={profileForm.dateOfBirth || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                        style={{
                          width: '100%',
                          border: '2px solid #d1d5db',
                          borderRadius: '12px',
                          padding: '15px 20px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Gender</label>
                      <select
                        value={profileForm.gender || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        style={{
                          width: '100%',
                          border: '2px solid #d1d5db',
                          borderRadius: '12px',
                          padding: '15px 20px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Address</label>
                    <textarea
                      value={profileForm.address || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      style={{
                        width: '100%',
                        border: '2px solid #d1d5db',
                        borderRadius: '12px',
                        padding: '15px 20px',
                        fontSize: '16px',
                        outline: 'none',
                        minHeight: '120px',
                        resize: 'vertical',
                        transition: 'border-color 0.3s ease'
                      }}
                      placeholder="Enter your full address"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '15px 30px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                // View Profile
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Profile Header with Photo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px', paddingBottom: '25px', borderBottom: '2px solid #f3f4f6' }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#1e3a8a',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      boxShadow: '0 8px 20px rgba(30, 58, 138, 0.3)'
                    }}>
                      {profile?.name?.charAt(0)}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>{profile?.name}</h2>
                      <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: '0 0 8px 0' }}>{profile?.email}</p>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: profile?.isActive ? '#d1fae5' : '#fee2e2',
                        color: profile?.isActive ? '#065f46' : '#991b1b',
                        display: 'inline-block'
                      }}>
                        {profile?.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Details */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '25px'
                  }}>
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Phone Number</h4>
                      <p style={{ color: '#1f2937', fontSize: '16px', margin: 0 }}>{profile?.phone || 'Not provided'}</p>
                    </div>
                    
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Country</h4>
                      <p style={{ color: '#1f2937', fontSize: '16px', margin: 0 }}>{profile?.country || 'Not provided'}</p>
                    </div>
                    
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Date of Birth</h4>
                      <p style={{ color: '#1f2937', fontSize: '16px', margin: 0 }}>
                        {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Gender</h4>
                      <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, textTransform: 'capitalize' }}>
                        {profile?.gender || 'Not specified'}
                      </p>
                    </div>
                    
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Member Since</h4>
                      <p style={{ color: '#1f2937', fontSize: '16px', margin: 0 }}>
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Last Updated</h4>
                      <p style={{ color: '#1f2937', fontSize: '16px', margin: 0 }}>
                        {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Address Section */}
                  {profile?.address && (
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Address</h4>
                      <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, lineHeight: 1.6 }}>{profile.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
