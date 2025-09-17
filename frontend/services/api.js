// services/api.js
// Centralized axios instance with sane defaults for this Next.js app.
// Reads base URL from NEXT_PUBLIC_API_BASE (preferred) or NEXT_PUBLIC_API_URL (fallback).

import axios from 'axios';
import authService from './authService.js';

const base =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  'http://localhost:4000';

const api = axios.create({
  baseURL: base,
  withCredentials: true, // Allow cookies to be sent
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Normalize responses and handle 401
api.interceptors.response.use(
  (resp) => resp.data ?? resp,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      if (typeof window !== 'undefined') {
        // Para errores 401, simplemente mostrar error sin redirigir
        console.warn('Sesión expirada o no autorizada');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
