import { Router } from 'express';
import {
    getAllPublicSets,
    getAllAdminSets,
    getSetById,
    createSet,
    updateSet,
    deleteSet,
    togglePublished
} from '../controllers/sets.controller.js';
import requireDJ from '../middleware/requireDJ.js';

const router = Router();

// Public routes
router.get('/', getAllPublicSets);

// Admin routes (must be before /:id route)
router.get('/admin', requireDJ, getAllAdminSets);
router.post('/', requireDJ, createSet);
router.put('/:id', requireDJ, updateSet);
router.delete('/:id', requireDJ, deleteSet);
router.patch('/:id/publish', requireDJ, togglePublished);

// Public route for specific set (must be after admin routes)
router.get('/:id', getSetById);

// Note: Play and download count routes are not implemented as they relate to Analytics.

export default router;
