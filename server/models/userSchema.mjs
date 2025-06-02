import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['Player', 'GM'],
            default: 'Player',
        },
        partyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Party',
        },
    },
    {
        timestamps: true,
    }
);