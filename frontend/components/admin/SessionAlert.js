'use client';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import authService from '../../services/authService';

// Zod schema for session alert props
const sessionAlertPropsSchema = z.object({
  warningThreshold: z.number().default(300), // 5 minutes in seconds
  checkInterval: z.number().default(60000), // 1 minute in milliseconds
  autoExtend: z.boolean().default(false)
});

/**
 * SessionAlert - Componente para alertar sobre expiración de sesión
 * Integrado con el nuevo sistema de autenticación MySQL
 */
export default function SessionAlert({
  warningThreshold = 300, // 5 minutes
  checkInterval = 60000, // 1 minute
  autoExtend = false
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExtending, setIsExtending] = useState(false);

  // Validate props with Zod
  try {
    sessionAlertPropsSchema.parse({ warningThreshold, checkInterval, autoExtend });
  } catch (error) {
    console.warn('Invalid SessionAlert props:', error);
  }

  useEffect(() => {
    const checkSessionExpiry = () => {
      // Simplificar: solo verificar si hay sesión válida usando el método que existe
      authService.verifySession()
        .then(session => {
          if (session && session.valid) {
            // Sesión válida, ocultar alerta
            setShowAlert(false);
            setTimeRemaining(300); // Reset timer
          } else {
            // Sesión inválida o expirada
            setShowAlert(true);
            setTimeRemaining(0);
          }
        })
        .catch(error => {
          console.error('Error checking session:', error);
          // En caso de error, mostrar alerta
          setShowAlert(true);
          setTimeRemaining(0);
        });
    };

    // Initial check
    checkSessionExpiry();

    // Set up interval - reducir frecuencia para evitar spam
    const interval = setInterval(checkSessionExpiry, Math.max(checkInterval, 30000)); // mínimo 30 segundos

    return () => clearInterval(interval);
  }, [checkInterval, autoExtend]);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  const handleExtendSession = async () => {
    try {
      setIsExtending(true);
      // Verificar sesión en lugar de refresh (método que existe)
      const session = await authService.verifySession();
      
      if (session && session.valid) {
        setShowAlert(false);
        // Show success message briefly
        setTimeout(() => {
          // Could show a toast notification here
        }, 1000);
      } else {
        // Si la sesión no es válida, redirigir al login
        handleSessionExpired();
      }

    } catch (error) {
      console.error('Failed to extend session:', error);
      handleSessionExpired();
    } finally {
      setIsExtending(false);
    }
  };

  const handleSessionExpired = () => {
    // Hacer logout usando el método que existe
    authService.logout().catch(console.error);
    setShowAlert(false);

    // Redirect to login page (la nueva URL de acceso)
    if (typeof window !== 'undefined') {
      window.location.href = '/dj-josepe-aqui-mando-yo?expired=true';
    }
  };

  const handleDismiss = () => {
    setShowAlert(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!showAlert) {
    return null;
  }

  return (
    <div className="session-alert">
      <div className="alert-content">
        <div className="alert-icon">
          <i className="fas fa-clock"></i>
        </div>

        <div className="alert-message">
          <h4>Sesión por Expirar</h4>
          <p>
            Tu sesión expirará en <strong>{formatTime(timeRemaining)}</strong>.
            ¿Deseas extenderla?
          </p>
        </div>

        <div className="alert-actions">
          <button
            className="btn btn-warning btn-sm"
            onClick={handleExtendSession}
            disabled={isExtending}
          >
            {isExtending ? (
              <>
                <i className="fas fa-spinner fa-spin me-1"></i>
                Extendiendo...
              </>
            ) : (
              <>
                <i className="fas fa-refresh me-1"></i>
                Extender Sesión
              </>
            )}
          </button>

          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={handleDismiss}
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .session-alert {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          color: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease-out;
          max-width: 400px;
          min-width: 300px;
        }

        .alert-content {
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .alert-icon {
          font-size: 1.5rem;
          color: #fff;
          margin-top: 0.25rem;
        }

        .alert-message {
          flex: 1;
        }

        .alert-message h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .alert-message p {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .alert-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }

        .btn-warning {
          background: #ffc107;
          color: #000;
        }

        .btn-warning:hover:not(:disabled) {
          background: #ffb300;
          transform: translateY(-1px);
        }

        .btn-warning:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-outline-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-outline-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .me-1 {
          margin-right: 0.25rem;
        }

        .ms-2 {
          margin-left: 0.5rem;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .session-alert {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            min-width: auto;
          }

          .alert-content {
            padding: 1rem;
            flex-direction: column;
            text-align: center;
          }

          .alert-actions {
            justify-content: center;
            width: 100%;
          }

          .btn {
            flex: 1;
            min-width: 120px;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .session-alert {
            border: 2px solid #fff;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .session-alert {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}