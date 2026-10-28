import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

// Connect to MongoDB Atlas
connectDB();

const PORT = process.env.PORT || 5000;

// Start HTTP server
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});