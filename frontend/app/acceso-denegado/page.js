'use client';

import { useRouter } from 'next/navigation';

export default function AccesoDenegado() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: '#2a2a2a',
        border: '2px solid #dc3545',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚫</div>
        
        <h1 style={{
          color: '#dc3545',
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Acceso Denegado
        </h1>

        <p style={{
          color: '#ccc',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          No tienes autorización para acceder a esta área.<br/>
          La contraseña introducida es incorrecta.
        </p>

        <button
          onClick={handleGoHome}
          style={{
            padding: '12px 30px',
            background: '#ffc107',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#ffca2c';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#ffc107';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
}