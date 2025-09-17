import React from 'react';

/**
 * Componente LoadingSpinner
 * Muestra un indicador de carga visual
 */
export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`}>
      <div 
        className={`spinner-border text-primary ${sizeClasses[size]}`} 
        role="status"
        aria-hidden="true"
      >
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}

// También exportamos como LoadingSpinner para compatibilidad
export { LoadingSpinner };