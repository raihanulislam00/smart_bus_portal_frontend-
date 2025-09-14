'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthService, Passenger } from '@/lib/auth-service';
import { TicketService, Ticket } from '@/lib/auth-service';

export default function TicketDetails() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [passengerData, setPassengerData] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  useEffect(() => {
    checkAuthAndLoadTicket();
  }, [ticketId]);

  const checkAuthAndLoadTicket = async () => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      if (!isAuth) {
        router.push('/passenger/login');
        return;
      }

      const passenger = await AuthService.getCurrentPassenger();
      setPassengerData(passenger);

      // Load ticket details
      try {
        const ticketDetails = await TicketService.getTicketById(ticketId);
        setTicket(ticketDetails);
      } catch (ticketError: any) {
        console.error('Error loading ticket:', ticketError);
        setError('Ticket not found or you do not have permission to view this ticket');
      }
    } catch (error: any) {
      console.error('Error loading ticket details:', error);
      setError('Failed to load ticket details');
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        router.push('/passenger/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!ticket) return;
    
    const confirmed = window.confirm('Are you sure you want to cancel this ticket? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await TicketService.cancelTicket(ticket.id);
      // Refresh ticket data
      await checkAuthAndLoadTicket();
    } catch (error: any) {
      setError('Failed to cancel ticket: ' + error.message);
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const generateQRCodeValue = () => {
    if (!ticket) return '';
    return `TICKET-${ticket.id}-${ticket.routeName}-${ticket.seatNumber}`;
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
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Ticket Details</h2>
              <p className="text-gray-600">Please wait while we fetch your ticket information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ticket Not Found</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {error || 'The ticket you are looking for does not exist or you do not have permission to view it.'}
              </p>
              <button
                onClick={() => router.push('/passenger/tickets')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Back to My Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/passenger/tickets')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Tickets
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Ticket Details</h1>
          <p className="text-gray-600 mt-2">View and manage your bus ticket</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">🚌 {ticket.routeName}</h2>
                <p className="text-blue-100">Ticket #{ticket.id}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                  ticket.status === 'confirmed' ? 'bg-green-500 text-white' :
                  ticket.status === 'cancelled' ? 'bg-red-500 text-white' :
                  'bg-yellow-500 text-white'
                }`}>
                  {ticket.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Trip Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h8a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2v2a2 2 0 00-2 2v2" />
                    </svg>
                    Trip Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Route:</span>
                      <span className="text-gray-900 font-semibold">{ticket.routeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Journey Date:</span>
                      <span className="text-gray-900 font-semibold">
                        {new Date(ticket.journeyDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Seat Number:</span>
                      <span className="text-gray-900 font-semibold text-lg">{ticket.seatNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Price:</span>
                      <span className="text-green-600 font-bold text-xl">${ticket.price}</span>
                    </div>
                  </div>
                </div>

                {/* Passenger Details */}
                {passengerData && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Passenger Information
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Name:</span>
                        <span className="text-gray-900 font-semibold">{passengerData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Email:</span>
                        <span className="text-gray-900 font-semibold">{passengerData.mail || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Phone:</span>
                        <span className="text-gray-900 font-semibold">{passengerData.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - QR Code and Actions */}
              <div className="space-y-6">
                {/* QR Code Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Digital Ticket
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
                      {showQR ? (
                        <div>
                          <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📱</div>
                              <p className="text-xs text-gray-600">QR Code</p>
                              <p className="text-xs text-gray-500 font-mono mt-1">{generateQRCodeValue()}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Show this QR code to the bus conductor</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-6xl mb-4">🎫</div>
                          <p className="text-gray-600 mb-4">Digital ticket ready for verification</p>
                          <button
                            onClick={() => setShowQR(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            Show QR Code
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Booking Details
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Booked On:</span>
                      <span className="text-gray-900 font-semibold">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Last Updated:</span>
                      <span className="text-gray-900 font-semibold">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handlePrintTicket}
                  className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print Ticket</span>
                </button>

                {ticket.status === 'confirmed' && (
                  <button
                    onClick={handleCancelTicket}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel Ticket</span>
                  </button>
                )}

                <button
                  onClick={() => router.push('/passenger/bookings')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Book Another Ticket</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Information
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Please arrive at the boarding point at least 15 minutes before departure time.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Keep this ticket handy during your journey for verification.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Tickets can be cancelled up to 2 hours before departure time.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>For any assistance, contact our customer support team.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}