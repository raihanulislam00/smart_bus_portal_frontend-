"use client"

import Link from "next/link";

export default function NavBar(){

return(<>
<style jsx>{`
  .nav-link:hover {
    background-color: #484c55ff !important;
  }
  .sign-up-btn:hover {
    background-color: #f1f5f9 !important;
    transform: scale(1.05);
  }
  .get-started-btn:hover {
    background-color: #69cbafff !important;
    transform: scale(1.05);
  }
`}</style>
       
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  backgroundColor: '#2563eb',
  color: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 50
}}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Link href="/" style={{
      fontSize: '24px',
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
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    }}>
      Home
    </Link>
    <Link href="/passenger/1" className="nav-link" style={{
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    }}>
      Passenger
    </Link>
    <Link href="/contact/" className="nav-link" style={{
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    }}>
     Contact
    </Link>
    
    <Link href="/about/" className="nav-link" style={{
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    }}>
     About
    </Link>
  </div>
  
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <Link href="/signup/" className="sign-up-btn" style={{
      color: '#2563eb',
      backgroundColor: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      border: '2px solid white'
    }}>
     Sign Up
    </Link>

    <Link href="/login" className="get-started-btn" style={{
      color: 'white',
      backgroundColor: '#059669',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
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