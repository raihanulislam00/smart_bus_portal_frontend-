'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService, Passenger } from '@/lib/auth-service';
import { TicketService, Ticket } from '@/lib/auth-service';

export default function PassengerTickets() {
  const [passengerData, setPassengerData] = useState<Passenger | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const router = useRouter();

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

      // Load tickets
      try {
        const userTickets = await TicketService.getMyTickets();
        setTickets(userTickets);
        setFilteredTickets(userTickets);
      } catch (ticketError) {
        console.log('No tickets found or error loading tickets');
        setTickets([]);
        setFilteredTickets([]);
      }
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      setError('Failed to load tickets');
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        router.push('/passenger/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId: number) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this ticket? This action cannot be undone.');
    if (!confirmCancel) return;

    try {
      await TicketService.cancelTicket(ticketId);
      // Refresh tickets
      checkAuthAndLoadData();
    } catch (error: any) {
      setError('Failed to cancel ticket: ' + error.message);
    }
  };

  // Filter tickets based on search and status
  useEffect(() => {
    let filtered = tickets;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(ticket => 
        ticket.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.seatNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTickets(filtered);
  }, [tickets, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return '✅';
      case 'cancelled': return '❌';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const getTicketStats = () => {
    const confirmed = tickets.filter(t => t.status === 'confirmed').length;
    const cancelled = tickets.filter(t => t.status === 'cancelled').length;
    const pending = tickets.filter(t => t.status === 'pending').length;
    return { confirmed, cancelled, pending, total: tickets.length };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-purple-400 rounded-full animate-ping mx-auto"></div>
              <div className="absolute inset-2 w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Tickets</h2>
              <p className="text-gray-600">Please wait while we fetch your booking history...</p>
              <div className="flex justify-center mt-6 space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!passengerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const stats = getTicketStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <span className="text-5xl mr-4">🎫</span>
              My Tickets
            </h1>
            <p className="text-xl text-blue-100 mb-8">Manage and view all your bus tickets</p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-blue-100">Total Tickets</div>
              </div>
              <div className="bg-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-300/30">
                <div className="text-2xl font-bold">{stats.confirmed}</div>
                <div className="text-sm text-blue-100">Confirmed</div>
              </div>
              <div className="bg-amber-500/20 backdrop-blur-sm rounded-xl p-4 border border-amber-300/30">
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-blue-100">Pending</div>
              </div>
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-300/30">
                <div className="text-2xl font-bold">{stats.cancelled}</div>
                <div className="text-sm text-blue-100">Cancelled</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by route, seat number, or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="flex gap-4 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="pending">⏳ Pending</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Info */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                📊 Showing <span className="font-semibold text-blue-600">{filteredTickets.length}</span> of <span className="font-semibold">{tickets.length}</span> tickets
              </div>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => {setSearchQuery(''); setStatusFilter('all');}}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear filters</span>
                </button>
              )}
            </div>
            
            {tickets.length > 0 && (
              <button
                onClick={() => router.push('/passenger/bookings')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Book New Ticket</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {filteredTickets.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-white/50">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-6xl">🎫</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {tickets.length === 0 ? 'No tickets found' : 'No matching tickets'}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                {tickets.length === 0 
                  ? "You haven't booked any tickets yet. Start your journey by booking your first ticket!"
                  : "No tickets match your current search criteria. Try adjusting your filters."
                }
              </p>
              {tickets.length === 0 ? (
                <button
                  onClick={() => router.push('/passenger/bookings')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center space-x-3 mx-auto text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Book Your First Ticket</span>
                </button>
              ) : (
                <button
                  onClick={() => {setSearchQuery(''); setStatusFilter('all');}}
                  className="bg-gray-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-700 transition-all duration-300 shadow-lg"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${viewMode === 'list' ? 'p-6' : ''} ${viewMode === 'grid' ? 'h-[420px] flex flex-col' : ''}`}>
                {viewMode === 'grid' ? (
                  // Grid View - Fixed Height Layout
                  <>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white flex-shrink-0">
                      <div className="flex justify-between items-start h-20">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 flex items-center line-clamp-1">
                            <span className="text-2xl mr-3 flex-shrink-0">🚌</span>
                            <span className="truncate">{ticket.routeName}</span>
                          </h3>
                          <p className="text-blue-100 text-sm">Ticket #{ticket.id}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex-shrink-0 ml-2 ${getStatusColor(ticket.status)}`}>
                          <span className="block text-center">
                            {getStatusIcon(ticket.status)} {ticket.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-xl p-3 h-16 flex flex-col justify-center">
                            <div className="text-xs text-gray-500 mb-1 font-medium">Journey Date</div>
                            <div className="font-semibold text-gray-900 text-sm leading-tight">
                              {new Date(ticket.journeyDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 h-16 flex flex-col justify-center">
                            <div className="text-xs text-gray-500 mb-1 font-medium">Seat Number</div>
                            <div className="font-semibold text-gray-900 text-lg leading-tight">{ticket.seatNumber}</div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-xl p-4 text-center h-16 flex flex-col justify-center">
                          <div className="text-xs text-green-600 mb-1 font-medium">Total Price</div>
                          <div className="text-2xl font-bold text-green-700">${ticket.price}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4 mt-auto">
                        <button
                          onClick={() => router.push(`/passenger/tickets/${ticket.id}`)}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2 h-12"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-sm">View</span>
                        </button>
                        {ticket.status === 'confirmed' ? (
                          <button
                            onClick={() => handleCancelTicket(ticket.id)}
                            className="w-12 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition duration-300 flex items-center justify-center h-12"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        ) : (
                          <div className="w-12"></div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // List View - Consistent Height
                  <div className="flex items-center justify-between h-24">
                    <div className="flex items-center space-x-6 flex-1">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white flex-shrink-0 w-16 h-16 flex items-center justify-center">
                        <span className="text-2xl">🚌</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{ticket.routeName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">📅 {new Date(ticket.journeyDate).toLocaleDateString()}</span>
                          <span className="flex items-center">💺 {ticket.seatNumber}</span>
                          <span className="flex items-center">💰 ${ticket.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)} {ticket.status.toUpperCase()}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/passenger/tickets/${ticket.id}`)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center space-x-2 whitespace-nowrap h-10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>View Details</span>
                        </button>
                        {ticket.status === 'confirmed' ? (
                          <button
                            onClick={() => handleCancelTicket(ticket.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-300 h-10 w-10 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        ) : (
                          <div className="w-10 h-10"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}