"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const db_js_1 = require("./_lib/db.js");
async function handler(req, res) {
    try {
        const start = Date.now();
        const ds = await (0, db_js_1.getDataSource)();
        const duration = Date.now() - start;
        // Try a simple query
        const result = await ds.query('SELECT NOW()');
        res.status(200).json({
            status: 'connected',
            duration: `${duration}ms`,
            timestamp: result[0].now,
            tables: ds.entityMetadatas.map(m => m.tableName)
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
    }
}
