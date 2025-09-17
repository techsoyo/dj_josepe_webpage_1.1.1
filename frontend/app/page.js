'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página raíz - Redirige automáticamente a /home
 * Mantiene la funcionalidad del frontend original
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir inmediatamente a /home
    router.replace('/home');
  }, [router]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="text-center text-light">
        <div className="spinner-border text-warning mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <h3 className="text-warning">DJ Josepe</h3>
        <p className="text-muted">Cargando la experiencia musical...</p>
      </div>
    </div>
  );
}