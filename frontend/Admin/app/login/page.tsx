import NavBar from '../../components/navbar';
import LoginForm from '../../components/LoginForm';

export const metadata = {
  title: 'Admin Login | Smart Bus Portal',
  description: 'Login to your admin account to manage the smart bus portal',
};

export default function LoginPage() {
  const styles = {
    pageContainer: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '20px',
    },
    navbarWrapper: {
      marginBottom: '20px',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      maxWidth: '480px',
      width: '100%',
      margin: '0 auto',
      padding: '48px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '400',
      margin: 0,
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.navbarWrapper}>
        <NavBar />
      </div>
      
      <div style={styles.mainContent}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Login</h1>
            <p style={styles.subtitle}>Login to your account with valid credentials</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}