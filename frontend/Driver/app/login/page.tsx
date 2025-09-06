import Link from "next/link";

export default function LoginPage() {
   return (
    <>
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }

        .loginForm {
          background: #f9fafb; 
          padding: 30px;
          width: 350px;
          border-radius: 12px;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 15px;
          text-align: left;
        }

        .loginForm label {
          font-weight: 600;
          color: #1e293b; 
          margin-bottom: 5px;
          display: block;
        }

        .loginForm input {
          width: 100%;
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .loginForm input:focus {
          border-color: #2563eb; 
        }

        .loginForm button {
          background: #2563eb;
          color: white;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .loginForm button:hover {
          background: #1e3a8a;
        }

        .loginForm p {
          font-size: 14px;
          text-align: center;
          margin-top: 10px;
        }

        .loginForm a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .loginForm a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <form className="loginForm">
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required />
          </div>

          <button type="submit">Login</button>

          <p>
            Don't have an account? <Link href="/register">Register</Link>
          </p>
        </form>
      </div>
    </>
  );
}