'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import SessionAlert from './SessionAlert';
import SessionCleaner from './SessionCleaner';
import authService from '../../services/authService';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Usar el mismo sistema de autenticación que el resto de la app
      const isValid = await authService.checkAuth();
      setIsAuthenticated(isValid);

      if (!isValid) {
        // Usar Next.js router en lugar de window.location
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-layout bg-dark text-light min-vh-100">
      <SessionCleaner />
      <SessionAlert />
      
      <div className="d-flex">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        
        <div className={`flex-grow-1 transition-all ${sidebarCollapsed ? 'ms-0' : 'ms-0'}`}>
          <Header onSidebarToggle={toggleSidebar} />
          
          <main className="container-fluid p-4">
            {children}
          </main>
        </div>
      </div>
      
      <style jsx>{`
        .admin-layout {
          font-family: 'Montserrat', sans-serif;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;