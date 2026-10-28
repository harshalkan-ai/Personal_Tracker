import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google/Cloudflare DNS to resolve Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connects the Express application to MongoDB Atlas
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;