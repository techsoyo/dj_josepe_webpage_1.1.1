// lib/cache.js
// Utilidades de caché optimizadas para mejorar el rendimiento

/**
 * Configuración de fetch optimizada con caché inteligente
 * @param {string} url - URL a llamar
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Response>} - Response del fetch
 */
export async function fetchWithCache(url, options = {}) {
  // En desarrollo: caché de 30 segundos para mejor UX
  // En producción: caché de 5 minutos para balance entre frescura y velocidad
  const revalidateTime = process.env.NODE_ENV === 'development' ? 30 : 300;
  
  const defaultOptions = {
    next: { revalidate: revalidateTime },
    cache: 'force-cache',
    ...options
  };

  return fetch(url, defaultOptions);
}

/**
 * Fetch y parse JSON con caché optimizado
 * @param {string} url - URL a llamar
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} - Datos parseados
 */
export async function fetchJsonWithCache(url, options = {}) {
  const response = await fetchWithCache(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Configuración de caché para diferentes tipos de contenido
 */
export const CACHE_CONFIG = {
  // Para datos que cambian poco (sets, información estática)
  STATIC: { revalidate: 3600 }, // 1 hora
  
  // Para datos dinámicos pero no críticos (eventos)
  DYNAMIC: { revalidate: 300 }, // 5 minutos
  
  // Para datos en tiempo real (sin caché)
  REALTIME: { revalidate: 0 },
  
  // Para desarrollo (caché corto)
  DEVELOPMENT: { revalidate: 30 }, // 30 segundos
};

/**
 * Obtiene la configuración de caché según el entorno
 * @param {string} type - Tipo de caché (STATIC, DYNAMIC, REALTIME)
 * @returns {Object} - Configuración de caché
 */
export function getCacheConfig(type = 'DYNAMIC') {
  if (process.env.NODE_ENV === 'development') {
    return CACHE_CONFIG.DEVELOPMENT;
  }
  
  return CACHE_CONFIG[type] || CACHE_CONFIG.DYNAMIC;
}