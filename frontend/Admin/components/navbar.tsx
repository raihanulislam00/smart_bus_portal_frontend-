"use client"

import Link from "next/link";

export default function NavBar() {

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
      fontFamily: 'Arial, sans-serif'
    }}>
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
        <Link href="/admin/1" className="nav-link" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          fontWeight: '500'
        }}>
          Admin
        </Link>
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
        <Link href="/registration" className="sign-up-btn" style={{
          color: '#065f46', // darker green text
          backgroundColor: '#d1fae5', // light mint background
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          border: '2px solid #10b981'
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
          border: '2px solid #059669'
        }}>
          Login
        </Link>
      </div>
    </div>
  </>);
}
