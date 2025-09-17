// frontend/config/features.config.js
export const features = {
  // Funcionalidades principales
  core: {
    authentication: true,
    dashboard: true,
    events: true,
    sets: true,
    gallery: true,
    contact: true
  },

  // Funcionalidades de administración
  admin: {
    userManagement: true,
    contentModeration: true,
    analytics: true,
    backup: true,
    logs: true,
    notifications: true
  },

  // Funcionalidades sociales
  social: {
    instagram: true,
    youtube: true,
    spotify: true,
    soundcloud: true,
    socialSharing: true
  },

  // Funcionalidades de contenido
  content: {
    richTextEditor: true,
    imageUpload: true,
    audioUpload: true,
    videoUpload: true,
    dragAndDrop: true,
    bulkOperations: true
  },

  // Funcionalidades de UI/UX
  ui: {
    darkMode: true,
    animations: true,
    responsive: true,
    accessibility: true,
    loadingStates: true,
    errorBoundaries: true
  },

  // Funcionalidades de desarrollo
  development: {
    debugMode: process.env.NODE_ENV === 'development',
    mockData: process.env.NODE_ENV === 'development',
    errorReporting: true,
    performanceMonitoring: true,
    hotReload: process.env.NODE_ENV === 'development'
  },

  // Funcionalidades experimentales
  experimental: {
    aiSuggestions: false,
    autoSave: false,
    realTimeCollaboration: false,
    advancedAnalytics: false,
    customThemes: false
  },

  // Integraciones externas
  integrations: {
    googleAnalytics: !!process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    facebookPixel: !!process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    mailchimp: false,
    stripe: false,
    paypal: false,
    googleMaps: true,
    calendarIntegration: false
  },

  // Funcionalidades de seguridad
  security: {
    csrfProtection: true,
    rateLimiting: true,
    inputSanitization: true,
    httpsOnly: process.env.NODE_ENV === 'production',
    secureCookies: process.env.NODE_ENV === 'production'
  },

  // Funcionalidades de performance
  performance: {
    lazyLoading: true,
    imageOptimization: true,
    codeSplitting: true,
    caching: true,
    compression: true
  },

  // Funcionalidades móviles
  mobile: {
    pwa: false,
    pushNotifications: false,
    offlineMode: false,
    touchGestures: true,
    swipeNavigation: true
  },

  // Funcionalidades de internacionalización
  i18n: {
    multiLanguage: false,
    rtlSupport: false,
    localeDetection: false
  },

  // Funcionalidades de búsqueda y filtros
  search: {
    globalSearch: true,
    advancedFilters: true,
    autocomplete: true,
    searchSuggestions: true,
    facetedSearch: false
  },

  // Funcionalidades de notificaciones
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    inAppNotifications: true,
    smsNotifications: false
  },

  // Funcionalidades de exportación
  export: {
    csvExport: true,
    pdfExport: true,
    jsonExport: true,
    calendarExport: true
  },

  // Funcionalidades de importación
  import: {
    csvImport: true,
    bulkImport: true,
    autoMapping: true
  },

  // Funcionalidades de backup y recuperación
  backup: {
    automaticBackup: true,
    manualBackup: true,
    restoreFromBackup: true,
    cloudBackup: false
  }
};

// Función helper para verificar si una funcionalidad está habilitada
export const isFeatureEnabled = (featurePath) => {
  const keys = featurePath.split('.');
  let current = features;

  for (const key of keys) {
    if (current[key] === undefined) {
      return false;
    }
    current = current[key];
  }

  return Boolean(current);
};

// Función helper para obtener configuración de funcionalidad
export const getFeatureConfig = (featurePath) => {
  const keys = featurePath.split('.');
  let current = features;

  for (const key of keys) {
    if (current[key] === undefined) {
      return null;
    }
    current = current[key];
  }

  return current;
};