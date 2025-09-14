'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import busService from '../../../lib/services/busService';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Header from '../../../components/Header';
import { triggerNotification, NOTIFICATION_EVENTS } from '../../../lib/notificationHelper';

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

export default function BusManagement() {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!admin) {
      router.push('/login');
      return;
    }
    fetchBuses();
  }, [admin, router]);

  const fetchBuses = async () => {
    if (!admin) return;
    try {
      const data = await busService.getAllBusesForAdmin(admin.id);
      setBuses(data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    
    try {
      const busData = {
        ...busForm,
        fare: parseFloat(busForm.fare),
        capacity: busForm.capacity ? parseInt(busForm.capacity) : undefined
      };
      const newBus = await busService.createBus(admin.id, {
        busName: busData.busName,
        route: busData.route,
        schedule: busData.schedule,
        fare: busData.fare,
        capacity: busData.capacity || 0
      });
      setBuses([...buses, newBus]);
      setShowAddBus(false);
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
      
      // Trigger bus creation notification
      triggerNotification(NOTIFICATION_EVENTS.BUS_CREATED, {
        busName: busData.busName,
        route: busData.route,
        adminName: admin.name,
      });
      
      alert('Bus added successfully!');
    } catch (error) {
      console.error('Error adding bus:', error);
      alert('Error adding bus');
    }
  };

  const handleEditBus = async (e: React.FormEvent) => {
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
      
      alert('Bus updated successfully!');
    } catch (error) {
      console.error('Error updating bus:', error);
      alert('Error updating bus');
    }
  };

  const handleDeleteBus = async (busId: number) => {
    if (!confirm('Are you sure you want to delete this bus?') || !admin) return;
    
    const busToDelete = buses.find(bus => bus.id === busId);
    
    try {
      await busService.deleteBus(admin.id, busId);
      setBuses(buses.filter(bus => bus.id !== busId));
      
      // Trigger bus deletion notification
      if (busToDelete) {
        triggerNotification(NOTIFICATION_EVENTS.BUS_DELETED, {
          busName: busToDelete.busName,
          route: busToDelete.route,
          adminName: admin.name,
        });
      }
      
      alert('Bus deleted successfully!');
    } catch (error) {
      console.error('Error deleting bus:', error);
      alert('Error deleting bus');
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
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚌</div>
          <p style={{ fontSize: '1.2rem' }}>Loading bus management...</p>
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
            maxWidth: '1200px',
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
                    Bus Management
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Manage your bus fleet and operations
                  </p>
                </div>
                <button
                  className="action-button"
                  onClick={() => setShowAddBus(true)}
                  style={{
                    backgroundColor: '#1e3a8a',
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
                  <span>➕</span> Add New Bus
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px', 
              marginBottom: '30px' 
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                borderRadius: '16px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Total Buses</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{buses.length}</p>
                  </div>
                  <div style={{ fontSize: '3rem', opacity: 0.8 }}>🚌</div>
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                borderRadius: '16px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Active Buses</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                      {buses.filter(bus => bus.status === 'active').length}
                    </p>
                  </div>
                  <div style={{ fontSize: '3rem', opacity: 0.8 }}>✅</div>
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                borderRadius: '16px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Routes Covered</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                      {new Set(buses.map(bus => bus.route)).size}
                    </p>
                  </div>
                  <div style={{ fontSize: '3rem', opacity: 0.8 }}>🗺️</div>
                </div>
              </div>
            </div>

            {/* Bus List */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
            }}>
              {buses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🚌</div>
                  <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '20px' }}>No buses added yet.</p>
                  <button
                    onClick={() => setShowAddBus(true)}
                    style={{
                      backgroundColor: '#1e3a8a',
                      color: 'white',
                      padding: '15px 25px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Add Your First Bus
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb', borderTopLeftRadius: '12px' }}>Bus Name</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Route</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Fare</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Schedule</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Capacity</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb', borderTopRightRadius: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buses.map((bus, index) => (
                        <tr key={bus.id} style={{ 
                          borderBottom: index === buses.length - 1 ? 'none' : '1px solid #e5e7eb',
                          backgroundColor: 'white'
                        }}>
                          <td style={{ padding: '15px' }}>
                            <div style={{ fontWeight: '600', color: '#1f2937' }}>{bus.busName}</div>
                            {bus.numberPlate && <div style={{ fontSize: '14px', color: '#6b7280' }}>{bus.numberPlate}</div>}
                          </td>
                          <td style={{ padding: '15px', color: '#374151' }}>{bus.route}</td>
                          <td style={{ padding: '15px', color: '#374151' }}>৳{formatFare(bus.fare)}</td>
                          <td style={{ padding: '15px', color: '#374151' }}>{bus.schedule}</td>
                          <td style={{ padding: '15px', color: '#374151' }}>{bus.capacity || 'N/A'}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: bus.status === 'active' ? '#d1fae5' : '#fee2e2',
                              color: bus.status === 'active' ? '#065f46' : '#991b1b'
                            }}>
                              {bus.status || 'active'}
                            </span>
                          </td>
                          <td style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => startEditBus(bus)}
                                style={{
                                  backgroundColor: '#dbeafe',
                                  color: '#1e40af',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBus(bus.id)}
                                style={{
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  cursor: 'pointer'
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
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Bus Modal */}
      {showAddBus && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '20px' }}>Add New Bus</h3>
            <form onSubmit={handleAddBus} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Bus Name</label>
                <input
                  type="text"
                  value={busForm.busName}
                  onChange={(e) => setBusForm({ ...busForm, busName: e.target.value })}
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
                  value={busForm.route}
                  onChange={(e) => setBusForm({ ...busForm, route: e.target.value })}
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Fare</label>
                  <input
                    type="number"
                    step="0.01"
                    value={busForm.fare}
                    onChange={(e) => setBusForm({ ...busForm, fare: e.target.value })}
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Capacity</label>
                  <input
                    type="number"
                    value={busForm.capacity}
                    onChange={(e) => setBusForm({ ...busForm, capacity: e.target.value })}
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
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Schedule</label>
                <input
                  type="text"
                  value={busForm.schedule}
                  onChange={(e) => setBusForm({ ...busForm, schedule: e.target.value })}
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
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Number Plate</label>
                <input
                  type="text"
                  value={busForm.numberPlate}
                  onChange={(e) => setBusForm({ ...busForm, numberPlate: e.target.value })}
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
              <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddBus(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px',
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
                  style={{
                    flex: 1,
                    backgroundColor: '#1e3a8a',
                    color: 'white',
                    padding: '12px',
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
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '20px' }}>Edit Bus</h3>
            <form onSubmit={handleEditBus} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Bus Name</label>
                <input
                  type="text"
                  value={busForm.busName}
                  onChange={(e) => setBusForm({ ...busForm, busName: e.target.value })}
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
                  value={busForm.route}
                  onChange={(e) => setBusForm({ ...busForm, route: e.target.value })}
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Fare</label>
                  <input
                    type="number"
                    step="0.01"
                    value={busForm.fare}
                    onChange={(e) => setBusForm({ ...busForm, fare: e.target.value })}
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Capacity</label>
                  <input
                    type="number"
                    value={busForm.capacity}
                    onChange={(e) => setBusForm({ ...busForm, capacity: e.target.value })}
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
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Schedule</label>
                <input
                  type="text"
                  value={busForm.schedule}
                  onChange={(e) => setBusForm({ ...busForm, schedule: e.target.value })}
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
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Number Plate</label>
                <input
                  type="text"
                  value={busForm.numberPlate}
                  onChange={(e) => setBusForm({ ...busForm, numberPlate: e.target.value })}
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
              <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingBus(null)}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px',
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
                  style={{
                    flex: 1,
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '12px',
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
    </>
  );
}
