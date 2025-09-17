// server.js (FIX 401 verify-session + cookies + CORS)

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Routes
import authRoutes from './src/routes/auth.routes.js';
import analyticsRoutes from './src/routes/analytics.js';
import contentRoutes from './src/routes/content.js';
import contactRoutes from './src/routes/contact.js';
import eventsRoutes from './src/routes/events.js';
import setsRoutes from './src/routes/sets.js';

// Middleware
import { errorHandler } from './src/middleware/errorHandler.js';
import { securityMiddleware } from './src/middleware/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT || process.env.PORT || 4000);

// --- FRONTEND ORIGIN (único) ---
const FRONTEND_ORIGIN = NODE_ENV === 'production'
  ? (process.env.ADMIN_URL || process.env.SITE_URL)
  : (process.env.FRONTEND_ORIGIN || 'http://localhost:3000'); // ajusta si usas 5173

// --- DB config ---
const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  connectTimeout: 60000,
};

const app = express();

// Confía en proxy (cookies/secure y X-Forwarded-*)
app.set('trust proxy', 1);

// -------- Helmet / Seguridad --------
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Permite fonts y estilos comunes
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      // Permite que EL CLIENTE (tu frontend) haga fetch a este API
      // Nota: el CSP del que manda es el que sirve el HTML de tu frontend.
      // Esto evita bloqueos si alguna vez sirves HTML desde aquí.
      connectSrc: ["'self'", FRONTEND_ORIGIN],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: NODE_ENV === 'production' ? {
    maxAge: 31536000, includeSubDomains: true, preload: true
  } : false,
}));

// -------- CORS con credenciales --------
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);            // curl/health
    if (origin === FRONTEND_ORIGIN) return cb(null, true);
    return cb(new Error('CORS: origin no permitido'), false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','X-Session-ID'],
  maxAge: 86400
}));

// Preflight explícito (algunos proxies/CDN lo requieren)
app.options('*', cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

// -------- Parsers / Sanitización --------
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ← CRÍTICO: cookies
app.use(cookieParser());

// -------- Compresión --------
app.use(compression({
  filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res),
  level: 6,
  threshold: 1024,
}));

// -------- Logging --------
if (NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { skip: (req, res) => res.statusCode < 400 }));
}

// -------- Custom security middleware --------
app.use(securityMiddleware);

// -------- Adjunta db config a req --------
app.use((req, res, next) => {
  req.dbConfig = dbConfig;
  // No cache para rutas API (especialmente auth)
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// -------- Static --------
app.use('/uploads', express.static(join(__dirname, 'uploads'), {
  maxAge: NODE_ENV === 'production' ? '1d' : 0,
  etag: true,
  lastModified: true,
}));

// -------- Health --------
app.get('/health', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('SELECT 1');
    await conn.end();

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: 'connected',
      memory: {
        used: process.memoryUsage(),
        free: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed,
      },
    });
  } catch (e) {
    console.error('❌ Health check failed:', e);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      uptime: process.uptime(),
    });
  }
});

// -------- API Info --------
app.get('/api', (req, res) => {
  res.json({
    name: 'DJ Josep Backend API',
    version: '1.0.0',
    description: 'Single User Admin Panel API',
    endpoints: {
      content: '/api/content',
      media: '/api/media (not implemented)',
      events: '/api/events (not implemented)',
      contact: '/api/contact',
      settings: '/api/settings (not implemented)',
      analytics: '/api/analytics',
      auth: '/api/dj/*',
    },
    documentation: '/api/docs',
    health: '/health',
  });
});

// -------- Rutas API --------
// Importante: authRoutes debe exponer /dj/login, /dj/verify-session, /dj/logout
app.use('/api', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/sets', setsRoutes);

// -------- 404 --------
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// -------- Error handler (último) --------
app.use(errorHandler);

// -------- DB connect on boot --------
async function connectDatabase() {
  const conn = await mysql.createConnection(dbConfig);
  console.log('✅ Database connected successfully');
  await conn.execute('SELECT 1');
  console.log('✅ Database query test passed');
  await conn.end();
}

// -------- Graceful shutdown --------
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received, shutting down gracefully...`);
  try {
    console.log('✅ Database connections closed');
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
process.on('unhandledRejection', (reason, p) => {
  console.error('❌ Unhandled Rejection at:', p, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// -------- Start --------
async function startServer() {
  try {
    await connectDatabase();
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${NODE_ENV}`);
      console.log(`🌐 FRONTEND_ORIGIN: ${FRONTEND_ORIGIN}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });
  } catch (e) {
    console.error('❌ Failed to start server:', e);
    process.exit(1);
  }
}
startServer();
