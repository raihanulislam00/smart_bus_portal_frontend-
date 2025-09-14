'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService, Passenger } from '@/lib/auth-service';
import { TicketService, CreateTicketData } from '@/lib/auth-service';
import { useNotifications } from '@/app/components/NotificationProvider';

export default function PassengerBookings() {
  const [passengerData, setPassengerData] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { addNotification } = useNotifications();

  // Popular routes data
  const popularRoutes = [
    { id: 'dhaka-chittagong', name: 'Dhaka to Chittagong', price: 750 },
    { id: 'dhaka-sylhet', name: 'Dhaka to Sylhet', price: 650 },
    { id: 'dhaka-rajshahi', name: 'Dhaka to Rajshahi', price: 550 },
    { id: 'dhaka-khulna', name: 'Dhaka to Khulna', price: 600 },
    { id: 'chittagong-cox-bazar', name: 'Chittagong to Cox\'s Bazar', price: 400 },
    { id: 'dhaka-rangpur', name: 'Dhaka to Rangpur', price: 700 },
    { id: 'sylhet-chittagong', name: 'Sylhet to Chittagong', price: 500 },
    { id: 'custom', name: 'Custom Route', price: 0 }
  ];

  const [selectedRoute, setSelectedRoute] = useState('');
  const [isCustomRoute, setIsCustomRoute] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  
  // Payment related states
  const [currentStep, setCurrentStep] = useState<'booking' | 'payment' | 'confirmation'>('booking');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [completedTransactionId, setCompletedTransactionId] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    mobileNumber: '',
    bankAccount: '',
    transactionId: ''
  });

  const [bookingForm, setBookingForm] = useState<CreateTicketData>({
    routeName: '',
    journeyDate: '',
    seatNumber: '',
    price: 0
  });

  // Calculate total price based on selected seats and base price
  const totalSeats = selectedSeats.length;
  const basePrice = bookingForm.price;
  const totalPrice = totalSeats > 0 ? basePrice * totalSeats : basePrice;

  // Bus seat configuration (typical 40-seat bus)
  const seatRows = [
    ['A1','A2', '', 'A3', 'A4'],
    ['B1','B2', '', 'B3', 'B4'],
    ['C1','C2', '', 'C3', 'C4'],
    ['D1','D2', '', 'D3', 'D4'],
    ['E1','E2', '', 'E3', 'E4'],
    ['F1','F2', '', 'F3', 'F4'],
    ['G1','G2', '', 'G3', 'G4'],
    ['H1', 'H2', '', 'H3', 'H4'],
    ['I1', 'I2', '', 'I3', 'I4'],
    ['J1', 'J2', '', 'J3', 'J4']
  ];

  // Simulate some occupied seats
  const occupiedSeats = ['A1', 'B3', 'C2', 'E4', 'F1', 'H3', 'I2', 'J4'];

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
      console.error('Error loading booking page:', error);
      setError('Failed to load booking page');
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        router.push('/passenger/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'price' ? parseFloat(value) || 0 : value;
    
    setBookingForm(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Real-time validation
    validateField(name, processedValue);
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const routeId = e.target.value;
    setSelectedRoute(routeId);
    
    if (routeId === 'custom') {
      setIsCustomRoute(true);
      setBookingForm(prev => ({
        ...prev,
        routeName: '',
        price: 0
      }));
      setFieldErrors(prev => ({ ...prev, routeName: '', price: '' }));
    } else if (routeId === '') {
      setIsCustomRoute(false);
      setBookingForm(prev => ({
        ...prev,
        routeName: '',
        price: 0
      }));
      setFieldErrors(prev => ({ ...prev, routeName: '', price: '' }));
    } else {
      setIsCustomRoute(false);
      const selectedRouteData = popularRoutes.find(route => route.id === routeId);
      if (selectedRouteData) {
        setBookingForm(prev => ({
          ...prev,
          routeName: selectedRouteData.name,
          price: selectedRouteData.price
        }));
        // Validate the auto-filled values
        validateField('routeName', selectedRouteData.name);
        validateField('price', selectedRouteData.price);
      }
    }
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSeatSelect = (seatNumber: string) => {
    if (occupiedSeats.includes(seatNumber)) return; // Don't allow selecting occupied seats
    
    setSelectedSeats(prev => {
      const isSelected = prev.includes(seatNumber);
      let newSeats;
      
      if (isSelected) {
        newSeats = prev.filter(seat => seat !== seatNumber);
      } else {
        if (prev.length >= 4) {
          setError('Maximum 4 seats can be selected at once');
          return prev;
        }
        newSeats = [...prev, seatNumber];
      }
      
      setBookingForm(prevForm => ({
        ...prevForm,
        seatNumber: newSeats.join(', ')
      }));
    
      validateField('seatNumber', newSeats.join(', '));
      
      return newSeats;
    });
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateRoute = (routeName: string) => {
    if (!routeName.trim()) return 'Route selection is required';
    if (routeName.length < 3) return 'Route name must be at least 3 characters';
    return '';
  };

  const validateDate = (date: string) => {
    if (!date) return 'Journey date is required';
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return 'Journey date cannot be in the past';
    return '';
  };

  const validateSeat = (seatString: string) => {
    if (!seatString.trim()) return 'At least one seat selection is required';
    const seats = seatString.split(', ').filter(s => s.trim());
    
    for (const seat of seats) {
      if (occupiedSeats.includes(seat.trim())) {
        return `Seat ${seat} is already occupied`;
      }
    }
    
    if (seats.length > 4) return 'Maximum 4 seats can be selected';
    return '';
  };

  const validatePrice = (price: number) => {
    if (price <= 0) return 'Price must be greater than 0';
    if (price > 10000) return 'Price seems too high. Please check.';
    return '';
  };

  const validateField = (fieldName: string, value: any) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'routeName':
        errorMessage = validateRoute(value);
        break;
      case 'journeyDate':
        errorMessage = validateDate(value);
        break;
      case 'seatNumber':
        errorMessage = validateSeat(value);
        break;
      case 'price':
        errorMessage = validatePrice(value);
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    
    return errorMessage === '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!bookingForm.routeName.trim() || !bookingForm.journeyDate || !bookingForm.seatNumber.trim()) {
        throw new Error('Please fill in all required fields');
      }

      if (bookingForm.price <= 0) {
        throw new Error('Please enter a valid price');
      }

      setCurrentStep('payment');
      setSuccess('Booking details confirmed! Please proceed with payment.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);
    setError('');

    try {
      if (!paymentMethod) {
        throw new Error('Please select a payment method');
      }

      if (paymentMethod === 'card') {
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardHolder) {
          throw new Error('Please fill in all card details');
        }
      } else if (paymentMethod === 'mobile') {
        if (!paymentData.mobileNumber) {
          throw new Error('Please enter your mobile number');
        }
      } else if (paymentMethod === 'bank') {
        if (!paymentData.bankAccount) {
          throw new Error('Please enter your bank account details');
        }
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      setCompletedTransactionId(transactionId);
      
      const ticket = await TicketService.createTicket(bookingForm);
      
      // Show success notification with detailed ticket information
      addNotification({
        type: 'ticket_created',
        title: 'Payment Successful! 🎉',
        message: `Your ticket has been confirmed! Journey: ${bookingForm.routeName || 'Custom Route'} on ${bookingForm.journeyDate}. Seat(s): ${selectedSeats.join(', ') || bookingForm.seatNumber}. Total Amount: ৳${totalPrice}. Transaction ID: ${transactionId}`
      });
      
      setCurrentStep('confirmation');
      setSuccess('Payment successful! Your ticket has been booked.');
      
      setTimeout(() => {
        router.push('/passenger/tickets');
      }, 3000);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-indigo-400 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading booking page...</p>
        </div>
      </div>
    );
  }

  if (!passengerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-md">
              {/* Step 1: Booking */}
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'booking' ? 'bg-blue-600 text-white' : 
                  currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600 text-white' : 
                  'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep === 'payment' || currentStep === 'confirmation' ? '✓' : '1'}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === 'booking' ? 'text-blue-600' : 
                  currentStep === 'payment' || currentStep === 'confirmation' ? 'text-green-600' : 
                  'text-gray-500'
                }`}>Booking</span>
              </div>
              
              {/* Connector */}
              <div className={`flex-1 h-1 mx-4 rounded ${
                currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-300'
              }`}></div>
              
              {/* Step 2: Payment */}
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'payment' ? 'bg-blue-600 text-white' : 
                  currentStep === 'confirmation' ? 'bg-green-600 text-white' : 
                  'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep === 'confirmation' ? '✓' : '2'}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === 'payment' ? 'text-blue-600' : 
                  currentStep === 'confirmation' ? 'text-green-600' : 
                  'text-gray-500'
                }`}>Payment</span>
              </div>
              
              {/* Connector */}
              <div className={`flex-1 h-1 mx-4 rounded ${
                currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-300'
              }`}></div>
              
              {/* Step 3: Confirmation */}
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-500'
                }`}>Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Show different components based on current step */}
          <div className="lg:col-span-2">
            {currentStep === 'booking' && (
              <div>{/* Enhanced Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* Enhanced Main Form Container */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Booking Details
            </h2>
            <p className="text-blue-100 mt-1">Fill in your travel information below</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Route Selection Field */}
              <div className="group">
                <label htmlFor="routeSelect" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Select Route *
                </label>
                <select
                  id="routeSelect"
                  value={selectedRoute}
                  onChange={handleRouteChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 bg-white/50"
                  required
                >
                  <option value="">Choose a popular route or custom</option>
                  {popularRoutes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name} {route.price > 0 && `- $${route.price}`}
                    </option>
                  ))}
                </select>
              </div>

              {isCustomRoute && (
                <div className="group">
                  <label htmlFor="routeName" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Custom Route Name *
                  </label>
                  <input
                    type="text"
                    id="routeName"
                    name="routeName"
                    value={bookingForm.routeName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 group-hover:border-orange-300 bg-white/50 ${
                      fieldErrors.routeName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                    placeholder="e.g., Dhaka to Sylhet"
                    required={isCustomRoute}
                  />
                  {fieldErrors.routeName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {fieldErrors.routeName}
                    </p>
                  )}
                </div>
              )}

              {/* Journey Date Field */}
              <div className="group">
                <label htmlFor="journeyDate" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Journey Date *
                </label>
                <input
                  type="date"
                  id="journeyDate"
                  name="journeyDate"
                  value={bookingForm.journeyDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 bg-white/50 ${
                    fieldErrors.journeyDate 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {fieldErrors.journeyDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {fieldErrors.journeyDate}
                  </p>
                )}
              </div>

              {/* Seat Selection Field */}
              <div className="group">
                {/* Enhanced Seat Selection Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Select Your Seats</h3>
                        <p className="text-sm text-gray-600">Choose up to 4 seats for your journey</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{selectedSeats.length}/4</div>
                      <div className="text-xs text-gray-500">seats selected</div>
                    </div>
                  </div>
                  
                  {/* Interactive Instructions */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-2">How to select seats:</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li className="flex items-center">
                            <svg className="w-3 h-3 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Click on any available seat to select it
                          </li>
                          <li className="flex items-center">
                            <svg className="w-3 h-3 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Click again to deselect a chosen seat
                          </li>
                          <li className="flex items-center">
                            <svg className="w-3 h-3 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Maximum 4 seats can be selected at once
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Seat Legend */}
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Seat Legend
                  </h4>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-md flex items-center justify-center shadow-sm">
                        <span className="text-gray-600 font-medium text-xs">A1</span>
                      </div>
                      <span className="text-gray-700 font-medium">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-blue-300 rounded-md flex items-center justify-center shadow-sm">
                        <span className="text-white font-medium text-xs">B2</span>
                      </div>
                      <span className="text-gray-700 font-medium">Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300 rounded-md flex items-center justify-center shadow-sm">
                        <span className="text-white font-medium text-xs">C3</span>
                      </div>
                      <span className="text-gray-700 font-medium">Occupied</span>
                    </div>
                  </div>
                </div>

                {/* Bus Layout */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  {/* Bus Front */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      Driver
                    </div>
                  </div>

                  {/* Seat Grid */}
                  <div className="space-y-3">
                    {seatRows.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex justify-between items-center gap-1">
                        {row.map((seat, seatIndex) => {
                          if (seat === '') {
                            return <div key={seatIndex} className="w-10 h-10"></div>; // Aisle space
                          }
                          
                          const isOccupied = occupiedSeats.includes(seat);
                          const isSelected = selectedSeats.includes(seat);
                          
                          return (
                            <button
                              key={seat}
                              type="button"
                              onClick={() => handleSeatSelect(seat)}
                              disabled={isOccupied}
                              className={`
                                relative w-10 h-10 rounded-lg border-2 text-xs font-bold transition-all duration-300 transform hover:scale-105
                                ${isOccupied 
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 text-white cursor-not-allowed shadow-lg' 
                                  : isSelected
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-opacity-50'
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
                                }
                                ${!isOccupied && !isSelected ? 'hover:border-blue-500 hover:text-blue-700' : ''}
                              `}
                            >
                              <span className="relative z-10">{seat}</span>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Selected Seats Display */}
                {selectedSeats.length > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl shadow-sm animate-fade-in">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Selected Seats</h4>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {selectedSeats.length} of 4 selected
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeats.map((seat, index) => (
                            <div key={seat} className="group relative">
                              <span className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                                </svg>
                                {seat}
                                <button
                                  type="button"
                                  onClick={() => handleSeatSelect(seat)}
                                  className="ml-2 text-white hover:text-red-200 transition-colors duration-200 font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            </div>
                          ))}
                        </div>
                        {selectedSeats.length > 1 && (
                          <div className="mt-3 p-2 bg-white bg-opacity-50 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 font-medium">Total Cost:</span>
                              <span className="font-bold text-green-600">
                                {selectedSeats.length} seats × ${basePrice} = ${totalPrice}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Seat Input (for custom input if needed) */}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Or enter seat manually (optional):
                  </label>
                  <input
                    type="text"
                    name="seatNumber"
                    value={bookingForm.seatNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white/50"
                    placeholder="e.g., A1, B5, etc."
                  />
                </div>
              </div>

              {/* Price Field */}
              <div className="group">
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Price ($) *
                  {!isCustomRoute && selectedRoute !== '' && (
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Auto-filled</span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={bookingForm.price || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    disabled={!isCustomRoute && selectedRoute !== '' && selectedRoute !== undefined}
                    className={`w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 ${
                      (!isCustomRoute && selectedRoute !== '') 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'bg-white/50'
                    }`}
                    placeholder="0.00"
                    required
                  />
                  {!isCustomRoute && selectedRoute !== '' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {!isCustomRoute && selectedRoute !== '' && (
                  <p className="text-xs text-gray-600 mt-1">Price is automatically set for this popular route</p>
                )}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  {bookingLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      Book My Ticket
                    </div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push('/passenger/dashboard')}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 font-semibold border border-gray-300"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                    <p className="text-gray-600">Secure payment for your booking</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Choose Payment Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Credit/Debit Card */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-xl transition-all duration-300 ${ 
                          paymentMethod === 'card' 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
                          <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                        </div>
                      </button>

                      {/* Mobile Banking */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mobile')}
                        className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                          paymentMethod === 'mobile' 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <h3 className="font-semibold text-gray-900">Mobile Banking</h3>
                          <p className="text-sm text-gray-600">bKash, Nagad, Rocket</p>
                        </div>
                      </button>

                      {/* Bank Transfer */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                          paymentMethod === 'bank' 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <h3 className="font-semibold text-gray-900">Bank Transfer</h3>
                          <p className="text-sm text-gray-600">Direct bank payment</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Payment Form Fields */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={paymentData.cardHolder}
                            onChange={handlePaymentInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handlePaymentInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={handlePaymentInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={handlePaymentInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'mobile' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={paymentData.mobileNumber}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Details</label>
                      <textarea
                        name="bankAccount"
                        value={paymentData.bankAccount}
                        onChange={handlePaymentInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Bank name, Account number, Branch"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('booking')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                    >
                      Back to Booking
                    </button>
                    <button
                      type="submit"
                      disabled={paymentLoading || !paymentMethod}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      {paymentLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Pay ${(totalPrice + 2.50).toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Confirmation Step */}
            {currentStep === 'confirmation' && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Your ticket has been booked successfully. You will be redirected to your tickets page shortly.</p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="text-sm text-gray-600 mb-2">Transaction ID</div>
                  <div className="font-mono text-gray-900">{completedTransactionId}</div>
                </div>
                <button
                  onClick={() => router.push('/passenger/tickets')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  View My Tickets
                </button>
              </div>
            )}
          </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Summary Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {currentStep === 'payment' ? 'Payment Summary' : 
                   currentStep === 'confirmation' ? 'Booking Confirmed' : 'Booking Summary'}
                </h3>
              </div>

              {/* Summary Content */}
              <div className="p-6 space-y-4">
                {/* Route Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Route
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {bookingForm.routeName ? (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{bookingForm.routeName}</span>
                        {!isCustomRoute && selectedRoute !== '' && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Popular Route
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No route selected</span>
                    )}
                  </div>
                </div>

                {/* Date Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Journey Date
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {bookingForm.journeyDate ? (
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(bookingForm.journeyDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">No date selected</span>
                    )}
                  </div>
                </div>

                {/* Seat Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                    </svg>
                    Seat Number
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {selectedSeats.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
                          </span>
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedSeats.map(seat => (
                            <span key={seat} className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No seats selected</span>
                    )}
                  </div>
                </div>

                {/* Price Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Pricing
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price per seat</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${basePrice > 0 ? basePrice.toFixed(2) : '0.00'}
                      </span>
                    </div>
                    {selectedSeats.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Seats × {selectedSeats.length}</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Service Fee</span>
                      <span className="text-sm font-medium text-gray-900">$2.50</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-indigo-600">
                          ${totalPrice > 0 ? (totalPrice + 2.50).toFixed(2) : '2.50'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Progress */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Booking Progress</h4>
                  <div className="space-y-2">
                    {[
                      { step: 'Route', completed: !!bookingForm.routeName },
                      { step: 'Date', completed: !!bookingForm.journeyDate },
                      { step: 'Seat', completed: !!bookingForm.seatNumber },
                      { step: 'Price', completed: bookingForm.price > 0 }
                    ].map((item, index) => (
                      <div key={item.step} className="flex items-center text-sm">
                        {item.completed ? (
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                        )}
                        <span className={item.completed ? 'text-green-700 font-medium' : 'text-gray-500'}>
                          {item.step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Enhanced Information Panel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Booking Information</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please ensure all information is correct before booking
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    You can cancel your ticket from the "My Tickets" page
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    A confirmation email will be sent to your registered email
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