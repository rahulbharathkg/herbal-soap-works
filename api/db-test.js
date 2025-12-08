"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
function handler(req, res) {
    res.status(200).json({
        status: 'db-test simplified',
        timestamp: new Date().toISOString(),
        dbUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
        message: 'Database test without TypeORM'
    });
}
