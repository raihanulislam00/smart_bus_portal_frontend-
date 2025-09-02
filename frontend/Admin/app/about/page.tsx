'use client';
import NavBar from '../../components/navbar';

export default function AboutUs() {
  return (
    <div style={{ backgroundColor: '#fff7ed', minHeight: '100vh' }}>
      <NavBar />
      <div
        style={{
          maxWidth: '850px',
          margin: '30px auto',
          padding: '50px 25px',
          fontFamily: 'Segoe UI, sans-serif',
          lineHeight: '1.7',
          color: '#333',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1
            style={{
              fontSize: '2.8rem',
              color: '#f97316',
              marginBottom: '12px',
              borderBottom: '4px solid #14b8a6',
              paddingBottom: '12px',
              display: 'inline-block',
            }}
          >
            About Us
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
            Smart Bus Portal – Shaping the Future of Transportation in Bangladesh
          </p>
        </header>

        <section style={{ marginBottom: '45px' }}>
          <h2
            style={{
              fontSize: '1.9rem',
              color: '#0d9488',
              marginBottom: '15px',
              borderLeft: '5px solid #f97316',
              paddingLeft: '15px',
            }}
          >
            Our Mission
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
            At Smart Bus Portal, we want to make everyday bus travel in Bangladesh
            easier and more reliable. We know the challenges passengers face—long
            waits, uncertainty, and lack of proper information. That’s why we’re
            building a platform where you can check bus timings, track your ride
            in real time, and book tickets without hassle. Our goal is simple: to
            give passengers peace of mind, support drivers with better tools, and
            make public transport a smoother experience for everyone.
          </p>
        </section>

        <section style={{ marginBottom: '45px' }}>
          <h2
            style={{
              fontSize: '1.9rem',
              color: '#0d9488',
              marginBottom: '15px',
              borderLeft: '5px solid #f97316',
              paddingLeft: '15px',
            }}
          >
            Our Vision
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
            Smart Bus Portal is a comprehensive platform that connects passengers
            with bus services, providing real-time information, easy booking, and
            seamless travel experiences. Our platform serves passengers, drivers,
            and administrators with tailored solutions for each user type.
          </p>
        </section>

        <section style={{ marginBottom: '45px' }}>
          <h2
            style={{
              fontSize: '1.9rem',
              color: '#0d9488',
              marginBottom: '15px',
              borderRadius: '10px',
              boxShadow: '0 3px 10px rgba(249, 115, 22, 0.15)',
              background:
                'linear-gradient(90deg, #fef3c7 0%, #fff7ed 100%)',
              padding: '12px 15px',
            }}
          >
            Our Services
          </h2>
          <ul style={{ fontSize: '1.1rem', paddingLeft: '25px' }}>
            <li style={{ marginBottom: '10px' }}>
              Real-time bus tracking and schedules
            </li>
            <li style={{ marginBottom: '10px' }}>Easy online ticket booking</li>
            <li style={{ marginBottom: '10px' }}>Route planning and optimization  </li>
            <li style={{ marginBottom: '10px' }}>Driver management system</li>
            <li style={{ marginBottom: '10px' }}>Passenger management portal</li>
            <li style={{ marginBottom: '10px' }}>Administrative dashboard</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
