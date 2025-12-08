import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDataSource } from './shared/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        await getDataSource();
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL,
            db: 'connected'
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || String(error),
            env: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL
        });
    }
}

