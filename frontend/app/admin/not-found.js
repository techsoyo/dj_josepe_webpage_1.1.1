'use client';

export default function Admin404() {
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
        maxWidth: '400px',
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
          Página No Encontrada
        </h1>
        <p style={{ color: '#ccc', margin: 0, fontSize: '16px' }}>
          La página que buscas no existe en el panel de administración.
        </p>
      </div>
    </div>
  );
}