import jwt from 'jsonwebtoken';
import User from '../models/userSchema.mjs';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split('')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (err) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized' }); 
    }
};

export const isGM = (req, res, next) => {
    if (req.user && req.user.role === 'gm') {
        next();
    } else {
        res.status(403).json({ message: 'Access restricted to Game Masters only'});
    }
};