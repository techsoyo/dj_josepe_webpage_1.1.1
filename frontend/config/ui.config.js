// frontend/config/ui.config.js
export const uiConfig = {
  // Tema y colores
  theme: {
    primary: '#ffc107',
    secondary: '#6c757d',
    dark: '#121212',
    light: '#e9ecef',
    warning: '#ffc107',
    danger: '#dc3545',
    success: '#28a745'
  },

  // Configuración de componentes
  components: {
    button: {
      borderRadius: '25px',
      padding: '12px 24px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      transition: 'all 0.3s ease'
    },

    card: {
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(255, 193, 7, 0.2)',
      border: '1px solid rgba(255, 193, 7, 0.2)'
    },

    input: {
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#e9ecef',
      padding: '12px 16px'
    },

    modal: {
      backdropOpacity: 0.5,
      borderRadius: '15px',
      maxWidth: '500px',
      zIndex: 1050
    }
  },

  // Animaciones
  animations: {
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s'
    },
    easing: 'ease-in-out'
  },

  // Breakpoints responsivos
  breakpoints: {
    xs: '576px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1400px'
  },

  // Espaciado
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '3rem'
  },

  // Tipografía
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },

  // Z-index layers
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    overlay: 1080
  }
};