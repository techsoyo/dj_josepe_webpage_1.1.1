'use client';
import { AuthProvider, AuthGuard } from '../../hooks/useAuth';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';

/**
 * Layout para el panel de administración
 * Protege todas las rutas admin con AuthProvider y AuthGuard
 */
export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="d-flex min-vh-100 bg-dark">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-grow-1">
            <Header />
            <main className="p-4">
              {children}
            </main>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}