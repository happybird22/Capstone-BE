import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.mjs';
import { protect } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);

export default router;