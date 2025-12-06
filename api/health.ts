import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDataSource } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Test database connection
        const dataSource = await getDataSource();
        const isConnected = dataSource.isInitialized;

        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL,
            db: isConnected ? 'connected' : 'disconnected'
        });
    } catch (error: any) {
        console.error('Database connection error:', error);
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL,
            db: 'error',
            dbError: error.message || String(error)
        });
    }
}

