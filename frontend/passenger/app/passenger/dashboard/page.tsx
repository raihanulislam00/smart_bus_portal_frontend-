'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService, Passenger } from '@/lib/auth-service';
import { useNotifications } from '@/app/components/NotificationProvider';

export default function PassengerDashboard() {
  const [passengerData, setPassengerData] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { addNotification } = useNotifications();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      if (!isAuth) {
        router.push('/passenger/login');
        return;
      }

      const passenger = await AuthService.getCurrentPassenger();
      setPassengerData(passenger);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        router.push('/passenger/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push('/passenger/login');
    } catch (error) {
      router.push('/passenger/login');
    }
  };

  // Demo function to test notifications
  const sendTestNotification = () => {
    addNotification({
      title: 'Test Notification',
      message: 'This is a test notification to demonstrate the notification system!',
      type: 'general'
    });
  };

  const simulateTicketCreated = () => {
    addNotification({
      title: 'Ticket Created Successfully!',
      message: 'Your bus ticket has been created. Check your tickets for details.',
      type: 'ticket_created',
      data: { ticketId: 'TKT-' + Date.now() }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-ping mx-auto"></div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Dashboard</h2>
              <p className="text-gray-600">Please wait while we fetch your data...</p>
            </div>
            <div className="flex justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!passengerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Quick Actions & Profile */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/passenger/bookings')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🎫 Book New Ticket
                  </button>
                  <button
                    onClick={() => router.push('/passenger/tickets')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-semibold transition-all duration-300 border border-gray-200"
                  >
                    📋 My Tickets
                  </button>
                  <button
                    onClick={() => router.push('/passenger/profile')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-semibold transition-all duration-300 border border-gray-200"
                  >
                    👤 Edit Profile
                  </button>
                </div>
              </div>
              
              {/* Profile */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-600 text-sm">Username</p>
                    <p className="text-gray-900 font-medium">{passengerData.username}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-600 text-sm">Full Name</p>
                    <p className="text-gray-900 font-medium">{passengerData.fullName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-900 font-medium">{passengerData.mail || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
