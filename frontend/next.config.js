import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('next').NextConfig}
 *
 * This configuration enables the new app directory and
 * explicitly allows images to be served from any origin.
 * Updated for MySQL backend integration.
 */
const nextConfig = {
  reactStrictMode: true,

  // Configuración de imágenes con dominios específicos
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'djjosepe.com',
      'www.djjosepe.com',
      // Añadir otros dominios específicos según sea necesario
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // API rewrites para el nuevo backend MySQL
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/:path*`,
      },
    ];
  },

  // Configuración de compilación
  compiler: {
    // Remover console.log en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Extensiones de página
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Configuración de output
  output: 'standalone',

  // Especificar la raíz del workspace
  outputFileTracingRoot: path.join(__dirname, '../'),

  // Configuración experimental
  experimental: {
    // Optimizaciones de rendimiento
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Variables de entorno públicas
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  },
};

export default nextConfig;