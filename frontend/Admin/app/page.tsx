'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Navbar from '@/components/navbar';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #eff0f7ff 0%, #764ba2 100%);
          min-height: 400px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          padding: 80px 20px;
          text-align: center;
          color: white;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          font-weight: 300;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn-primary {
          background: #ff6b6b;
          color: white;
          padding: 14px 28px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }
        
        .btn-primary:hover {
          background: #ff5252;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }
        
        .btn-secondary {
          background: transparent;
          color: white;
          padding: 14px 28px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid white;
          font-size: 1rem;
        }
        
        .btn-secondary:hover {
          background: white;
          color: #667eea;
          transform: translateY(-2px);
        }
        
        .features-section {
          padding: 80px 20px;
          background: #f8fafc;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
        }
        
        .section-subtitle {
          text-align: center;
          font-size: 1.1rem;
          color: #718096;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }
        
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #a1a4b1ff, #764ba2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }
        
        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.75rem;
        }
        
        .feature-description {
          color: #718096;
          line-height: 1.6;
        }
        
        .cta-section {
          background: linear-gradient(135deg, #827096ff, #cfc8d6ff);
          padding: 60px 20px;
          text-align: center;
          color: white;
        }
        
        .cta-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .cta-description {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .stats-section {
          padding: 60px 20px;
          background: white;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #bdc3dfff;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          color: #718096;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary, .btn-secondary {
            min-width: 200px;
          }
          
          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>
      
      <div className="min-h-screen">
        <Navbar />
        <Header />
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="container">
              <h1 className="hero-title">AIUB Bus Portal</h1>
              <p className="hero-subtitle">Start's Your AIUB Journey From Here</p>
              <div className="hero-buttons">
                <Link href="/buses" className="btn-primary">
                  Book Your Journey
                </Link>
                <Link href="/about" className="btn-secondary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Welcome to Smart Bus Portal</h2>
            <p className="section-subtitle">
              Experience hassle-free bus travel with our smart transportation solution, 
              making your journey safer, faster, and more convenient.
            </p>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3 className="feature-title">Easy Booking System</h3>
                <p className="feature-description">
                  Book your tickets in just a few clicks with our intuitive booking platform.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3 className="feature-title">Real-time Bus Tracking</h3>
                <p className="feature-description">
                  Track your bus location in real-time and never miss your ride again.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💳</div>
                <h3 className="feature-title">Secure Payment Options</h3>
                <p className="feature-description">
                  Multiple secure payment methods to ensure safe and convenient transactions.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🛠️</div>
                <h3 className="feature-title">24/7 Customer Support</h3>
                <p className="feature-description">
                  Round-the-clock customer support to assist you whenever you need help.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div>
                <div className="stat-number">1000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div>
                <div className="stat-number">50+</div>
                <div className="stat-label">Bus Routes</div>
              </div>
              <div>
                <div className="stat-number">24/7</div>
                <div className="stat-label">Service Available</div>
              </div>
              <div>
                <div className="stat-number">99%</div>
                <div className="stat-label">On-Time Performance</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h3 className="cta-title">Ready to Start Your Journey?</h3>
            <p className="cta-description">
              Join thousands of satisfied customers who trust Smart Bus Portal for their travel needs.
            </p>
            <div className="hero-buttons">
              <Link href="/buses" className="btn-primary">
                View Available Buses
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
