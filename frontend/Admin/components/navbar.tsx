"use client"

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function NavBar() {
  const { admin, isAuthenticated, isLoading, logout } = useAuth();

  return (<>
    <style jsx>{`
      .nav-link:hover {
        background-color: #2563eb !important; /* new blue */
        color: #fff !important;
      }
      .sign-up-btn:hover {
        background-color: #34d399 !important; /* mint green */
        transform: scale(1.05);
        color: #fff !important;
      }
      .get-started-btn:hover {
        background-color: #10b981 !important; /* emerald green */
        transform: scale(1.05);
        color: #fff !important;
      }
      .logout-btn:hover {
        background-color: #dc2626 !important; /* red */
        transform: scale(1.05);
        color: #fff !important;
      }
    `}</style>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#1e3a8a', // dark indigo
      color: 'white',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      fontFamily: 'Arial, sans-serif',
      minHeight: '70px' // Prevent layout shift
    }} className="navbar-container auth-transition">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{
          fontSize: '26px',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}>
          Smart Bus Portal
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/" className="nav-link" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          fontWeight: '500'
        }}>
          Home
        </Link>
        <Link href="/buses" className="nav-link" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          fontWeight: '500'
        }}>
          Buses
        </Link>
        
        {/* Admin-only navigation items - show with opacity during loading */}
        {(isAuthenticated && admin) && (
          <>
            <Link href="/admin/buses" className="nav-link" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              opacity: isLoading ? 0.7 : 1
            }}>
              Manage Buses
            </Link>
            <Link href="/admin/dashboard" className="nav-link" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              opacity: isLoading ? 0.7 : 1
            }}>
              Dashboard
            </Link>
            <Link href={`/admin/${admin.id}`} className="nav-link" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              opacity: isLoading ? 0.7 : 1
            }}>
              My Profile
            </Link>
          </>
        )}
        
        <Link href="/contact/" className="nav-link" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          fontWeight: '500'
        }}>
          Contact
        </Link>
        <Link href="/about/" className="nav-link" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          fontWeight: '500'
        }}>
          About
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Show auth-dependent content - no loading state */}
        {isAuthenticated && admin ? (
          <>
            {/* Notification Bell - only for authenticated admin */}
            <NotificationBell />
            
            {/* Show admin info and logout if authenticated */}
            <span style={{ 
              color: 'white', 
              fontSize: '14px',
              marginRight: '10px',
              marginLeft: '10px',
              minWidth: '120px' // Prevent layout shift
            }}>
              Welcome, {admin.name}
            </span>
            <button 
              onClick={logout}
              className="logout-btn" 
              style={{
                color: 'white',
                backgroundColor: '#dc2626', // red background
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: '2px solid #dc2626',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Show registration and login if not authenticated or still loading */}
            <div style={{ 
              minWidth: '120px', // Match the welcome message width
              display: 'flex',
              gap: '10px'
            }}>
              <Link href="/registration" className="sign-up-btn" style={{
                color: '#065f46', // darker green text
                backgroundColor: '#d1fae5', // light mint background
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: '2px solid #10b981',
                opacity: isLoading ? 0.7 : 1 // Slight opacity when loading
              }}>
                Register
              </Link>

              <Link href="/login" className="get-started-btn" style={{
                color: 'white',
                backgroundColor: '#059669', // emerald green
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: '2px solid #059669',
                opacity: isLoading ? 0.7 : 1 // Slight opacity when loading
              }}>
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  </>);
}
