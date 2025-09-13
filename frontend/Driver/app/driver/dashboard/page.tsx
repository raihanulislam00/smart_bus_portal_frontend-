'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Pusher from 'pusher-js';

interface DriverData {
  id: number;
  name: string;
  email: string;
  nid: string;
  nidImage?: string;
  createdAt?: string;
  updatedAt?: string;
  bus?: {
    id: number;
    busNumber: string;
    route: string;
  };
}

interface EditFormData {
  name: string;
  email: string;
  nid: string;
  password?: string;
  nidImage?: File;
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}


// Ticket interface removed

export default function DriverDashboard() {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    email: '',
    nid: '',
    password: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // States for all drivers table
  const [allDrivers, setAllDrivers] = useState<DriverData[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState('');
  const [showDriversTable, setShowDriversTable] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  
  // Pusher and Notifications states
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    // Check if driver is logged in
    const driverString = localStorage.getItem('driver');
    if (!driverString) {
      router.push('/driver/login');
      return;
    }
    try {
      const driver = JSON.parse(driverString);
      setDriverData(driver);
      // Initialize edit form data with current driver data
      setEditFormData({
        name: driver.name || '',
        email: driver.email || '',
        nid: driver.nid || '',
        password: '',
      });
      
      // Initialize Pusher connection
      initializePusher(driver.id);
    } catch (error) {
      console.error('Error parsing driver data:', error);
      handleLogout();
    }
    setLoading(false);
  }, [router]);

  // Initialize Pusher connection
  const initializePusher = (driverId: number) => {
    try {
      // For demo purposes, we'll use a mock connection
      // Replace with actual Pusher credentials in production
      const DEMO_MODE = true; // Set to false when using real Pusher
      
      if (DEMO_MODE) {
        // Demo mode - show connection notification
        setTimeout(() => {
          addNotification({
            type: 'info',
            title: '🚀 Demo Mode Active',
            message: 'Notifications are working in demo mode. Configure Pusher for real-time updates.',
          });
        }, 1000);
        return;
      }

      // Real Pusher implementation (when DEMO_MODE is false)
      const pusherInstance = new Pusher('your-pusher-app-key', {
        cluster: 'your-pusher-cluster', // e.g., 'us2', 'eu', 'ap3'
        forceTLS: true,
      });

      // Subscribe to driver-specific channel
      const channel = pusherInstance.subscribe(`driver-${driverId}`);

      // Listen for driver update events
      channel.bind('driver-updated', (data: any) => {
        console.log('Received driver update notification:', data);
        addNotification({
          type: 'success',
          title: 'Profile Updated!',
          message: data.message || `Your ${data.field} has been successfully updated.`,
        });

        // Update local driver data if provided
        if (data.updatedData) {
          setDriverData(prevData => ({ ...prevData, ...data.updatedData }));
        }
      });

      // Listen for name update events
      channel.bind('name-updated', (data: any) => {
        console.log('Received name update notification:', data);
        addNotification({
          type: 'info',
          title: 'Name Updated!',
          message: `Your name has been changed to "${data.newName}".`,
        });
      });

      // Listen for NID update events
      channel.bind('nid-updated', (data: any) => {
        console.log('Received NID update notification:', data);
        addNotification({
          type: 'info',
          title: 'NID Updated!',
          message: `Your NID has been updated to "${data.newNid}".`,
        });
      });

      // Listen for general notifications
      channel.bind('notification', (data: any) => {
        console.log('Received general notification:', data);
        addNotification({
          type: data.type || 'info',
          title: data.title || 'Notification',
          message: data.message,
        });
      });

      setPusher(pusherInstance);

      // Add connection status notifications
      pusherInstance.connection.bind('connected', () => {
        console.log('Pusher connected');
        addNotification({
          type: 'success',
          title: 'Connected!',
          message: 'Real-time notifications are now active.',
        });
      });

      pusherInstance.connection.bind('error', (error: any) => {
        console.error('Pusher connection error:', error);
        addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'Failed to connect to notification service.',
        });
      });

    } catch (error) {
      console.error('Error initializing Pusher:', error);
      addNotification({
        type: 'warning',
        title: 'Notification Service Unavailable',
        message: 'Real-time notifications are currently disabled.',
      });
    }
  };

  // Add notification function
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only 5 most recent
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  // Remove notification function
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Cleanup Pusher connection on unmount
  useEffect(() => {
    return () => {
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, [pusher]);

  // Handle edit mode toggle
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      setEditFormData({
        name: driverData?.name || '',
        email: driverData?.email || '',
        nid: driverData?.nid || '',
        password: '',
      });
      setSelectedFile(null);
      setUpdateError('');
      setUpdateSuccess('');
    }
    setIsEditing(!isEditing);
  };

  // Handle input changes in edit form
  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/\.(jpg|jpeg|png)$/i)) {
        setUpdateError('Only JPG, JPEG, or PNG files are allowed');
        return;
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setUpdateError('File size must be less than 2MB');
        return;
      }
      setSelectedFile(file);
      setUpdateError('');
    }
  };

  // Handle form submission
  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!driverData) return;

    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const token = localStorage.getItem('driverToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate required fields
      if (!editFormData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!editFormData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!editFormData.nid.trim()) {
        throw new Error('NID is required');
      }

      // Validate name format (only letters and spaces)
      if (!/^[A-Za-z\s]+$/.test(editFormData.name.trim())) {
        throw new Error('Name must contain only letters and spaces');
      }

      // Validate NID format (10-17 digits)
      if (!/^\d{10,17}$/.test(editFormData.nid.trim())) {
        throw new Error('NID must be between 10 to 17 digits');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFormData.email.trim())) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password if provided
      if (editFormData.password && editFormData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create FormData for multipart request
      const formData = new FormData();
      
      // Always send all fields to ensure proper validation
      formData.append('name', editFormData.name.trim());
      formData.append('email', editFormData.email.trim());
      formData.append('nid', editFormData.nid.trim());
      
      // Only add password if provided
      if (editFormData.password && editFormData.password.trim()) {
        formData.append('password', editFormData.password.trim());
      }
      
      // Add file if selected
      if (selectedFile) {
        formData.append('nidImage', selectedFile);
      }

      console.log('Updating driver with ID:', driverData.id);
      
      const response = await axios.patch(
        `http://localhost:3004/driver/${driverData.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      console.log('Update response:', response.data);

      // Update local state with new data
      const updatedDriver = { ...driverData, ...response.data.data };
      setDriverData(updatedDriver);
      
      // Update localStorage
      localStorage.setItem('driver', JSON.stringify(updatedDriver));

      setUpdateSuccess(response.data.message || 'Driver information updated successfully!');
      
      // Trigger notifications for specific field updates
      if (editFormData.name !== driverData.name) {
        addNotification({
          type: 'success',
          title: '🎉 Name Updated!',
          message: `Your name has been successfully changed from "${driverData.name}" to "${editFormData.name}".`,
        });
      }
      
      if (editFormData.nid !== driverData.nid) {
        addNotification({
          type: 'success',
          title: '🆔 NID Updated!',
          message: `Your NID has been successfully updated to "${editFormData.nid}".`,
        });
      }
      
      if (editFormData.email !== driverData.email) {
        addNotification({
          type: 'info',
          title: '📧 Email Updated!',
          message: `Your email has been changed to "${editFormData.email}".`,
        });
      }
      
      if (selectedFile) {
        addNotification({
          type: 'info',
          title: '🖼️ NID Image Updated!',
          message: 'Your NID image has been successfully uploaded.',
        });
      }
      
      if (editFormData.password && editFormData.password.trim()) {
        addNotification({
          type: 'success',
          title: '🔒 Password Updated!',
          message: 'Your password has been successfully changed.',
        });
      }

      setIsEditing(false);
      setSelectedFile(null);
      
      // Reset password field
      setEditFormData(prev => ({ ...prev, password: '' }));

      // Refresh drivers table if it's open
      if (showDriversTable) {
        fetchAllDrivers();
      }

    } catch (error: any) {
      console.error('Update error:', error);
      
      let errorMessage = 'Failed to update driver information. Please try again.';
      
      if (error.message && !error.response) {
        // Client-side validation error
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        // Server error with message
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join(', ');
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your input and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        // Redirect to login
        handleLogout();
        return;
      } else if (error.response?.status === 404) {
        errorMessage = 'Driver not found. Please refresh the page.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email already exists. Please use a different email.';
      }
      
      setUpdateError(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Fetch all drivers
  const fetchAllDrivers = async () => {
    setDriversLoading(true);
    setDriversError('');

    try {
      const token = localStorage.getItem('driverToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:3004/driver/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      });

      setAllDrivers(response.data);
    } catch (error: any) {
      console.error('Fetch drivers error:', error);
      
      let errorMessage = 'Failed to fetch drivers. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        handleLogout();
        return;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setDriversError(errorMessage);
    } finally {
      setDriversLoading(false);
    }
  };

  // Delete driver
  const deleteDriver = async (driverId: number) => {
    setDeleteLoading(driverId);

    try {
      const token = localStorage.getItem('driverToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`http://localhost:3004/driver/delete/${driverId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      });

      // Remove driver from local state
      setAllDrivers(prev => prev.filter(driver => driver.id !== driverId));
      
      // Show success message
      setUpdateSuccess('Driver deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(''), 3000);

    } catch (error: any) {
      console.error('Delete driver error:', error);
      
      let errorMessage = 'Failed to delete driver. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        handleLogout();
        return;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setUpdateError(errorMessage);
      
      // Clear error message after 5 seconds
      setTimeout(() => setUpdateError(''), 5000);
    } finally {
      setDeleteLoading(null);
      setShowDeleteConfirm(null);
    }
  };

  // Handle show/hide drivers table
  const toggleDriversTable = () => {
    if (!showDriversTable) {
      fetchAllDrivers();
    }
    setShowDriversTable(!showDriversTable);
  };

  const handleLogout = () => {
    localStorage.removeItem('driver');
    localStorage.removeItem('driverToken');
    router.push('/driver/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-start">
      {/* Header */}
      <div className="w-full py-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">Driver Dashboard</h1>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-red-700 transition duration-300 text-lg font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Notifications */}
        {notifications.length > 0 && showNotifications && (
          <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`transform transition-all duration-300 ease-in-out animate-slide-in-right rounded-lg shadow-lg border-l-4 p-4 ${
                  notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                  notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                  notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                  'bg-blue-50 border-blue-500 text-blue-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-sm font-semibold">{notification.title}</h4>
                    </div>
                    <p className="text-sm mt-1">{notification.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications Control */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              showNotifications 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showNotifications ? '🔔 Notifications ON' : '🔕 Notifications OFF'}
            {notifications.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Success/Error Messages */}
        {updateSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {updateSuccess}
          </div>
        )}
        {updateError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {updateError}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Welcome, {driverData.name}!</h2>
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                isEditing 
                  ? 'bg-gray-500 text-white hover:bg-gray-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={updateLoading}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {!isEditing ? (
            // View Mode
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-lg text-gray-900 font-semibold">{driverData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-lg text-gray-900 font-semibold">{driverData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">NID Number</label>
                <p className="mt-1 text-lg text-gray-900 font-semibold">{driverData.nid}</p>
              </div>
              {driverData.nidImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">NID Image</label>
                  <img 
                    src={`http://localhost:3004/uploads/nid/${driverData.nidImage}`} 
                    alt="NID" 
                    className="mt-1 w-40 h-auto rounded-xl border border-gray-300 shadow" 
                  />
                </div>
              )}
              {driverData.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="mt-1 text-lg text-gray-900 font-semibold">
                    {new Date(driverData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleUpdateDriver} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    pattern="[A-Za-z\s]+"
                    title="Name must contain only letters and spaces"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NID Number *
                  </label>
                  <input
                    type="text"
                    value={editFormData.nid}
                    onChange={(e) => handleInputChange('nid', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    pattern="[0-9]{10,17}"
                    title="NID must be 10-17 digits"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    value={editFormData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    minLength={6}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update NID Image (optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Only JPG, JPEG, or PNG files. Maximum size: 2MB
                </p>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              {driverData.nidImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Current NID Image</label>
                  <img 
                    src={`http://localhost:3004/uploads/nid/${driverData.nidImage}`} 
                    alt="Current NID" 
                    className="w-32 h-auto rounded-lg border border-gray-300 shadow" 
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className={`flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                    updateLoading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-green-700'
                  }`}
                >
                  {updateLoading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={toggleEditMode}
                  disabled={updateLoading}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* All Drivers Management Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-blue-600">Driver Management</h3>
            <button
              onClick={toggleDriversTable}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                showDriversTable 
                  ? 'bg-gray-500 text-white hover:bg-gray-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={driversLoading}
            >
              {driversLoading ? 'Loading...' : showDriversTable ? 'Hide Table' : 'Show All Drivers'}
            </button>
          </div>

          {/* Drivers Error Message */}
          {driversError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {driversError}
            </div>
          )}

          {/* Drivers Table */}
          {showDriversTable && (
            <div className="overflow-x-auto">
              {driversLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading drivers...</p>
                </div>
              ) : allDrivers.length > 0 ? (
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">NID</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Bus Info</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Registered</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-gray-900">{driver.id}</td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-900 font-medium">{driver.name}</td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-900">{driver.email}</td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-900">{driver.nid}</td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-900">
                          {driver.bus ? (
                            <div className="text-sm">
                              <div className="font-medium">Bus #{driver.bus.busNumber}</div>
                              <div className="text-gray-600">{driver.bus.route}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No bus assigned</span>
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-900">
                          {driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="flex gap-2">
                            {driver.nidImage && (
                              <button
                                onClick={() => window.open(`http://localhost:3004/uploads/nid/${driver.nidImage}`, '_blank')}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                              >
                                View NID
                              </button>
                            )}
                            {/* Prevent deleting current logged-in driver */}
                            {driver.id !== driverData?.id && (
                              <>
                                {showDeleteConfirm === driver.id ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => deleteDriver(driver.id)}
                                      disabled={deleteLoading === driver.id}
                                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                      {deleteLoading === driver.id ? 'Deleting...' : 'Confirm'}
                                    </button>
                                    <button
                                      onClick={() => setShowDeleteConfirm(null)}
                                      disabled={deleteLoading === driver.id}
                                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setShowDeleteConfirm(driver.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                  >
                                    Delete
                                  </button>
                                )}
                              </>
                            )}
                            {driver.id === driverData?.id && (
                              <span className="text-green-600 text-sm font-medium px-3 py-1">Current User</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p className="text-lg">No drivers found</p>
                  <p className="text-sm mt-2">There are no registered drivers to display.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
