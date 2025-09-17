'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = ({ collapsed, onToggle }) => {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState(['main']);

  const menuGroups = [
    {
      id: 'main',
      label: 'Principal',
      items: [
        {
          href: '/admin/dashboard',
          label: 'Dashboard',
          icon: 'bi-speedometer2',
          description: 'Vista general del sitio'
        }
      ]
    },
    {
      id: 'content',
      label: 'Contenido',
      items: [
        {
          href: '/admin/sets',
          label: 'Sets',
          icon: 'bi-music-note-list',
          description: 'Gestionar sets musicales',
          badge: '8'
        },
        {
          href: '/admin/gallery',
          label: 'Galería',
          icon: 'bi-images',
          description: 'Gestionar imágenes'
        },
        {
          href: '/admin/events',
          label: 'Eventos',
          icon: 'bi-calendar-event',
          description: 'Próximos eventos'
        }
      ]
    },
    {
      id: 'communication',
      label: 'Comunicación',
      items: [
        {
          href: '/admin/contacts',
          label: 'Mensajes',
          icon: 'bi-envelope',
          description: 'Mensajes de contacto',
          badge: '3',
          badgeColor: 'bg-danger'
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      items: [
        {
          href: '/admin/analytics',
          label: 'Estadísticas',
          icon: 'bi-graph-up',
          description: 'Métricas y análisis'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Configuración',
      items: [
        {
          href: '/admin/settings',
          label: 'Configuración',
          icon: 'bi-gear',
          description: 'Ajustes del sistema'
        }
      ]
    }
  ];

  const toggleGroup = (groupId) => {
    if (collapsed) return;
    
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <aside className={`admin-sidebar bg-dark text-light ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <i className="bi bi-vinyl-fill text-warning fs-3 me-2"></i>
            {!collapsed && (
              <div>
                <div className="fw-bold text-warning">DJ José Pe</div>
                <small className="text-muted">Admin Panel</small>
              </div>
            )}
          </div>
          
          <button
            className="btn btn-sm btn-outline-secondary d-md-none"
            onClick={onToggle}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav flex-grow-1 overflow-auto">
        <div className="p-2">
          {menuGroups.map((group) => (
            <div key={group.id} className="nav-group mb-3">
              {/* Group Header */}
              {!collapsed && (
                <button
                  className="nav-group-header btn btn-link text-decoration-none p-2 w-100 text-start border-0"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted small text-uppercase fw-bold">
                      {group.label}
                    </span>
                    <i className={`bi bi-chevron-${
                      expandedGroups.includes(group.id) ? 'down' : 'right'
                    } text-muted small`}></i>
                  </div>
                </button>
              )}

              {/* Group Items */}
              <div className={`nav-group-items ${
                collapsed || expandedGroups.includes(group.id) ? '' : 'd-none'
              }`}>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link d-flex align-items-center p-2 rounded text-decoration-none position-relative ${
                      isActive(item.href)
                        ? 'bg-warning text-dark fw-bold'
                        : 'text-light hover-bg-secondary'
                    }`}
                    title={collapsed ? item.label : item.description}
                  >
                    <i className={`${item.icon} fs-5 ${!collapsed ? 'me-3' : ''}`}></i>
                    
                    {!collapsed && (
                      <div className="flex-grow-1">
                        <div className="nav-link-label">{item.label}</div>
                        {item.description && (
                          <small className="nav-link-desc text-muted d-block">
                            {item.description}
                          </small>
                        )}
                      </div>
                    )}
                    
                    {item.badge && (
                      <span className={`badge rounded-pill ms-auto ${
                        item.badgeColor || 'bg-warning text-dark'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Active indicator */}
                    {isActive(item.href) && (
                      <div className="position-absolute top-0 start-0 h-100 bg-warning" 
                           style={{ width: '3px' }}></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer p-3 border-top border-secondary">
        {!collapsed ? (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <div className="text-warning small fw-bold">Estado del Sistema</div>
              <div className="d-flex align-items-center mt-1">
                <div className="bg-success rounded-circle me-2" 
                     style={{ width: '8px', height: '8px' }}></div>
                <small className="text-muted">Todo funcionando</small>
              </div>
            </div>
            
            <Link
              href="/"
              className="btn btn-outline-warning btn-sm"
              title="Ver sitio web"
              target="_blank"
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link
              href="/"
              className="btn btn-outline-warning btn-sm"
              title="Ver sitio web"
              target="_blank"
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </Link>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .admin-sidebar {
          width: 280px;
          min-height: 100vh;
          transition: width 0.3s ease;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .admin-sidebar.collapsed {
          width: 80px;
        }
        
        .hover-bg-secondary:hover {
          background-color: rgba(108, 117, 125, 0.2) !important;
        }
        
        .nav-link {
          transition: all 0.2s ease;
          margin-bottom: 2px;
        }
        
        .nav-link:hover {
          transform: translateX(2px);
        }
        
        .nav-group-header:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        
        .sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: #6c757d transparent;
        }
        
        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-nav::-webkit-scrollbar-thumb {
          background-color: #6c757d;
          border-radius: 3px;
        }
        
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1050;
            transform: translateX(-100%);
          }
          
          .admin-sidebar:not(.collapsed) {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;