'use client';
import { AuthProvider } from '../../hooks/useAuth';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';

/**
 * Layout para el panel de administración
 * Ahora usa AuthProvider pero sin AuthGuard automático
 */
export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}