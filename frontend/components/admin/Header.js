'use client';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// Zod schema for header props
const headerPropsSchema = z.object({
  title: z.string().default('Panel de Administración'),
  user: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional()
  }).nullable().optional(),
  onLogout: z.function().optional(),
  onToggleSidebar: z.function().optional(),
  sidebarOpen: z.boolean().default(true)
});

/**
 * Header - Componente de cabecera para el panel de administración
 * Integrado con el nuevo sistema de autenticación MySQL
 */
export default function Header({
  title = 'Panel de Administración',
  user = null,
  onLogout,
  onToggleSidebar,
  sidebarOpen = true
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  // Validate props with Zod
  try {
    headerPropsSchema.parse({ title, user, onLogout, onToggleSidebar, sidebarOpen });
  } catch (error) {
    console.warn('Invalid Header props:', error);
  }

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      }
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      router.push('/admin/login');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="admin-header">
      <div className="header-content">
        {/* Left Section */}
        <div className="header-left">
          {onToggleSidebar && (
            <button
              className="sidebar-toggle btn btn-outline-light btn-sm me-3"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          )}

          <h1 className="header-title">{title}</h1>
        </div>

        {/* Center Section */}
        <div className="header-center">
          <div className="current-time">
            <i className="fas fa-clock me-2"></i>
            {currentTime.toLocaleString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          {/* Notifications */}
          <button className="btn btn-outline-light btn-sm me-3" title="Notificaciones">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>

          {/* User Dropdown */}
          <div className="user-dropdown">
            <button
              className="user-button btn btn-outline-light"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user?.name || 'Administrador'}
                </span>
                <small className="user-role">
                  {user?.role || 'Admin'}
                </small>
              </div>
              <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'} ms-2`}></i>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-details">
                    <strong>{user?.name || 'Administrador'}</strong>
                    <small className="text-muted d-block">
                      {user?.email || 'admin@djjosepe.com'}
                    </small>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item"
                  onClick={() => router.push('/admin/profile')}
                >
                  <i className="fas fa-user me-2"></i>
                  Mi Perfil
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => router.push('/admin/settings')}
                >
                  <i className="fas fa-cog me-2"></i>
                  Configuración
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .admin-header {
          background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
          border-bottom: 1px solid #404040;
          padding: 1rem 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 100%;
        }

        .header-left {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .header-center {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: center;
        }

        .header-right {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: flex-end;
        }

        .header-title {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-toggle {
          border-color: #ffc107;
          color: #ffc107;
        }

        .sidebar-toggle:hover {
          background-color: #ffc107;
          color: #000;
        }

        .current-time {
          color: #cccccc;
          font-size: 0.9rem;
          text-align: center;
        }

        .user-dropdown {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          border-color: #ffc107;
          color: #ffffff;
          padding: 0.5rem 1rem;
          background: transparent;
        }

        .user-button:hover {
          background-color: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
          color: #ffc107;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffc107, #ff8c00);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          color: #cccccc;
          font-size: 0.75rem;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: #2d2d2d;
          border: 1px solid #404040;
          border-radius: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          min-width: 250px;
          z-index: 1000;
          margin-top: 0.5rem;
        }

        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid #404040;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: #ffffff;
          text-align: left;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }

        .dropdown-item.text-danger:hover {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .dropdown-divider {
          height: 1px;
          background-color: #404040;
          margin: 0.5rem 0;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #dc3545;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-wrap: wrap;
          }

          .header-center {
            order: 3;
            flex-basis: 100%;
            margin-top: 0.5rem;
            justify-content: flex-start;
          }

          .header-title {
            font-size: 1.25rem;
          }

          .current-time {
            font-size: 0.8rem;
          }

          .user-info {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}