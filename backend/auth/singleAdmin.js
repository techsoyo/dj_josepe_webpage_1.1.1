// backend/auth/singleAdmin.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_TTL = parseInt(process.env.JWT_TTL_SECONDS || '604800', 10); // 7 días

function signSession(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TTL });
}
function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}
function cookieOptions() {
  // En local: secure=false. En prod: true + domain adecuado.
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: JWT_TTL * 1000,
  };
}

module.exports = { signSession, verifyToken, cookieOptions };
