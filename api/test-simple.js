"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
function handler(req, res) {
    res.status(200).json({
        message: 'Simple test works',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL
    });
}
