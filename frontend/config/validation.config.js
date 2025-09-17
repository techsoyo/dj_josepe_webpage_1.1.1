// frontend/config/validation.config.js
export const validationConfig = {
  // Patrones de validación
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    instagram: /^@?[a-zA-Z0-9._]{1,30}$/,
    youtube: /^[a-zA-Z0-9_-]{1,100}$/
  },

  // Reglas de validación por campo
  rules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
      messages: {
        required: 'El nombre es obligatorio',
        minLength: 'El nombre debe tener al menos 2 caracteres',
        maxLength: 'El nombre no puede exceder 50 caracteres',
        pattern: 'El nombre solo puede contener letras, espacios y apóstrofes'
      }
    },

    email: {
      required: true,
      pattern: 'email',
      messages: {
        required: 'El email es obligatorio',
        pattern: 'Ingresa un email válido'
      }
    },

    phone: {
      required: false,
      pattern: 'phone',
      messages: {
        pattern: 'Ingresa un número de teléfono válido'
      }
    },

    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      messages: {
        required: 'El mensaje es obligatorio',
        minLength: 'El mensaje debe tener al menos 10 caracteres',
        maxLength: 'El mensaje no puede exceder 1000 caracteres'
      }
    },

    eventTitle: {
      required: true,
      minLength: 3,
      maxLength: 100,
      messages: {
        required: 'El título del evento es obligatorio',
        minLength: 'El título debe tener al menos 3 caracteres',
        maxLength: 'El título no puede exceder 100 caracteres'
      }
    },

    eventDescription: {
      required: true,
      minLength: 20,
      maxLength: 2000,
      messages: {
        required: 'La descripción es obligatoria',
        minLength: 'La descripción debe tener al menos 20 caracteres',
        maxLength: 'La descripción no puede exceder 2000 caracteres'
      }
    },

    setTitle: {
      required: true,
      minLength: 3,
      maxLength: 100,
      messages: {
        required: 'El título del set es obligatorio',
        minLength: 'El título debe tener al menos 3 caracteres',
        maxLength: 'El título no puede exceder 100 caracteres'
      }
    },

    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      messages: {
        required: 'La contraseña es obligatoria',
        minLength: 'La contraseña debe tener al menos 8 caracteres',
        pattern: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
      }
    },

    instagram: {
      required: false,
      pattern: 'instagram',
      messages: {
        pattern: 'Ingresa un usuario de Instagram válido'
      }
    },

    youtube: {
      required: false,
      pattern: 'youtube',
      messages: {
        pattern: 'Ingresa un ID de YouTube válido'
      }
    }
  },

  // Configuración general de validación
  general: {
    debounce: 300, // ms para validación en tiempo real
    showErrorsOnBlur: true,
    showErrorsOnChange: false,
    validateOnSubmit: true
  },

  // Funciones de validación personalizadas
  customValidators: {
    isValidDate: (date) => {
      const d = new Date(date);
      return d instanceof Date && !isNaN(d);
    },

    isFutureDate: (date) => {
      const d = new Date(date);
      const now = new Date();
      return d > now;
    },

    isValidImageFile: (file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    },

    isValidAudioFile: (file) => {
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    }
  }
};