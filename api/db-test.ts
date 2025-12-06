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
            db: isConnected ? 'connected' : 'disconnected',
            dbUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
        });
    } catch (error: any) {
        console.error('Database connection error:', error);
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            db: 'error',
            dbError: error.message || String(error),
            dbUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
        });
    }
}
