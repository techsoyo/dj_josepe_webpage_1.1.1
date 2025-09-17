'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PinAccess() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  const [pinValue, setPinValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // PIN por defecto - configurable
  const ADMIN_PIN = '1234';

  useEffect(() => {
    if (pinValue === ADMIN_PIN) {
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
        setPinValue('');
        setShowSuccess(false);
      }, 1000);
    }
  }, [pinValue, router]);

  // No mostrar en rutas admin
  if (isAdminRoute) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 1000
    }}>
      <input
        type="password"
        placeholder="•••"
        value={pinValue}
        onChange={(e) => setPinValue(e.target.value)}
        maxLength={4}
        style={{
          width: '60px',
          height: '30px',
          fontSize: '12px',
          textAlign: 'center',
          border: showSuccess ? '2px solid #28a745' : '1px solid #666',
          borderRadius: '4px',
          background: showSuccess ? '#d4edda' : 'rgba(0,0,0,0.8)',
          color: showSuccess ? '#155724' : '#fff',
          outline: 'none',
          transition: 'all 0.3s ease'
        }}
      />
      {showSuccess && (
        <div style={{
          position: 'absolute',
          top: '-35px',
          right: '0',
          background: '#28a745',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }}>
          ✓ Acceso Admin
        </div>
      )}
    </div>
  );
}