import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs';
import { createSessionNote, getSessionNotes } from '../controllers/noteController.mjs';

const router = express.Router();

router.post('/create', protect, createSessionNote);
router.post('/', protect, getSessionNotes);

export default router;