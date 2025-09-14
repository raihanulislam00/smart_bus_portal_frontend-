'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import adminService from '../../../lib/services/adminService';
import busService from '../../../lib/services/busService';
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

interface Bus {
  id: number;
  busName: string;
  route: string;
  fare: number;
  schedule: string;
  capacity?: number;
  model?: string;
  status?: string;
  numberPlate?: string;
}

// Helper function to format fare safely
const formatFare = (fare: any): string => {
  const numericFare = Number(fare);
  return isNaN(numericFare) ? '0.00' : numericFare.toFixed(2);
};

// Helper function to calculate total revenue safely
const calculateTotalRevenue = (buses: Bus[]): string => {
  const total = buses.reduce((sum, bus) => {
    const fare = Number(bus.fare);
    return sum + (isNaN(fare) ? 0 : fare);
  }, 0);
  return total.toFixed(2);
};

export default function AdminDashboard() {
  const { admin, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<AdminProfile>>({});
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [busForm, setBusForm] = useState({
    busName: '',
    route: '',
    fare: '',
    schedule: '',
    capacity: '',
    model: '',
    status: 'active',
    numberPlate: ''
  });
  const [showAddBus, setShowAddBus] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Wait for auth to finish loading before making redirect decisions
    if (authLoading) {
      return; // Still loading, don't make any decisions yet
    }
    
    if (!admin) {
      console.log('No admin found, redirecting to login');
      router.replace('/login');
      return;
    }
    
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        
        // Set a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Dashboard loading timeout - backend may not be running')), 5000);
        });
        
        const dataPromise = Promise.all([fetchProfile(), fetchBuses()]);
        
        await Promise.race([dataPromise, timeoutPromise]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        // Even if there's an error, we should still show the dashboard
        // The individual components can handle missing data
      } finally {
        setLoading(false);
      }
    };
    
    initializeDashboard();
  }, [admin, authLoading, router]);

  const fetchProfile = async () => {
    if (!admin) return;
    try {
      console.log('Fetching profile for admin:', admin.id);
      const data = await adminService.getProfile(admin.id);
      console.log('Profile data received:', data);
      setProfile(data);
      setProfileForm(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchBuses = async () => {
    if (!admin) return;
    try {
      console.log('Fetching buses for admin:', admin.id);
      const data = await busService.getAllBusesForAdmin(admin.id);
      console.log('Buses data received:', data);
      setBuses(data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin || !profile) return;
    try {
      const updateData: any = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        country: profileForm.country,
        address: profileForm.address,
        dateOfBirth: profileForm.dateOfBirth,
        gender: profileForm.gender
      };
      
      // Add photo if selected
      if (selectedPhoto) {
        updateData.photo = selectedPhoto;
      }
      
      const updatedProfile = await adminService.updateProfile(admin.id, updateData);
      
      // Update the local state and context
      setProfile(updatedProfile);
      setEditingProfile(false);
      setSelectedPhoto(null);
      
      // Update the profile form with new data
      setProfileForm(updatedProfile);
      
      // Trigger profile update notification
      triggerNotification(NOTIFICATION_EVENTS.PROFILE_UPDATED, {
        adminName: admin.name,
        updatedFields: Object.keys(updateData),
      });
      
      //alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      //alert('Error updating profile. Please try again.');
    }
  };

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    try {
      const busData = {
        busName: busForm.busName,
        route: busForm.route,
        schedule: busForm.schedule,
        fare: parseFloat(busForm.fare),
        capacity: parseInt(busForm.capacity) || 0
      };
      const newBus = await busService.createBus(admin.id, busData);
      setBuses([...buses, newBus]);
      setBusForm({
        busName: '',
        route: '',
        fare: '',
        schedule: '',
        capacity: '',
        model: '',
        status: 'active',
        numberPlate: ''
      });
      setShowAddBus(false);
      
      // Trigger bus creation notification
      triggerNotification(NOTIFICATION_EVENTS.BUS_CREATED, {
        busName: busData.busName,
        route: busData.route,
        adminName: admin.name,
      });
      
      //alert('Bus added successfully!');
    } catch (error) {
      console.error('Error adding bus:', error);
      alert('Error adding bus. Please try again.');
    }
  };

  const handleUpdateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBus || !admin) return;
    try {
      const busData = {
        ...busForm,
        fare: parseFloat(busForm.fare),
        capacity: busForm.capacity ? parseInt(busForm.capacity) : undefined
      };
      const updatedBus = await busService.updateBus(admin.id, editingBus.id, busData);
      setBuses(buses.map(bus => bus.id === editingBus.id ? updatedBus : bus));
      setEditingBus(null);
      setBusForm({
        busName: '',
        route: '',
        fare: '',
        schedule: '',
        capacity: '',
        model: '',
        status: 'active',
        numberPlate: ''
      });
      
      // Trigger bus update notification
      triggerNotification(NOTIFICATION_EVENTS.BUS_UPDATED, {
        busName: busData.busName,
        route: busData.route,
        adminName: admin.name,
      });
      
      //alert('Bus updated successfully!');
    } catch (error) {
      console.error('Error updating bus:', error);
      //alert('Error updating bus. Please try again.');
    }
  };

  const handleDeleteBus = async (busId: number) => {
    if (!confirm('Are you sure you want to delete this bus?') || !admin) return;
    try {
      // Find the bus to get its name for the notification
      const busToDelete = buses.find(bus => bus.id === busId);
      
      await busService.deleteBus(admin.id, busId);
      setBuses(buses.filter(bus => bus.id !== busId));
      
      // Trigger bus deletion notification
      if (busToDelete) {
        triggerNotification(NOTIFICATION_EVENTS.BUS_DELETED, {
          busName: busToDelete.busName,
          adminName: admin.name,
        });
      }
      
      //alert('Bus deleted successfully!');
    } catch (error) {
      console.error('Error deleting bus:', error);
      //alert('Error deleting bus. Please try again.');
    }
  };

  const startEditBus = (bus: Bus) => {
    setEditingBus(bus);
    setBusForm({
      busName: bus.busName,
      route: bus.route,
      fare: bus.fare.toString(),
      schedule: bus.schedule,
      capacity: bus.capacity?.toString() || '',
      model: bus.model || '',
      status: bus.status || 'active',
      numberPlate: bus.numberPlate || ''
    });
  };

  // Show loading while auth is being verified or dashboard data is loading
  if (authLoading || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ color: '#64748b', fontSize: '16px' }}>
          {authLoading ? 'Verifying authentication...' : 'Loading Dashboard...'}
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!admin) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ color: '#64748b', fontSize: '16px' }}>
          Redirecting to login...
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 280px;
          background: linear-gradient(180deg, #1a1d29 0%, #2d3748 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          z-index: 1000;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 30px 25px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .admin-badge {
          display: inline-block;
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .main-content {
          margin-left: 280px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        }

        .top-bar {
          background: white;
          padding: 20px 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        .content-area {
          padding: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .stats-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.8);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .stats-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .stats-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .stats-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stats-number {
          font-size: 36px;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .stats-label {
          font-size: 16px;
          color: #718096;
          font-weight: 500;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 15px 25px;
          margin: 8px 15px;
          border-radius: 16px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .nav-item:hover, .nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .nav-icon {
          margin-right: 15px;
          font-size: 20px;
        }

        .content-section {
          background: white;
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.8);
          margin-bottom: 30px;
        }

        .section-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f7fafc;
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: #f7fafc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .btn-secondary:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }

        .table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          background: #f8fafc;
          padding: 20px;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 2px solid #e2e8f0;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .table td {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
          color: #2d3748;
        }

        .table tr:hover {
          background: #f8fafc;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-active {
          background: #f0fff4;
          color: #38a169;
        }

        .status-inactive {
          background: #fef5e7;
          color: #d69e2e;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          padding: 40px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          padding: 15px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .input-field {
          width: 100%;
          padding: 15px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .input-field:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .logout-btn {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 101, 101, 0.3);
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo"> Smart Bus Portal</div>
            <div className="admin-badge">Admin Panel</div>
          </div>
          
          <nav style={{ padding: '20px 0' }}>
            <div 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </div>
            <div 
              className={`nav-item ${activeTab === 'buses' ? 'active' : ''}`}
              onClick={() => setActiveTab('buses')}
            >
              <span className="nav-icon">🚌</span>
              Manage Buses
            </div>
            <div 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              Profile Settings
            </div>
            <div 
              className="nav-item"
              onClick={logout}
              style={{ 
                marginTop: '30px',
                background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                color: 'white'
              }}
            >
              <span className="nav-icon">🚪</span>
              Logout
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="top-bar">
            <h1 className="page-title">
              {activeTab === 'dashboard' && ' Dashboard Overview'}
              {activeTab === 'buses' && ' Bus Management'}
              {activeTab === 'profile' && ' Profile Settings'}
            </h1>
            <div className="user-info">
              <div>
                <div style={{ fontWeight: '600', color: '#2d3748' }}>
                  Welcome back, {admin?.name || 'Admin'}
                </div>
                <div style={{ fontSize: '14px', color: '#718096' }}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="user-avatar">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>

          <div className="content-area">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <>
                {/* Stats Grid */}
                <div className="stats-grid">
                  <div className="stats-card">
                    <div className="stats-icon">🚌</div>
                    <div className="stats-number">{buses.length}</div>
                    <div className="stats-label">Total Buses</div>
                  </div>
                  <div className="stats-card">
                    <div className="stats-icon">✅</div>
                    <div className="stats-number">{buses.filter(bus => bus.status === 'active').length}</div>
                    <div className="stats-label">Active Buses</div>
                  </div>
                  <div className="stats-card">
                    <div className="stats-icon">👥</div>
                    <div className="stats-number">{buses.reduce((sum, bus) => sum + (bus.capacity || 0), 0)}</div>
                    <div className="stats-label">Total Capacity</div>
                  </div>
                  <div className="stats-card">
                    <div className="stats-icon">💰</div>
                    <div className="stats-number">৳{calculateTotalRevenue(buses)}</div>
                    <div className="stats-label">Total Revenue</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="content-section">
                  <div className="section-header">
                    <button 
                      className="btn-primary"
                      onClick={() => setActiveTab('buses')}
                    >
                      View All Buses
                    </button>
                  </div>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Bus Name</th>
                          <th>Route</th>
                          <th>Fare</th>
                          <th>Status</th>
                          <th>Capacity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buses.slice(0, 5).map(bus => (
                          <tr key={bus.id}>
                            <td style={{ fontWeight: '600' }}>{bus.busName}</td>
                            <td>{bus.route}</td>
                            <td style={{ fontWeight: '600', color: '#38a169' }}>৳{formatFare(bus.fare)}</td>
                            <td>
                              <span className={`status-badge ${bus.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                {bus.status || 'active'}
                              </span>
                            </td>
                            <td>{bus.capacity || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Bus Management Tab */}
            {activeTab === 'buses' && (
              <div className="content-section">
                <div className="section-header">
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddBus(true)}
                  >
                     Add New Bus
                  </button>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Bus Name</th>
                        <th>Route</th>
                        <th>Number Plate</th>
                        <th>Model</th>
                        <th>Fare</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th>Schedule</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buses.map(bus => (
                        <tr key={bus.id}>
                          <td style={{ fontWeight: '600' }}>{bus.busName}</td>
                          <td>{bus.route}</td>
                          <td style={{ fontFamily: 'monospace', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>
                            {bus.numberPlate || 'N/A'}
                          </td>
                          <td>{bus.model || 'N/A'}</td>
                          <td style={{ fontWeight: '600', color: '#38a169' }}>৳{formatFare(bus.fare)}</td>
                          <td>{bus.capacity || 'N/A'}</td>
                          <td>
                            <span className={`status-badge ${bus.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                              {bus.status || 'active'}
                            </span>
                          </td>
                          <td>{bus.schedule}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                className="btn-secondary"
                                onClick={() => startEditBus(bus)}
                                style={{ padding: '8px 12px', fontSize: '12px' }}
                              >
                                 Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteBus(bus.id)}
                                style={{ 
                                  background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="content-section">
                <div className="section-header">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => router.push(`/admin/${admin?.id}`)}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🔍 View Full Profile
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setEditingProfile(!editingProfile);
                        if (editingProfile) {
                          setSelectedPhoto(null);
                        }
                      }}
                    >
                      {editingProfile ? ' Cancel' : ' Edit Profile'}
                    </button>
                  </div>
                </div>

                {editingProfile ? (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileForm.name || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          value={profileForm.email || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={profileForm.phone || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileForm.country || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-input"
                          value={profileForm.dateOfBirth ? profileForm.dateOfBirth.split('T')[0] : ''}
                          onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-input"
                          value={profileForm.gender || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-input"
                        value={profileForm.address || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        rows={3}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Profile Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedPhoto(file);
                          }
                        }}
                      />
                      {selectedPhoto && (
                        <div style={{ 
                          marginTop: '10px', 
                          padding: '10px', 
                          background: '#f0fff4', 
                          borderRadius: '8px',
                          color: '#38a169',
                          fontSize: '14px'
                        }}>
                          ✅ Selected: {selectedPhoto.name}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
                      <button type="button" className="btn-secondary" onClick={() => setEditingProfile(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                         Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '20px',
                      background: profile?.photo 
                        ? 'transparent' 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px',
                      fontWeight: '700',
                      overflow: 'hidden',
                      border: '4px solid #f7fafc',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }}>
                      {profile?.photo ? (
                        <img 
                          src={`http://localhost:4000/uploads/photos/${profile.photo}`} 
                          alt="Profile" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                              parent.innerHTML = profile?.name?.charAt(0) || 'A';
                            }
                          }}
                        />
                      ) : (
                        profile?.name?.charAt(0) || 'A'
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '32px', 
                        fontWeight: '700', 
                        color: '#1a202c', 
                        margin: '0 0 10px 0' 
                      }}>
                        {profile?.name}
                      </h3>
                      <p style={{ 
                        color: '#718096', 
                        fontSize: '18px', 
                        margin: '0 0 30px 0' 
                      }}>
                        Administrator
                      </p>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                        gap: '25px' 
                      }}>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📧 Email</h4>
                          <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>{profile?.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📱 Phone</h4>
                          <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>{profile?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🌍 Country</h4>
                          <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>{profile?.country || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎂 Date of Birth</h4>
                          <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚧️ Gender</h4>
                          <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>{profile?.gender || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📅 Member Since</h4>
                          <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      
                      {profile?.address && (
                        <div style={{ marginTop: '25px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Address</h4>
                          <p style={{ color: '#1f2937', fontSize: '16px', margin: 0, fontWeight: '500' }}>{profile.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Bus Modal */}
      {showAddBus && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '25px' }}>Add New Bus</h3>
            <form onSubmit={handleAddBus} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Bus Name</label>
                <input
                  type="text"
                  value={busForm.busName || ''}
                  onChange={(e) => setBusForm({ ...busForm, busName: e.target.value })}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Route</label>
                <input
                  type="text"
                  value={busForm.route || ''}
                  onChange={(e) => setBusForm({ ...busForm, route: e.target.value })}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Fare ($)</label>
                  <input
                    type="number"
                    value={busForm.fare || ''}
                    onChange={(e) => setBusForm({ ...busForm, fare: e.target.value })}
                    className="input-field"
                    style={{
                      width: '100%',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Capacity</label>
                  <input
                    type="number"
                    value={busForm.capacity || ''}
                    onChange={(e) => setBusForm({ ...busForm, capacity: e.target.value })}
                    className="input-field"
                    style={{
                      width: '100%',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Schedule</label>
                <input
                  type="text"
                  value={busForm.schedule || ''}
                  onChange={(e) => setBusForm({ ...busForm, schedule: e.target.value })}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  placeholder="e.g., Every 30 minutes"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Number Plate (Optional)</label>
                <input
                  type="text"
                  value={busForm.numberPlate || ''}
                  onChange={(e) => setBusForm({ ...busForm, numberPlate: e.target.value })}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddBus(false)}
                  className="cancel-button"
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="action-button success-button"
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Add Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bus Modal */}
      {editingBus && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '25px' }}>Edit Bus</h3>
            <form onSubmit={handleUpdateBus} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Bus Name</label>
                <input
                  type="text"
                  value={busForm.busName || ''}
                  onChange={(e) => setBusForm({ ...busForm, busName: e.target.value })}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Route</label>
                <input
                  type="text"
                  value={busForm.route || ''}
                  onChange={(e) => setBusForm({ ...busForm, route: e.target.value })}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Fare ($)</label>
                  <input
                    type="number"
                    value={busForm.fare || ''}
                    onChange={(e) => setBusForm({ ...busForm, fare: e.target.value })}
                    className="input-field"
                    style={{
                      width: '100%',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Capacity</label>
                  <input
                    type="number"
                    value={busForm.capacity || ''}
                    onChange={(e) => setBusForm({ ...busForm, capacity: e.target.value })}
                    className="input-field"
                    style={{
                      width: '100%',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Schedule</label>
                <input
                  type="text"
                  value={busForm.schedule || ''}
                  onChange={(e) => setBusForm({ ...busForm, schedule: e.target.value })}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  placeholder="e.g., Every 30 minutes"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Number Plate (Optional)</label>
                <input
                  type="text"
                  value={busForm.numberPlate || ''}
                  onChange={(e) => setBusForm({ ...busForm, numberPlate: e.target.value })}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setEditingBus(null)}
                  className="cancel-button"
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="action-button success-button"
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Update Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
