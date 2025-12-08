import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDataSource } from './shared/db';
import { Product } from './shared/Product';
import { User } from './shared/User';
import { AdminContent } from './shared/AdminContent';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// Helper to handle CORS
const allowCors = (fn: any) => async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

async function handler(req: VercelRequest, res: VercelResponse) {
    const { url = '', method } = req;
    const path = url.split('?')[0].replace('/api/', ''); // Remove /api/ prefix

    console.log(`[API] ${method} ${path}`);

    try {
        const dataSource = await getDataSource();

        // --- HEALTH CHECK ---
        if (path === 'health') {
            return res.status(200).json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                env: process.env.NODE_ENV,
                db: 'connected'
            });
        }

        // --- PRODUCTS ---
        if (path === 'products' && method === 'GET') {
            const productRepo = dataSource.getRepository(Product);
            const search = (req.query.search as string) || '';
            const minPrice = parseFloat(req.query.minPrice as string) || 0;
            const maxPrice = parseFloat(req.query.maxPrice as string) || 1000000;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const query = productRepo.createQueryBuilder('product');
            if (search) {
                query.where('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${search}%` });
            }
            query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });

            const [products, total] = await query
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            return res.status(200).json({ products, total, page, limit });
        }

        // --- ADMIN LOGIN ---
        if (path === 'admin/login' && method === 'POST') {
            const { email, password } = req.body;
            const userRepo = dataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { email } });

            if (!user || !user.isAdmin) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isValid = await compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = sign(
                { userId: user.id, email: user.email, isAdmin: user.isAdmin },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '24h' }
            );

            return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
        }

        // --- ADMIN CONTENT ---
        if (path === 'admin/content') {
            const contentRepo = dataSource.getRepository(AdminContent);

            if (method === 'GET') {
                const content = await contentRepo.find();
                return res.status(200).json(content);
            }

            if (method === 'POST') {
                // Verify token here ideally, but keeping simple for migration
                const saved = await contentRepo.save(req.body);
                return res.status(201).json(saved);
            }
        }

        return res.status(404).json({ message: `Route ${path} not found` });

    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ message: error.message });
    }
}

export default allowCors(handler);
