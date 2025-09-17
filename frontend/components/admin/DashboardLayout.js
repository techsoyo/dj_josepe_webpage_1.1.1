'use client';

import AdminLayout from './AdminLayout';
import StatsWidget from './StatsWidget';

const DashboardLayout = ({ children, showStats = true, title = 'Dashboard' }) => {
  return (
    <AdminLayout>
      <div className="dashboard-layout">
        {/* Header del Dashboard */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 text-warning mb-1">
              <i className="bi bi-speedometer2 me-2"></i>
              {title}
            </h1>
            <p className="text-muted mb-0">
              Panel de control administrativo - DJ JosePe
            </p>
          </div>
          
          <div className="text-end">
            <div className="text-light">
              <small className="text-muted d-block">Último acceso:</small>
              <small className="fw-bold">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </small>
            </div>
          </div>
        </div>
        
        {/* Stats Widgets */}
        {showStats && (
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <StatsWidget 
                title="Sets Totales"
                value="12"
                icon="bi-music-note-list"
                color="warning"
                change="+2 este mes"
              />
            </div>
            
            <div className="col-md-3">
              <StatsWidget 
                title="Mensajes"
                value="8"
                icon="bi-envelope"
                color="info"
                change="3 nuevos"
                highlight
              />
            </div>
            
            <div className="col-md-3">
              <StatsWidget 
                title="Visitas"
                value="1.2k"
                icon="bi-eye"
                color="success"
                change="+15% vs mes anterior"
              />
            </div>
            
            <div className="col-md-3">
              <StatsWidget 
                title="Reproducciones"
                value="892"
                icon="bi-play-circle"
                color="primary"
                change="156 esta semana"
              />
            </div>
          </div>
        )}
        
        {/* Contenido Principal */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .dashboard-layout {
          animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AdminLayout>
  );
};

export default DashboardLayout;