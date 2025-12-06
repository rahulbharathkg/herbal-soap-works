import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export interface AuthRequest extends VercelRequest {
    user?: any;
}

export function verifyToken(req: AuthRequest): any {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('No token provided');
    }

    return jwt.verify(token, JWT_SECRET);
}

export function requireAuth(handler: (req: AuthRequest, res: VercelResponse) => Promise<any>) {
    return async (req: AuthRequest, res: VercelResponse) => {
        try {
            req.user = verifyToken(req);
            return await handler(req, res);
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
}

export function requireAdmin(handler: (req: AuthRequest, res: VercelResponse) => Promise<any>) {
    return async (req: AuthRequest, res: VercelResponse) => {
        try {
            req.user = verifyToken(req);
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required' });
            }
            return await handler(req, res);
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
}
