// Imports
import express from 'express';
import dotenv from "dotenv";
import connectDB from './server/db/conn.mjs';
import globalError from './server/middleware/globalErr.mjs';

// Setups
connectDB();
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes

// Global ErrorHandling Middleware
app.use(globalError)

// Listeners
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});