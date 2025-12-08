import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
        dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'none'
    });
}

