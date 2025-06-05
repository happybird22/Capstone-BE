// Imports
import cors from 'cors';
import express from 'express';
import dotenv from "dotenv";
import connectDB from './server/db/conn.mjs';
import globalError from './server/middleware/globalErr.mjs';
import authRoutes from './server/routes/authRoutes.mjs';
import partyRoutes from './server/routes/partyRoutes.mjs';
import noteRoutes from './server/routes/noteRoutes.mjs';

// Setups
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/session-notes', noteRoutes);

// Global ErrorHandling Middleware
app.use(globalError)

// Listeners
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});