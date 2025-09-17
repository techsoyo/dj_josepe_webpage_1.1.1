// backend/src/utils/auth.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_TTL = process.env.JWT_TTL || '7d'; // acepta "7d", "1h", "3600s"...

// Hash de contraseña (bcrypt con 12 rondas)
export async function hashPassword(password) {
  if (!password) throw new Error('Password is required');
  return bcrypt.hash(password, 12);
}

// Comparación segura de contraseña
export async function comparePassword(password, hash) {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

// Firma de token JWT (payload mínimo: sub = dj_admin)
export function signToken(payload = {}) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  const basePayload = { sub: 'dj_admin', ...payload };
  return jwt.sign(basePayload, JWT_SECRET, { expiresIn: JWT_TTL });
}

// Verificación de token JWT
export function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return jwt.verify(token, JWT_SECRET);
}
