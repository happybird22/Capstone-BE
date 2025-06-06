import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs';
import { createSessionNote, deleteNote, editNote, getSessionNotes, getSessionNoteById } from '../controllers/noteController.mjs';

const router = express.Router();

router.post('/create', protect, createSessionNote);
router.get('/dashboard', protect, getSessionNotes);
router.put('/:id', protect, editNote);
router.delete('/:id', protect, deleteNote);
router.get('/:id', protect, getSessionNoteById);

export default router;