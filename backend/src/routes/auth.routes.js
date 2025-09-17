// backend/src/routes/auth.routes.js
import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller.js';
import requireDJ from '../middleware/requireDJ.js';

const router = Router();

router.post('/dj/login', login);
router.post('/dj/logout', requireDJ, logout);

// This route is just for the frontend to verify if the cookie session is valid.
// The requireDJ middleware does all the work.
router.get('/dj/verify-session', requireDJ, (req, res) => {
  return res.status(200).json({ ok: true, user: { role: 'admin' } });
});

// Cierra sesión (clear-cookie)
router.post('/dj/logout', requireDJ, logout);

export default router;