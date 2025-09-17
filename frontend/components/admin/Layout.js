'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from './AdminLayout';
import DashboardLayout from './DashboardLayout';

const Layout = ({ children }) => {
  const pathname = usePathname();
  
  // Rutas que usan DashboardLayout
  const dashboardRoutes = [
    '/admin/dashboard',
    '/admin/analytics'
  ];
  
  // Rutas que usan AdminLayout simple
  const simpleRoutes = [
    '/admin/sets',
    '/admin/contacts',
    '/admin/gallery',
    '/admin/settings'
  ];
  
  // Rutas que no necesitan layout (como login) - eliminamos /admin/login
  const noLayoutRoutes = [
    // '/admin/login' - eliminado ya que no existe más
  ];
  
  // Determinar qué layout usar
  if (noLayoutRoutes.includes(pathname)) {
    return children;
  }
  
  if (dashboardRoutes.includes(pathname)) {
    const title = pathname === '/admin/dashboard' ? 'Dashboard' : 'Analytics';
    return (
      <DashboardLayout title={title}>
        {children}
      </DashboardLayout>
    );
  }
  
  if (simpleRoutes.includes(pathname)) {
    return (
      <AdminLayout>
        <div className="admin-page">
          {/* Header de página */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 text-warning mb-1">
                {getPageTitle(pathname)}
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/dashboard" className="text-warning text-decoration-none">
                      Dashboard
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-light" aria-current="page">
                    {getPageTitle(pathname)}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          
          {/* Contenido de la página */}
          <div className="admin-page-content">
            {children}
          </div>
        </div>
        
        <style jsx>{`
          .admin-page {
            animation: slideInFromRight 0.3s ease-out;
          }
          
          @keyframes slideInFromRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          .breadcrumb {
            background: none;
            padding: 0;
            margin: 0;
          }
          
          .breadcrumb-item + .breadcrumb-item::before {
            content: "/";
            color: #6c757d;
          }
        `}</style>
      </AdminLayout>
    );
  }
  
  // Layout por defecto
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
};

// Helper para obtener títulos de página
const getPageTitle = (pathname) => {
  const titles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/sets': 'Gestionar Sets',
    '/admin/contacts': 'Mensajes de Contacto',
    '/admin/gallery': 'Gestionar Galería',
    '/admin/analytics': 'Analytics',
    '/admin/settings': 'Configuración'
  };
  
  return titles[pathname] || 'Administración';
};

export default Layout;