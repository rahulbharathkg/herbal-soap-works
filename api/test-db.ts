import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDataSource } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const start = Date.now();
        const ds = await getDataSource();
        const duration = Date.now() - start;

        // Try a simple query
        const result = await ds.query('SELECT NOW()');

        res.status(200).json({
            status: 'connected',
            duration: `${duration}ms`,
            timestamp: result[0].now,
            tables: ds.entityMetadatas.map(m => m.tableName)
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
    }
}
