import { Router } from 'express';
import { handleNewMessage } from '../controllers/contact.controller.js';

const router = Router();

// Route for submitting the contact form
// POST /api/contact
router.post('/contact', handleNewMessage);

export default router;
