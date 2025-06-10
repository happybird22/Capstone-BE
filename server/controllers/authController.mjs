import jwt from 'jsonwebtoken';
import User from '../models/userSchema.mjs';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            partyId: user.partyId,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 character long and include at least one letter and one number.",
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newUser = await User.create({ username, email, password, role });

        const token = generateToken(newUser);
        res
            .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(201)
            .json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                partyID: newUser.partyID,
                token,
            });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res
            .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                partyID: user.partyID,
                token,
            });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

export const getCurrentUser = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    res.status(200).json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        partyId: req.user.partyId,
    });
};