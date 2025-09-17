import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determinar el entorno
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * @type {import('next').NextConfig}
 *
 * Configuración optimizada para desarrollo y producción por separado
 * Updated for MySQL backend integration.
 */
const nextConfig = {
  // Configuraciones básicas que aplican a ambos entornos
  reactStrictMode: isDevelopment, // Solo en desarrollo para debugging
  
  // Configuraciones experimentales consolidadas
  experimental: {
    scrollRestoration: true,
  },
  
  // Optimizaciones de rendimiento simplificadas
  compress: true,
  
  // Webpack optimizations solo para desarrollo
  webpack: (config, { dev, isServer }) => {
    if (dev && isDevelopment) {
      // Optimizaciones AGRESIVAS para desarrollo rápido
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // Reducir watchers para mejor performance en desarrollo
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next'],
      };
      
      // Compilación más rápida - reducir chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 3,
          maxAsyncRequests: 5,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };

      // Resolver más rápido
      config.resolve = {
        ...config.resolve,
        symlinks: false,
        cacheWithContext: false,
      };

      // Compilación incremental más agresiva - removido incrementalCache (no válido en esta versión)
      // config.experiments = {
      //   ...config.experiments,
      //   incrementalCache: true,
      // };
    }
    
    return config;
  },

  // Configuración de imágenes con dominios por entorno
  images: {
    domains: [
      ...(isDevelopment ? ['localhost', '127.0.0.1'] : []),
      'djjosepe.com',
      'www.djjosepe.com',
      // Dominios adicionales para servicios externos
      'soundcloud.com',
      'i1.sndcdn.com',
      'w.soundcloud.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: isDevelopment ? 60 : 3600, // 1 min en dev, 1 hora en prod
  },

  // Headers de seguridad optimizados por entorno
  async headers() {
    const baseHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
    ];

    const productionHeaders = [
      ...baseHeaders,
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN', // Cambiado de DENY para permitir embeds de SoundCloud
      },
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' data: https:; connect-src 'self' https:;",
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
    ];

    return [
      {
        source: '/(.*)',
        headers: isProduction ? productionHeaders : baseHeaders,
      },
      // Headers específicos para videos - optimizar caching
      {
        source: '/Video-dj.mp4',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
    ];
  },

  // API rewrites con configuración segura por entorno
  async rewrites() {
    const apiBase = isDevelopment 
      ? 'http://localhost:4000'
      : (process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE_URL || 'https://api.djjosepe.com');
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },

  // Redirects optimizados para performance
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ];
  },

  // Configuración de compilación por entorno
  compiler: {
    // Solo remover console.log en producción para permitir debugging en desarrollo
    removeConsole: isProduction,
  },

  // Extensiones de página
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Configuración de output solo para producción
  ...(isProduction && {
    output: 'export', // Usar export en lugar de standalone para mejor compatibilidad
  }),

  // Especificar la raíz del workspace para evitar warnings
  outputFileTracingRoot: path.join(__dirname, '../'),

  // Variables de entorno públicas con validación
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  },
};

export default nextConfig;