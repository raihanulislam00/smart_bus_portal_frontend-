'use client';
import NavBar from '../../components/navbar';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <>
      <style jsx>{`
        .about-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .hero-section {
          background: linear-gradient(135deg, #bec3d7ff 0%, #764ba2 100%);
          color: white;
          padding: 100px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300"><polygon fill="%23ffffff0a" points="0,300 1000,300 1000,0"/></svg>') no-repeat center center;
          background-size: cover;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
          background: linear-gradient(45deg, #ffffff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          opacity: 0.9;
          font-weight: 300;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px;
        }

        .section {
          margin-bottom: 5rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 2px;
        }

        .section-content {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #4a5568;
          text-align: center;
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        .mission-vision-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 3rem;
          margin: 4rem 0;
        }

        .mission-card, .vision-card {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .mission-card::before, .vision-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .mission-card:hover, .vision-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .card-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .card-description {
          color: #718096;
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .features-section {
          background: white;
          border-radius: 25px;
          padding: 4rem 3rem;
          margin: 4rem 0;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .feature-card {
          background: #f8fafc;
          padding: 2.5rem;
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .feature-card:hover {
          background: white;
          border-color: #667eea;
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.15);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .feature-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #718096;
          line-height: 1.6;
        }

        .stats-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 25px;
          padding: 4rem 3rem;
          margin: 4rem 0;
          text-align: center;
        }

        .stats-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .stat-label {
          font-size: 1.2rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .team-section {
          text-align: center;
          margin: 5rem 0;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin-top: 3rem;
        }

        .team-card {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          text-align: center;
        }

        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .team-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: white;
          border: 4px solid white;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          overflow: hidden;
        }

        .team-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .team-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .team-role {
          color: #667eea;
          font-weight: 600;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .team-description {
          color: #718096;
          line-height: 1.6;
        }

        .cta-section {
          background: linear-gradient(135deg, #4299e1, #3182ce);
          color: white;
          padding: 5rem 3rem;
          border-radius: 25px;
          text-align: center;
          margin-top: 5rem;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300"><polygon fill="%23ffffff08" points="0,300 1000,300 1000,0"/></svg>') no-repeat center center;
          background-size: cover;
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .cta-description {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 3rem;
          background: white;
          color: #3182ce;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 255, 255, 0.4);
          color: #2d3748;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.8rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .container {
            padding: 50px 20px;
          }

          .mission-vision-grid,
          .features-grid,
          .team-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .features-section,
          .stats-section,
          .cta-section {
            padding: 3rem 2rem;
          }

          .cta-title {
            font-size: 2.2rem;
          }
        }
      `}</style>

      <div className="about-container">
        <NavBar />
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">About Smart Bus Portal</h1>
            <p className="hero-subtitle">
              Revolutionizing transportation across Bangladesh with cutting-edge technology, 
              exceptional service, and a commitment to connecting communities nationwide.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container">
          {/* Mission & Vision */}
          <section className="section">
            <div className="mission-vision-grid">
              <div className="mission-card">
                <span className="card-icon">🎯</span>
                <h3 className="card-title">Our Mission</h3>
                <p className="card-description">
                  To transform the way people travel across Bangladesh by providing a seamless, 
                  reliable, and efficient transportation platform that connects passengers with 
                  the best bus services available. We believe smart technology can make travel 
                  safer, more convenient, and accessible to everyone.
                </p>
              </div>
              
              <div className="vision-card">
                <span className="card-icon">🌟</span>
                <h3 className="card-title">Our Vision</h3>
                <p className="card-description">
                  To become Bangladesh's leading digital transportation platform, enabling millions 
                  of people to travel with confidence and ease. We envision a future where booking 
                  a bus ticket is as simple as a few clicks, and every journey is a step towards 
                  a more connected nation.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <h2 className="section-title">What Makes Us Different</h2>
            <p className="section-content">
              We combine innovation, reliability, and customer-first approach to deliver 
              an unmatched travel experience across Bangladesh.
            </p>
            
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">🚀</span>
                <h3 className="feature-title">Innovation First</h3>
                <p className="feature-description">
                  Cutting-edge technology with real-time tracking, smart booking systems, 
                  and seamless user experiences that set industry standards.
                </p>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🛡️</span>
                <h3 className="feature-title">Safety & Security</h3>
                <p className="feature-description">
                  Your safety is our priority. We work with verified operators and maintain 
                  strict safety standards across all our services.
                </p>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">💫</span>
                <h3 className="feature-title">Customer Excellence</h3>
                <p className="feature-description">
                  Every decision is centered around improving your travel experience with 
                  24/7 support and exceptional customer service.
                </p>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🌍</span>
                <h3 className="feature-title">Nationwide Coverage</h3>
                <p className="feature-description">
                  From major cities to remote areas, we're expanding our network to connect 
                  every corner of Bangladesh seamlessly.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <h2 className="stats-title">Our Impact in Numbers</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Happy Travelers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Partner Operators</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Cities Connected</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.8%</div>
                <div className="stat-label">Reliability Rate</div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="team-section">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-content">
              Our passionate team of professionals works tirelessly to ensure you have 
              the best travel experience possible, combining expertise with dedication.
            </p>
            
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">
                  <img src="/adminReza.jpg" alt="Shahriar Reza" />
                </div>
                <h3 className="team-name">Shahriar Reza</h3>
                <p className="team-role">CEO & Founder</p>
                <p className="team-description">
                  Visionary leader with 10+ years in transportation technology, passionate 
                  about connecting Bangladesh through innovative smart solutions and sustainable growth.
                </p>
              </div>
              
              <div className="team-card">
                <div className="team-avatar">👩‍💻</div>
                <h3 className="team-name">Development Team</h3>
                <p className="team-role">Technical Excellence</p>
                <p className="team-description">
                  Our skilled developers ensure our platform runs smoothly 24/7, constantly 
                  innovating with cutting-edge technology to enhance your experience.
                </p>
              </div>
              
              <div className="team-card">
                <div className="team-avatar">🎯</div>
                <h3 className="team-name">Support Team</h3>
                <p className="team-role">Customer Success</p>
                <p className="team-description">
                  Dedicated support professionals available round-the-clock to assist you 
                  with personalized service and comprehensive travel support.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">Ready to Start Your Journey?</h3>
              <p className="cta-description">
                Join thousands of satisfied customers who trust Smart Bus Portal for their 
                travel needs. Experience the future of transportation today.
              </p>
              <Link href="/buses" className="cta-button">
                Book Your Trip Now →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
