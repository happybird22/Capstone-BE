import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.mjs';
import { protect } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, (req, res) => {
    res.status(200).json(req.user);
});

export default router;