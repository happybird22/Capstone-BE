// Imports
import express from 'express';
import dotenv from "dotenv";
import connectDB from './server/db/conn.mjs';
import globalError from './server/middleware/globalErr.mjs';
import authRoutes from './server/routes/authRoutes.mjs';

// Setups
connectDB();
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Global ErrorHandling Middleware
app.use(globalError)

// Listeners
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});