'use client';

import { useEffect } from 'react';

const SessionCleaner = () => {
  useEffect(() => {
    // Limpiar sesión al montar el componente
    cleanupSession();
    
    // Configurar limpieza al cerrar ventana/pestaña
    const handleBeforeUnload = (event) => {
      // Solo limpiar si no es una recarga de página
      if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
        cleanupSession();
      }
    };
    
    // Configurar limpieza al cambiar de página
    const handlePageHide = () => {
      cleanupSession();
    };
    
    // Configurar limpieza al perder foco (opcional)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Guardar timestamp de última actividad
        localStorage.setItem('lastActivity', Date.now().toString());
      } else {
        // Verificar si ha pasado mucho tiempo inactivo
        checkInactivity();
      }
    };
    
    // Configurar limpieza periódica
    const cleanupInterval = setInterval(() => {
      performPeriodicCleanup();
    }, 5 * 60 * 1000); // Cada 5 minutos
    
    // Event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(cleanupInterval);
    };
  }, []);

  const cleanupSession = () => {
    try {
      // Limpiar datos temporales pero mantener token si es válido
      const itemsToRemove = [
        'tempData',
        'uploadProgress',
        'formDraft',
        'searchHistory',
        'filterState'
      ];
      
      itemsToRemove.forEach(item => {
        localStorage.removeItem(item);
        sessionStorage.removeItem(item);
      });
      
      // Limpiar sessionStorage completamente excepto datos críticos
      const criticalItems = ['token'];
      const sessionData = {};
      
      criticalItems.forEach(key => {
        const value = sessionStorage.getItem(key);
        if (value) sessionData[key] = value;
      });
      
      sessionStorage.clear();
      
      // Restaurar datos críticos
      Object.entries(sessionData).forEach(([key, value]) => {
        sessionStorage.setItem(key, value);
      });
      
    } catch (error) {
      console.error('Error durante limpieza de sesión:', error);
    }
  };
  
  const performPeriodicCleanup = () => {
    try {
      // Verificar y limpiar localStorage de items expirados
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas
      
      // Revisar items con timestamp
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('temp_') || key.startsWith('cache_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (item.timestamp && (now - item.timestamp) > maxAge) {
              localStorage.removeItem(key);
            }
          } catch {
            // Si no se puede parsear, eliminar
            localStorage.removeItem(key);
          }
        }
      });
      
      // Verificar tamaño total del localStorage
      checkStorageSize();
      
    } catch (error) {
      console.error('Error durante limpieza periódica:', error);
    }
  };
  
  const checkInactivity = () => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const inactiveTime = Date.now() - parseInt(lastActivity);
      const maxInactiveTime = 2 * 60 * 60 * 1000; // 2 horas
      
      if (inactiveTime > maxInactiveTime) {
        // Usuario inactivo por mucho tiempo
        localStorage.removeItem('token');
        sessionStorage.clear();
        
        alert('Sesión cerrada por inactividad prolongada.');
        window.location.href = '/dj-josepe-aqui-mando-yo';
      }
    }
  };
  
  const checkStorageSize = () => {
    try {
      // Verificar tamaño aproximado del localStorage
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      
      // Si supera 4MB (aproximadamente 80% del límite), limpiar
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (totalSize > maxSize) {
        console.warn('localStorage cerca del límite, realizando limpieza...');
        performEmergencyCleanup();
      }
    } catch (error) {
      console.error('Error verificando tamaño de storage:', error);
    }
  };
  
  const performEmergencyCleanup = () => {
    // Mantener solo items esenciales
    const essentialItems = ['token'];
    const backup = {};
    
    essentialItems.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) backup[key] = value;
    });
    
    localStorage.clear();
    
    Object.entries(backup).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    console.log('Limpieza de emergencia completada');
  };

  // Este componente no renderiza nada visible
  return null;
};

export default SessionCleaner;