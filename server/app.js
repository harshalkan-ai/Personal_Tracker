import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

const app = express();

// ==========================================
// Global Middleware
// ==========================================

// Enable CORS for frontend requests
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Clerk authentication middleware (attaches auth info to req.auth)
app.use(clerkMiddleware());

// ==========================================
// Base / Health Check Route
// ==========================================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Personal Finance Tracker API is up and running!',
        timestamp: new Date().toISOString(),
    });
});

export default app;