import { Router } from 'express';
import {
    getAllPublicEvents,
    getAllAdminEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    togglePublished
} from '../controllers/events.controller.js';
import requireDJ from '../middleware/requireDJ.js';

const router = Router();

// Public routes
router.get('/', getAllPublicEvents);
router.get('/:id', getEventById);

// Admin routes
router.get('/admin', requireDJ, getAllAdminEvents);
router.post('/', requireDJ, createEvent);
router.put('/:id', requireDJ, updateEvent);
router.delete('/:id', requireDJ, deleteEvent);
router.patch('/:id/publish', requireDJ, togglePublished);

export default router;
