// backend/src/middleware/requireDJ.js
import { verifyToken } from '../utils/auth.js';

export default function requireDJ(req, res, next) {
  try {
    const token = req.cookies.dj_token;
    
    if (!token) {
      return res.status(401).json({ ok: false, message: 'No session' });
    }
    
    const payload = verifyToken(token);
    if (!payload || payload.sub !== 'dj_admin') {
      return res.status(401).json({ ok: false, message: 'Invalid session' });
    }
    // opcional: req.user = payload;
    return next();
  } catch (error) {
    // Limpia cookie corrupta
    res.clearCookie('dj_token', {
      httpOnly: true, sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
  }
}