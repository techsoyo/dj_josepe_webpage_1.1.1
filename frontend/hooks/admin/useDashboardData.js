// frontend/hooks/admin/useDashboardData.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../../services/dashboardService';
import eventsService from '../../services/eventsService';
import setsService from '../../services/setsService';

/**
 * Hook personalizado para manejar datos del dashboard administrativo
 * @returns {Object} - Estado y funciones del dashboard
 */
export function useDashboardData() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalSets: 0,
    totalUsers: 0,
    recentEvents: [],
    recentSets: [],
    loading: true,
    error: null
  });

  const [refreshing, setRefreshing] = useState(false);

  // Función para cargar estadísticas generales
  const loadStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Cargar datos en paralelo para mejor performance
      const [eventsData, setsData] = await Promise.allSettled([
        eventsService.getEvents({ limit: 5, sort: '-createdAt' }),
        setsService.getSets({ limit: 5, sort: '-createdAt' })
      ]);

      const newStats = {
        totalEvents: eventsData.status === 'fulfilled' ? eventsData.value?.total || 0 : 0,
        totalSets: setsData.status === 'fulfilled' ? setsData.value?.total || 0 : 0,
        totalUsers: 0, // TODO: Implementar cuando haya servicio de usuarios
        recentEvents: eventsData.status === 'fulfilled' ? eventsData.value?.data || [] : [],
        recentSets: setsData.status === 'fulfilled' ? setsData.value?.data || [] : [],
        loading: false,
        error: null
      };

      // Si alguna petición falló, guardar el error
      if (eventsData.status === 'rejected' || setsData.status === 'rejected') {
        newStats.error = 'Error al cargar algunos datos del dashboard';
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar estadísticas'
      }));
    }
  }, []);

  // Función para refrescar datos
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

  // Función para obtener estadísticas específicas
  const getStatsByType = useCallback((type) => {
    switch (type) {
      case 'events':
        return {
          total: stats.totalEvents,
          recent: stats.recentEvents,
          loading: stats.loading
        };
      case 'sets':
        return {
          total: stats.totalSets,
          recent: stats.recentSets,
          loading: stats.loading
        };
      case 'users':
        return {
          total: stats.totalUsers,
          recent: [],
          loading: stats.loading
        };
      default:
        return stats;
    }
  }, [stats]);

  // Cargar datos iniciales
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    // Estado
    stats,
    refreshing,
    loading: stats.loading,
    error: stats.error,

    // Datos específicos
    totalEvents: stats.totalEvents,
    totalSets: stats.totalSets,
    totalUsers: stats.totalUsers,
    recentEvents: stats.recentEvents,
    recentSets: stats.recentSets,

    // Funciones
    loadStats,
    refreshData,
    getStatsByType,

    // Helpers
    hasData: stats.totalEvents > 0 || stats.totalSets > 0,
    hasError: !!stats.error,
    isEmpty: stats.totalEvents === 0 && stats.totalSets === 0 && !stats.loading
  };
}

/**
 * Hook personalizado para datos de eventos en el dashboard
 * @param {Object} options - Opciones de filtrado y paginación
 * @returns {Object} - Datos de eventos
 */
export function useDashboardEvents(options = {}) {
  const [events, setEvents] = useState({
    data: [],
    total: 0,
    loading: true,
    error: null
  });

  const loadEvents = useCallback(async () => {
    try {
      setEvents(prev => ({ ...prev, loading: true, error: null }));

      const params = {
        limit: options.limit || 10,
        offset: options.offset || 0,
        sort: options.sort || '-createdAt',
        ...options.filters
      };

      const result = await eventsService.getEvents(params);

      setEvents({
        data: result.data || [],
        total: result.total || 0,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading dashboard events:', error);
      setEvents(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar eventos'
      }));
    }
  }, [options]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events: events.data,
    total: events.total,
    loading: events.loading,
    error: events.error,
    loadEvents,
    hasData: events.data.length > 0,
    hasError: !!events.error
  };
}

/**
 * Hook personalizado para datos de sets en el dashboard
 * @param {Object} options - Opciones de filtrado y paginación
 * @returns {Object} - Datos de sets
 */
export function useDashboardSets(options = {}) {
  const [sets, setSets] = useState({
    data: [],
    total: 0,
    loading: true,
    error: null
  });

  const loadSets = useCallback(async () => {
    try {
      setSets(prev => ({ ...prev, loading: true, error: null }));

      const params = {
        limit: options.limit || 10,
        offset: options.offset || 0,
        sort: options.sort || '-createdAt',
        ...options.filters
      };

      const result = await setsService.getSets(params);

      setSets({
        data: result.data || [],
        total: result.total || 0,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading dashboard sets:', error);
      setSets(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar sets'
      }));
    }
  }, [options]);

  useEffect(() => {
    loadSets();
  }, [loadSets]);

  return {
    sets: sets.data,
    total: sets.total,
    loading: sets.loading,
    error: sets.error,
    loadSets,
    hasData: sets.data.length > 0,
    hasError: !!sets.error
  };
}
