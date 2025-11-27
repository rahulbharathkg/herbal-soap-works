import app from '../backend/index';
import { AppDataSource } from '../backend/data-source';

// Initialize database connection once (cached across invocations)
let isInitialized = false;

async function initializeDatabase() {
    if (!isInitialized && !AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        isInitialized = true;
        console.log('Database initialized for serverless function');
    }
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
    try {
        // Initialize database on first request
        await initializeDatabase();

        // Pass request to Express app
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
