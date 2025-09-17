// frontend/config/constants.config.js
export const constants = {
  // Estados de eventos
  EVENT_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  },

  // Tipos de eventos
  EVENT_TYPES: {
    FESTIVAL: 'festival',
    CLUB: 'club',
    PRIVATE: 'private',
    WEDDING: 'wedding',
    CORPORATE: 'corporate',
    BIRTHDAY: 'birthday',
    OTHER: 'other'
  },

  // Estados de sets
  SET_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  },

  // Géneros musicales
  MUSIC_GENRES: {
    TECHNO: 'techno',
    HOUSE: 'house',
    TECH_HOUSE: 'tech_house',
    PROGRESSIVE_HOUSE: 'progressive_house',
    DEEP_HOUSE: 'deep_house',
    MINIMAL: 'minimal',
    ELECTRONIC: 'electronic',
    DANCE: 'dance',
    OTHER: 'other'
  },

  // Roles de usuario
  USER_ROLES: {
    ADMIN: 'admin',
    DJ: 'dj',
    USER: 'user'
  },

  // Estados de autenticación
  AUTH_STATUS: {
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    LOADING: 'loading',
    ERROR: 'error'
  },

  // Tipos de archivos permitidos
  FILE_TYPES: {
    IMAGE: {
      ACCEPT: 'image/*',
      MAX_SIZE: 5 * 1024 * 1024, // 5MB
      EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp']
    },
    AUDIO: {
      ACCEPT: 'audio/*',
      MAX_SIZE: 50 * 1024 * 1024, // 50MB
      EXTENSIONS: ['mp3', 'wav', 'ogg', 'm4a']
    },
    VIDEO: {
      ACCEPT: 'video/*',
      MAX_SIZE: 100 * 1024 * 1024, // 100MB
      EXTENSIONS: ['mp4', 'avi', 'mov', 'wmv']
    }
  },

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZES: [5, 10, 20, 50, 100]
  },

  // Mensajes de éxito
  SUCCESS_MESSAGES: {
    EVENT_CREATED: 'Evento creado exitosamente',
    EVENT_UPDATED: 'Evento actualizado exitosamente',
    EVENT_DELETED: 'Evento eliminado exitosamente',
    SET_CREATED: 'Set creado exitosamente',
    SET_UPDATED: 'Set actualizado exitosamente',
    SET_DELETED: 'Set eliminado exitosamente',
    IMAGE_UPLOADED: 'Imagen subida exitosamente',
    AUDIO_UPLOADED: 'Audio subido exitosamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGOUT_SUCCESS: 'Sesión cerrada exitosamente'
  },

  // Mensajes de error
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado.',
    VALIDATION_ERROR: 'Por favor, corrige los errores del formulario.',
    FILE_TOO_LARGE: 'El archivo es demasiado grande.',
    INVALID_FILE_TYPE: 'Tipo de archivo no permitido.',
    UPLOAD_FAILED: 'Error al subir el archivo.',
    SAVE_FAILED: 'Error al guardar los cambios.',
    DELETE_FAILED: 'Error al eliminar el elemento.'
  },

  // Configuración de API
  API: {
    TIMEOUT: 10000,
    RETRIES: 3,
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  },

  // Configuración de UI
  UI: {
    TOAST_DURATION: 5000,
    MODAL_Z_INDEX: 1050,
    LOADING_SPINNER_SIZE: 'md',
    ANIMATION_DURATION: 300
  },

  // Redes sociales
  SOCIAL_LINKS: {
    INSTAGRAM: 'https://instagram.com/dj_josepe',
    YOUTUBE: 'https://youtube.com/@dj_josepe',
    SPOTIFY: 'https://open.spotify.com/artist/dj_josepe',
    SOUNDCLOUD: 'https://soundcloud.com/dj_josepe'
  },

  // Información de contacto
  CONTACT_INFO: {
    EMAIL: 'info@djosepe.com',
    PHONE: '+34 123 456 789',
    ADDRESS: 'Barcelona, España'
  },

  // Configuración de SEO
  SEO: {
    TITLE: 'DJ Josepe - Música Electrónica | Barcelona',
    DESCRIPTION: 'Web oficial de José Miguel Serra aka Josepe. DJ y productor de música electrónica en Barcelona.',
    KEYWORDS: ['DJ', 'Josepe', 'música electrónica', 'techno', 'house', 'Barcelona', 'Spain'],
    IMAGE: '/images/og-image.jpg'
  },

  // Configuración de analytics
  ANALYTICS: {
    GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID
  }
};