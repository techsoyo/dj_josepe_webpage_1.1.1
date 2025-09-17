// frontend/config/dashboard.config.js
export const dashboardConfig = {
  widgets: {
    stats: true,
    recentEvents: true,
    upcomingSets: true,
    gallery: true
  },
  refreshInterval: 30000, // 30 segundos
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100
  }
};
