// frontend/hooks/useDebounce.js
'use client';

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para implementar debounce
 * @param {any} value - Valor a debounced
 * @param {number} delay - Retraso en milisegundos
 * @returns {any} - Valor debounced
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer timeout para actualizar el valor debounced
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar timeout si el valor cambia antes de que termine el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook personalizado para funciones debounced
 * @param {Function} callback - Función a ejecutar
 * @param {number} delay - Retraso en milisegundos
 * @param {Array} deps - Dependencias para el useCallback
 * @returns {Function} - Función debounced
 */
export function useDebounceCallback(callback, delay = 300, deps = []) {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = (...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}
