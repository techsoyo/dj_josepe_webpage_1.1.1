import { comparePassword, signToken } from '../utils/auth.js';
import { getDJAuth } from '../daos/DJAuth.dao.js';

const isProd = process.env.NODE_ENV === 'production';

export async function login(req, res) {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });

    const dj = await getDJAuth();
    if (!dj || !comparePassword(password, dj.passwordHash)) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }
    
    const token = signToken({ sub: 'dj_admin' }); // payload mínimo
    res.cookie('dj_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,     // en local false, en prod true (HTTPS)
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}

export async function logout(req, res) {
  res.clearCookie('dj_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
  });
  return res.status(204).end();
}