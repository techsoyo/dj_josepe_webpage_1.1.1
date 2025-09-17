'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DJSecretAccess() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Ingresa la contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dj/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          router.push('/admin/dashboard');
        } else {
          // Contraseña incorrecta - redirigir a página de acceso denegado
          router.push('/acceso-denegado');
        }
      } else {
        // Error del servidor o contraseña incorrecta
        router.push('/acceso-denegado');
      }
    } catch (err) {
      // Error de conexión - redirigir a página de acceso denegado
      router.push('/acceso-denegado');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
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
        border: '2px solid #ffc107',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎧</div>
        <h1 style={{
          color: '#ffc107',
          margin: '0 0 20px 0',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          DJ Josep - Acceso Privado
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #555',
                borderRadius: '8px',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>
      </div>
    </div>
  );
}