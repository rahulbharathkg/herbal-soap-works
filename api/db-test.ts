import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        status: 'db-test simplified',
        timestamp: new Date().toISOString(),
        dbUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
        message: 'Database test without TypeORM'
    });
}
