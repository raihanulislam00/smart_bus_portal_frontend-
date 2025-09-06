'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface PassengerData {
  id: number;
  username: string;
  fullName: string;
  mail: string;
  gender: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  id: number;
  from: string;
  to: string;
  date: string;
  time: string;
  seatNumber: string;
  status: string;
  price: number;
}

export default function PassengerDashboard() {
  const [passengerData, setPassengerData] = useState<PassengerData | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userString = localStorage.getItem('user');
    
    if (!token || !userString) {
      router.push('/passenger/login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      setPassengerData(user);
      fetchTickets(user.id, token);
    } catch (error) {
      console.error('Error parsing user data:', error);
      handleLogout();
    }
  }, [router]);

  const fetchTickets = async (passengerId: number, token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/passenger/${passengerId}/tickets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTickets(response.data);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to load tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
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

  if (!passengerData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Passenger Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, {passengerData.fullName}!</h2>
              <p className="text-gray-600 mt-1">Manage your bookings and profile information</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="text-sm font-medium">{new Date(passengerData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🎫</div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Tickets</h3>
                <p className="text-2xl font-bold text-blue-600">{tickets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Active Tickets</h3>
                <p className="text-2xl font-bold text-green-600">
                  {tickets.filter(ticket => ticket.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">💰</div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Spent</h3>
                <p className="text-2xl font-bold text-purple-600">
                  ৳{tickets.reduce((total, ticket) => total + (ticket.price || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-sm text-gray-900">{passengerData.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{passengerData.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{passengerData.mail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{passengerData.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{passengerData.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{passengerData.address}</p>
              </div>
              <div className="pt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Recent Tickets</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300">
                  Book New Ticket
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              {tickets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎫</div>
                  <p className="text-gray-500">No tickets found</p>
                  <p className="text-sm text-gray-400 mt-2">Book your first ticket to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {ticket.from} → {ticket.to}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {ticket.date} at {ticket.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Seat: {ticket.seatNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : ticket.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {ticket.status}
                          </span>
                          <p className="text-sm font-medium mt-1">৳{ticket.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {tickets.length > 5 && (
                    <div className="text-center pt-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View all tickets ({tickets.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300">
              <span className="text-2xl mr-3">🎫</span>
              <span className="text-sm font-medium">Book Ticket</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300">
              <span className="text-2xl mr-3">📍</span>
              <span className="text-sm font-medium">Track Bus</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300">
              <span className="text-2xl mr-3">💳</span>
              <span className="text-sm font-medium">Payment History</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300">
              <span className="text-2xl mr-3">🆘</span>
              <span className="text-sm font-medium">Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
