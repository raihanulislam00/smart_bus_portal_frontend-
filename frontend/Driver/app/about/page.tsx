export default function About() {
  return (
    <>
      <style>{`
        .about-container {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          text-align: center;
          background: #f9fafb;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .about-container h1 {
          color: #1e3a8a;
          font-size: 28px;
          margin-bottom: 15px;
        }

        .about-container p {
          color: #334155;
          font-size: 16px;
          line-height: 1.6;
        }
      `}</style>

      <div className="about-container">
        <h1>About Us</h1>
        <p>
          Welcome to <strong>Smart Bus Portal</strong>, a platform designed to make bus travel 
          smarter, safer, and more convenient. Our mission is to simplify public transportation 
          by offering real-time updates, easy ticket booking, and reliable route information—all 
          in one place.
        </p>
      </div>
    </>
  );
}
