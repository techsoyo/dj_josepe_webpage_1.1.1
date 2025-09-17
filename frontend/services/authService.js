const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

async function login({ password }) {
  const res = await fetch(`${API_BASE}/api/dj/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json();
}

async function verifySession() {
  const res = await fetch(`${API_BASE}/api/dj/verify-session`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

async function logout() {
  await fetch(`${API_BASE}/api/dj/logout`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
  });
}

const authService = { login, verifySession, logout };
export default authService;
export { login, verifySession, logout };
