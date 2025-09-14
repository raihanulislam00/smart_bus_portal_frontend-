'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../components/navbar';
import { busService, type Bus } from '../../lib/services';

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchRoute, setSearchRoute] = useState('');
  const [error, setError] = useState('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerInfo, setPassengerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    travelDate: ''
  });

  useEffect(() => {
    fetchAllBuses();
  }, []);

  const fetchAllBuses = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Attempting to fetch buses from backend...');
      const allBuses = await busService.getAllBuses();
      console.log('Successfully fetched buses:', allBuses);
      setBuses(allBuses);
    } catch (err: any) {
      console.error('Error fetching buses:', err);
      console.error('Error details:', err.message, err.response);
      setError(`Backend connection issue: ${err.message}. Showing sample data for demonstration.`);
      
      // Mock data for demonstration when backend is not available
      const mockBuses: Bus[] = [
        {
          id: 1,
          busName: 'Express AC-001',
          route: 'Dhaka to Chittagong',
          capacity: 40,
          fare: 800,
          schedule: '6:00 AM - 12:00 PM',
          isActive: true,
          managedBy: {
            id: 1,
            fullName: 'Md. Rahman Ahmed',
            companyName: 'Smart Bus Transport Ltd.',
            email: 'admin@smartbus.com'
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          busName: 'Deluxe AC-002',
          route: 'Dhaka to Sylhet',
          capacity: 36,
          fare: 700,
          schedule: '8:00 AM - 2:00 PM',
          isActive: true,
          managedBy: {
            id: 1,
            fullName: 'Karim Uddin',
            companyName: 'Green Line Paribahan Ltd.',
            email: 'info@greenline.com'
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          busName: 'Super AC-003',
          route: 'Dhaka to Cox\'s Bazar',
          capacity: 44,
          fare: 1200,
          schedule: '10:00 PM - 8:00 AM',
          isActive: true,
          managedBy: {
            id: 2,
            fullName: 'Shahidul Islam',
            companyName: 'Shohagh Paribahan Ltd.',
            email: 'contact@shohagh.com'
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          busName: 'Express-004',
          route: 'Chittagong to Dhaka',
          capacity: 45,
          fare: 750,
          schedule: '2:00 PM - 8:00 PM',
          isActive: true,
          managedBy: {
            id: 3,
            fullName: 'Abdul Hanif',
            companyName: 'Hanif Enterprise Ltd.',
            email: 'info@hanifenterprise.com'
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 5,
          busName: 'Luxury AC-005',
          route: 'Sylhet to Dhaka',
          capacity: 32,
          fare: 650,
          schedule: '11:00 PM - 5:00 AM',
          isActive: true,
          managedBy: {
            id: 4,
            fullName: 'Enayet Ullah',
            companyName: 'Ena Transport Ltd.',
            email: 'support@enatransport.com'
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 6,
          busName: 'Royal AC-006',
          route: 'Dhaka to Rajshahi',
          capacity: 38,
          fare: 600,
          schedule: '7:00 AM - 1:00 PM',
          isActive: true,
          managedBy: {
            id: 5,
            fullName: 'Rafiqul Islam',
            companyName: 'Royal Coach Service Ltd.',
            email: 'booking@royalcoach.com'
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
      
      setBuses(mockBuses);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchRoute.trim()) {
      fetchAllBuses();
      return;
    }
    
    try {
      setLoading(true);
      const searchResults = await busService.searchBuses(searchRoute);
      setBuses(searchResults);
    } catch (err: any) {
      console.error('Search error:', err);
      setError('Search failed. Filtering available buses locally.');
      
      // Filter from existing buses if search API fails
      const filtered = buses.filter(bus => 
        bus.isActive && (
          bus.route.toLowerCase().includes(searchRoute.toLowerCase()) ||
          bus.busName.toLowerCase().includes(searchRoute.toLowerCase())
        )
      );
      setBuses(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (bus: Bus) => {
    setSelectedBus(bus);
    setShowBookingModal(true);
    setSelectedSeats([]);
    setPassengerInfo({
      name: '',
      phone: '',
      email: '',
      travelDate: ''
    });
  };

  const handleSeatSelection = (seatNumber: number) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleBookingSubmit = async () => {
    if (!selectedBus || selectedSeats.length === 0 || !passengerInfo.name || !passengerInfo.phone || !passengerInfo.travelDate) {
      alert('Please fill all required fields and select at least one seat.');
      return;
    }

    const totalFare = selectedSeats.length * selectedBus.fare;
    const bookingDetails = {
      busId: selectedBus.id,
      busName: selectedBus.busName,
      route: selectedBus.route,
      schedule: selectedBus.schedule,
      selectedSeats,
      totalSeats: selectedSeats.length,
      totalFare,
      passengerInfo,
      bookingDate: new Date().toISOString()
    };

    // Here you would typically send the booking to your backend
    console.log('Booking Details:', bookingDetails);
    
    alert(`Booking Confirmed!\n\nBus: ${selectedBus.busName}\nRoute: ${selectedBus.route}\nSeats: ${selectedSeats.join(', ')}\nTotal Fare: ৳${totalFare}\nPassenger: ${passengerInfo.name}\nTravel Date: ${passengerInfo.travelDate}\n\nThank you for booking with Smart Bus Portal!`);
    
    setShowBookingModal(false);
    setSelectedBus(null);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedBus(null);
    setSelectedSeats([]);
  };

  const filteredBuses = buses.filter(bus => 
    bus.isActive && (
      !searchRoute || 
      bus.route.toLowerCase().includes(searchRoute.toLowerCase()) ||
      bus.busName.toLowerCase().includes(searchRoute.toLowerCase())
    )
  );

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center' as const,
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '1rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto',
    },
    searchSection: {
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    searchContainer: {
      display: 'flex',
      gap: '1rem',
      maxWidth: '600px',
      margin: '0 auto',
      marginBottom: '40px',
    },
    searchInput: {
      flex: 1,
      padding: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    searchButton: {
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
    },
    busesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '2rem',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    busCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    busHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    },
    busName: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#2d3748',
      margin: 0,
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: '600',
      background: '#dcfce7',
      color: '#166534',
    },
    route: {
      fontSize: '1.1rem',
      color: '#667eea',
      fontWeight: '600',
      marginBottom: '1.5rem',
    },
    busDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    detailLabel: {
      fontSize: '0.85rem',
      color: '#718096',
      marginBottom: '0.25rem',
      fontWeight: '500',
    },
    detailValue: {
      fontSize: '1rem',
      color: '#2d3748',
      fontWeight: '600',
    },
    operatorInfo: {
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
    },
    operatorLabel: {
      fontSize: '0.85rem',
      color: '#718096',
      marginBottom: '0.25rem',
    },
    operatorName: {
      fontSize: '1rem',
      color: '#2d3748',
      fontWeight: '600',
    },
    fareSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    fareLabel: {
      fontSize: '1rem',
      color: '#718096',
    },
    fareAmount: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#059669',
    },
    bookButton: {
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '4rem 2rem',
      color: '#718096',
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
    },
    emptyTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#2d3748',
    },
    emptyMessage: {
      fontSize: '1rem',
      maxWidth: '400px',
      margin: '0 auto',
    },
    errorMessage: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '1rem',
      borderRadius: '8px',
      margin: '1rem 0',
      textAlign: 'center' as const,
    },
    loadingSpinner: {
      textAlign: 'center' as const,
      padding: '4rem',
      color: '#667eea',
      fontSize: '1.2rem',
    },
    // Booking Modal Styles
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '800px',
      maxHeight: '90vh',
      width: '90%',
      overflowY: 'auto' as const,
      position: 'relative' as const,
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #e2e8f0',
    },
    modalTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#2d3748',
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '2rem',
      cursor: 'pointer',
      color: '#718096',
      padding: '0.5rem',
      borderRadius: '8px',
      transition: 'background-color 0.2s',
    },
    busInfoSection: {
      background: '#f8fafc',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem',
    },
    seatMapSection: {
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '1rem',
    },
    seatGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.5rem',
      maxWidth: '300px',
      margin: '0 auto',
    },
    seat: {
      width: '50px',
      height: '50px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.2s',
      backgroundColor: 'white',
    },
    seatSelected: {
      backgroundColor: '#667eea',
      color: 'white',
      borderColor: '#667eea',
    },
    seatOccupied: {
      backgroundColor: '#e2e8f0',
      color: '#a0aec0',
      cursor: 'not-allowed',
    },
    seatLegend: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginTop: '1rem',
      fontSize: '0.9rem',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    legendSeat: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
    },
    passengerForm: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '2rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    formGroupFull: {
      gridColumn: '1 / -1',
    },
    formLabel: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '0.5rem',
    },
    formInput: {
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s',
    },
    bookingSummary: {
      background: '#f8fafc',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#2d3748',
      paddingTop: '1rem',
      borderTop: '2px solid #e2e8f0',
    },
    modalActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
    },
    cancelButton: {
      padding: '1rem 2rem',
      background: '#e2e8f0',
      color: '#4a5568',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    confirmButton: {
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div style={styles.container}>
          <div style={styles.loadingSpinner}>
            <div>🚌 Loading available buses...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>🚌 Available Bus Routes</h1>
          <p style={styles.subtitle}>
            Browse all available buses, check routes and schedules, then select your preferred journey to book tickets
          </p>
        </div>

        {/* Search Section */}
        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search by route or bus name (e.g., Dhaka to Chittagong)"
              value={searchRoute}
              onChange={(e) => setSearchRoute(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              style={styles.searchButton}
              onClick={handleSearch}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Search
            </button>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* Results Counter */}
          {!loading && (
            <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#718096' }}>
              {filteredBuses.length > 0 ? (
                <p>Showing {filteredBuses.length} available bus{filteredBuses.length !== 1 ? 'es' : ''} {searchRoute && `for "${searchRoute}"`}</p>
              ) : (
                <p>No buses found {searchRoute && `for "${searchRoute}"`}</p>
              )}
            </div>
          )}
        </div>

        {/* Buses Grid */}
        {filteredBuses.length > 0 ? (
          <div style={styles.busesGrid}>
            {filteredBuses.map((bus) => (
              <div 
                key={bus.id} 
                style={styles.busCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Bus Header */}
                <div style={styles.busHeader}>
                  <h3 style={styles.busName}>{bus.busName}</h3>
                  <span style={styles.statusBadge}>Available</span>
                </div>

                {/* Route */}
                <div style={styles.route}>🚍 {bus.route}</div>

                {/* Bus Details */}
                <div style={styles.busDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Schedule</span>
                    <span style={styles.detailValue}>🕒 {bus.schedule}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Capacity</span>
                    <span style={styles.detailValue}>👥 {bus.capacity} seats</span>
                  </div>
                </div>

                {/* Operator Info */}
                {bus.managedBy && (
                  <div style={styles.operatorInfo}>
                    <div style={styles.operatorLabel}>Operated by</div>
                    <div style={styles.operatorName}>
                      {bus.managedBy.companyName || bus.managedBy.fullName}
                      {bus.managedBy.companyName && bus.managedBy.fullName && (
                        <div style={{fontSize: '0.9rem', color: '#718096', marginTop: '0.25rem'}}>
                          Admin: {bus.managedBy.fullName}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fare Section */}
                <div style={styles.fareSection}>
                  <span style={styles.fareLabel}>Starting from</span>
                  <span style={styles.fareAmount}>৳{bus.fare}</span>
                </div>

                {/* Book Button */}
                <button 
                  style={styles.bookButton}
                  onClick={() => handleBookNow(bus)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Book Now →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>
              {searchRoute ? 'No buses found' : 'No buses available'}
            </h3>
            <p style={styles.emptyMessage}>
              {searchRoute 
                ? `We couldn't find any buses matching "${searchRoute}". Try searching with different keywords.`
                : 'There are currently no buses available. Please check back later.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedBus && (
        <div style={styles.modalOverlay} onClick={closeBookingModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Book Your Journey</h2>
              <button style={styles.closeButton} onClick={closeBookingModal}>×</button>
            </div>

            {/* Bus Information */}
            <div style={styles.busInfoSection}>
              <h3 style={styles.sectionTitle}>🚌 {selectedBus.busName}</h3>
              <div style={styles.summaryRow}>
                <span><strong>Route:</strong> {selectedBus.route}</span>
              </div>
              <div style={styles.summaryRow}>
                <span><strong>Schedule:</strong> {selectedBus.schedule}</span>
              </div>
              <div style={styles.summaryRow}>
                <span><strong>Fare per seat:</strong> ৳{selectedBus.fare}</span>
              </div>
              {selectedBus.managedBy && (
                <div style={styles.summaryRow}>
                  <span><strong>Operator:</strong> {selectedBus.managedBy.companyName || selectedBus.managedBy.fullName}</span>
                </div>
              )}
              {selectedBus.managedBy && selectedBus.managedBy.companyName && selectedBus.managedBy.fullName && (
                <div style={styles.summaryRow}>
                  <span><strong>Admin:</strong> {selectedBus.managedBy.fullName}</span>
                </div>
              )}
            </div>

            {/* Seat Selection */}
            <div style={styles.seatMapSection}>
              <h3 style={styles.sectionTitle}>Select Your Seats</h3>
              <div style={styles.seatGrid}>
                {Array.from({ length: selectedBus.capacity }, (_, i) => {
                  const seatNumber = i + 1;
                  const isSelected = selectedSeats.includes(seatNumber);
                  const isOccupied = Math.random() < 0.3; // Simulate some occupied seats
                  
                  return (
                    <div
                      key={seatNumber}
                      style={{
                        ...styles.seat,
                        ...(isSelected ? styles.seatSelected : {}),
                        ...(isOccupied ? styles.seatOccupied : {}),
                      }}
                      onClick={() => !isOccupied && handleSeatSelection(seatNumber)}
                    >
                      {seatNumber}
                    </div>
                  );
                })}
              </div>
              
              {/* Seat Legend */}
              <div style={styles.seatLegend}>
                <div style={styles.legendItem}>
                  <div style={{...styles.legendSeat, backgroundColor: 'white', border: '2px solid #e2e8f0'}}></div>
                  <span>Available</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{...styles.legendSeat, backgroundColor: '#667eea'}}></div>
                  <span>Selected</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{...styles.legendSeat, backgroundColor: '#e2e8f0'}}></div>
                  <span>Occupied</span>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div style={styles.passengerForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name *</label>
                <input
                  style={styles.formInput}
                  type="text"
                  placeholder="Enter your full name"
                  value={passengerInfo.name}
                  onChange={(e) => setPassengerInfo({...passengerInfo, name: e.target.value})}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone Number *</label>
                <input
                  style={styles.formInput}
                  type="tel"
                  placeholder="Enter your phone number"
                  value={passengerInfo.phone}
                  onChange={(e) => setPassengerInfo({...passengerInfo, phone: e.target.value})}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Address</label>
                <input
                  style={styles.formInput}
                  type="email"
                  placeholder="Enter your email"
                  value={passengerInfo.email}
                  onChange={(e) => setPassengerInfo({...passengerInfo, email: e.target.value})}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Travel Date *</label>
                <input
                  style={styles.formInput}
                  type="date"
                  value={passengerInfo.travelDate}
                  onChange={(e) => setPassengerInfo({...passengerInfo, travelDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Booking Summary */}
            {selectedSeats.length > 0 && (
              <div style={styles.bookingSummary}>
                <h3 style={styles.sectionTitle}>Booking Summary</h3>
                <div style={styles.summaryRow}>
                  <span>Selected Seats:</span>
                  <span>{selectedSeats.join(', ')}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Number of Seats:</span>
                  <span>{selectedSeats.length}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Fare per Seat:</span>
                  <span>৳{selectedBus.fare}</span>
                </div>
                <div style={styles.summaryTotal}>
                  <span>Total Amount:</span>
                  <span>৳{selectedSeats.length * selectedBus.fare}</span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={styles.modalActions}>
              <button style={styles.cancelButton} onClick={closeBookingModal}>
                Cancel
              </button>
              <button 
                style={styles.confirmButton} 
                onClick={handleBookingSubmit}
                disabled={selectedSeats.length === 0}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
