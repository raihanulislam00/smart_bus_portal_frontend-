import NavBar from '../../components/navbar';
import RegistrationForm from '../../components/RegistrationForm';

export const metadata = {
  title: 'Admin Registration | Smart Bus Portal',
  description: 'Create your admin account to manage the smart bus portal',
};

export default function Registration() {
  const styles = {
    container: {
      background: 'linear-gradient(135deg, #a6afd4ff 0%, #967eaeff 100%)',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
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
    formContainer: {
      maxWidth: '720px',
      width: '100%',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
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
    <div style={styles.container}>
      <div style={styles.navbarWrapper}>
        <NavBar />
      </div>
      
      <div style={styles.mainContent}>
        <div style={styles.formContainer}>
          <div style={styles.header}>
            <h1 style={styles.title}>Admin Registration</h1>
            <p style={styles.subtitle}>Create your admin account </p>
          </div>
          
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
