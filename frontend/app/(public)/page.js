'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Root page - Redirige automáticamente a /home
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir inmediatamente a /home
    router.replace('/home');
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-light">Redirigiendo a DJ Josepe...</p>
      </div>
    </div>
  );
}