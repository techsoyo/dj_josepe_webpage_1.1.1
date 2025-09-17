// components/shared/Loading.js
'use client';

import { useEffect, useState } from 'react';

/**
 * Componente de carga optimizado con múltiples estilos
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de loading (spinner, pulse, bars, dots)
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.size - Tamaño (sm, md, lg)
 * @param {boolean} props.overlay - Si debe mostrar overlay de fondo
 */
export default function Loading({ 
  type = 'spinner', 
  message = 'Cargando...', 
  size = 'md',
  overlay = false
}) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (type === 'dots') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [type]);

  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  const containerClasses = overlay
    ? 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50'
    : 'd-flex justify-content-center align-items-center py-5';

  const renderSpinner = () => (
    <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
      <span className="visually-hidden">{message}</span>
    </div>
  );

  const renderPulse = () => (
    <div className="d-flex align-items-center">
      <div className="spinner-grow text-primary me-2" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <div className="spinner-grow text-secondary me-2" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <div className="spinner-grow text-success" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
    </div>
  );

  const renderBars = () => (
    <div className="d-flex align-items-end" style={{ height: '40px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="bg-primary me-1"
          style={{
            width: '4px',
            height: '100%',
            animation: `loading-bars 1.2s ease-in-out ${i * 0.1}s infinite`,
            transformOrigin: 'bottom'
          }}
        />
      ))}
    </div>
  );

  const renderDots = () => (
    <div className="text-center">
      <h5 className="text-primary mb-0">{message}{dots}</h5>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'pulse': return renderPulse();
      case 'bars': return renderBars();
      case 'dots': return renderDots();
      default: return renderSpinner();
    }
  };

  return (
    <div className={containerClasses} style={{ zIndex: overlay ? 9999 : 'auto' }}>
      <div className="text-center">
        {renderContent()}
        {type !== 'dots' && (
          <p className="mt-3 text-muted small">{message}</p>
        )}
      </div>

      <style jsx>{`
        @keyframes loading-bars {
          0%, 80%, 100% {
            transform: scaleY(0.2);
          }
          40% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}