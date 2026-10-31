import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import transactionRoutes from './routes/transactionRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// ==========================================
// Global Middleware
// ==========================================
app.use(
    cors({
        origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'].filter(Boolean),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());
app.use(clerkMiddleware());

// ==========================================
// API Routes
// ==========================================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Personal Finance Tracker API is up and running!',
        timestamp: new Date().toISOString(),
    });
});

// Transaction API Endpoints
app.use('/api/transactions', transactionRoutes);

// ==========================================
// Error Handling Middleware
// ==========================================
app.use(notFound);
app.use(errorHandler);

export default app;
