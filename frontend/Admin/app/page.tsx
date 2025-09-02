'use client';
import Header from '../components/Header';
import Navbar from '@/components/navbar';
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e6f0ff, #f9f9ff)',
      display: 'flex',
      flexDirection: 'column' as const
    },
    main: {
      flex: 1,
      padding: '30px'
    },
    contentSection: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
    },
    imageContainer: {
      position: 'relative' as const,
      width: '100%',
      height: '350px',
      marginBottom: '30px',
      borderRadius: '16px',
      overflow: 'hidden'
    },
    overlay: {
      position: 'absolute' as const,
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))'
    },
    heroText: {
      position: 'absolute' as const,
      inset: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center'
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      textShadow: '2px 2px 6px rgba(0,0,0,0.4)'
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      fontWeight: 500
    },
    featuresBox: {
      background: 'linear-gradient(135deg, #f0f8ff, #fdfdff)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    },
    featureItem: {
      marginBottom: '10px',
      padding: '12px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <Header />
      <main style={styles.main}>
        <div style={styles.contentSection}>
          {}
          <div style={styles.imageContainer}>
            <Image
              src="/bus.jpeg"
              alt="Smart Bus Portal - Modern Transportation"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div style={styles.overlay}></div>
            <div style={styles.heroText as React.CSSProperties}>
              <h1 style={styles.heroTitle}>Smart Bus Portal</h1>
              <p style={styles.heroSubtitle}>First Choice for your Every Journey</p>
            </div>
          </div>

          
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
            Welcome to Smart Bus Portal
          </h2>

          <div style={styles.featuresBox}>
            <p style={{ color: '#555', marginBottom: '20px', textAlign: 'center', fontSize: '1.1rem' }}>
              Experience hassle-free bus travel with our smart transportation solution, 
              making your journey safer, faster, and more convenient.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={styles.featureItem}> Easy booking system</li>
              <li style={styles.featureItem}> Real-time bus tracking</li>
              <li style={styles.featureItem}> Secure payment options</li>
              <li style={styles.featureItem}> 24/7 customer support</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
