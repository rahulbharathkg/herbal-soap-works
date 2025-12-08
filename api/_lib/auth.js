"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
function verifyToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('No authorization header');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('No token provided');
    }
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
function requireAuth(handler) {
    return async (req, res) => {
        try {
            req.user = verifyToken(req);
            return await handler(req, res);
        }
        catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
}
function requireAdmin(handler) {
    return async (req, res) => {
        try {
            req.user = verifyToken(req);
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required' });
            }
            return await handler(req, res);
        }
        catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
}
