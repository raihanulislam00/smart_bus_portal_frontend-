export default function Register(){
   return (
    <>
      <style>{`
        .registerForm {
          background: #f9fafb; 
          padding: 30px;
          margin: 0 auto;
          width: 350px;
          border-radius: 12px;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 15px;
          text-align: left;
        }

        .registerForm label {
          font-weight: 600;
          color: #1e293b; 
          margin-bottom: 5px;
          display: block;
        }

        .registerForm input {
          width: 100%;
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .registerForm input:focus {
          border-color: #2563eb; 
        }

        .registerForm button {
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

        .registerForm button:hover {
          background: #1e3a8a;
        }

        h1 {
          margin: 20px 0;
          color: #1e3a8a;
          font-size: 26px;
        }
      `}</style>

      <h1 className="text-center">
        Welcome to Smart Bus Portal <br />
        Please Register
      </h1>

      <form className="registerForm">
        <div>
          <label htmlFor="name">Full Name :</label>
          <input type="text" id="name" placeholder="Enter your name" required />
        </div>

        <div>
          <label htmlFor="email">Email :</label>
          <input type="email" id="email" placeholder="Enter your email" required />
        </div>

        <div>
          <label htmlFor="password">Password :</label>
          <input type="password" id="password" placeholder="Enter your password" required />
        </div>

        <button type="submit">Register</button>
      </form>
    </>
  );
}