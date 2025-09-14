'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { AuthService } from '@/lib/auth-service';
import NotificationButton from './NotificationButton';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth status changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    // Add event listeners for login/logout events
    window.addEventListener('passenger-login', handleAuthChange);
    window.addEventListener('passenger-logout', handleAuthChange);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('passenger-login', handleAuthChange);
      window.removeEventListener('passenger-logout', handleAuthChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      if (isAuth) {
        const passenger = await AuthService.getCurrentPassenger();
        setIsLoggedIn(true);
        setUserName(passenger.fullName || passenger.username);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    } catch (error) {
      // User is not authenticated
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsLoggedIn(false);
      setUserName('');
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('passenger-logout'));
    } catch (error) {
      // Even if logout fails, clear local state and redirect
      setIsLoggedIn(false);
      setUserName('');
      window.location.href = '/';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-2 text-2xl font-bold text-white hover:text-blue-200 transition-all duration-300 transform hover:scale-105">
              <span className="text-3xl group-hover:animate-bounce"></span>
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Smart Bus Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {!isLoggedIn && (
              <>
                <Link href="/" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20">
                  Home
                </Link>
                <Link href="/services" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20">
                  Services
                </Link>
                <Link href="/about" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20">
                  About
                </Link>
                <Link href="/contact" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20">
                  Contact
                </Link>
              </>
            )}
            
            {/* User Actions */}
            <div className="flex items-center space-x-3 ml-4">
              {isLoggedIn ? (
                <>
                  {/* Passenger Navigation Menu */}
                  <Link href="/passenger/dashboard" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20">
                    Dashboard
                  </Link>
                  <Link href="/passenger/tickets" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20">
                    My Tickets
                  </Link>
                  <Link href="/passenger/bookings" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20">
                    Book Ticket
                  </Link>
                  
                  {/* Notification Button */}
                  <NotificationButton className="mx-2" />
                  
                  {/* User Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 shadow-lg"
                    >
                      <span className="text-lg"></span>
                      <span className="max-w-24 truncate">{userName}</span>
                      <svg className={`w-4 h-4 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                          <p className="text-sm text-gray-500 truncate">{userName}</p>
                        </div>
                        <Link
                          href="/passenger/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <span className="text-lg"></span>
                          <span>My Profile</span>
                        </Link>
                       
                        <div className="border-t border-gray-100 mt-2"></div>
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <span className="text-lg"></span>
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/passenger/login" className="bg-white/20 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Login
                  </Link>
                  <Link href="/passenger/signup" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-green-400/30">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/25 p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-4 duration-300">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-gradient-to-b from-blue-800/95 to-blue-900/95 backdrop-blur-sm border-t border-white/10">
              {!isLoggedIn && (
                <>
                  <Link href="/" className="text-white/90 hover:text-white hover:bg-white/10 flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300">
                    <span></span>
                    <span>Home</span>
                  </Link>
                  <Link href="/services" className="text-white/90 hover:text-white hover:bg-white/10 flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300">
                    <span></span>
                    <span>Services</span>
                  </Link>
                  <Link href="/about" className="text-white/90 hover:text-white hover:bg-white/10 flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300">
                    <span></span>
                    <span>About</span>
                  </Link>
                  <Link href="/contact" className="text-white/90 hover:text-white hover:bg-white/10 flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300">
                    <span></span>
                    <span>Contact</span>
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-white/20">
                <div className="flex flex-col space-y-3">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 text-sm bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                        <div className="flex items-center space-x-2 text-white">
                          <span className="text-lg"></span>
                          <div>
                            <p className="font-medium">Welcome back!</p>
                            <p className="text-blue-100 text-xs truncate">{userName}</p>
                          </div>
                        </div>
                      </div>
                      <Link href="/passenger/dashboard" className="text-white/90 hover:text-white hover:bg-white/10 flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300">
                        <span></span>
                        <span>Dashboard</span>
                      </Link>
                      <Link href="/passenger/tickets" className="text-white/90 hover:text-white hover:bg-white/10 flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300">
                        <span></span>
                        <span>My Tickets</span>
                      </Link>
                      <Link href="/passenger/bookings" className="text-white/90 hover:text-white hover:bg-white/10 flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300">
                        <span></span>
                        <span>Book Ticket</span>
                      </Link>
                      <Link href="/passenger/profile" className="text-white/90 hover:text-white hover:bg-white/10 flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300">
                        <span></span>
                        <span>Profile</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 text-center font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                      >
                        <span></span>
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/passenger/login" className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 text-center font-medium transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center justify-center space-x-2">
                        <span></span>
                        <span>Login</span>
                      </Link>
                      <Link href="/passenger/signup" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 text-center font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
                        <span></span>
                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
