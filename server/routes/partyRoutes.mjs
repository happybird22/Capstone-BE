import express from 'express';
import { createParty, joinParty } from '../controllers/partyController.mjs';
import { protect } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/create', protect, createParty);
router.post('/join', protect, joinParty);

export default router;