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
    const path = url.split('?')[0].replace(/^\/?api\//, '').replace(/^\//, '');
    console.log(`[API] ${method} ${url} -> ${path}`);

    try {
        const dataSource = await getDataSource();

        // --- HEALTH CHECK ---
        if (path === 'health' || path.endsWith('health')) {
            return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
        }

        // --- PRODUCTS ---
        if ((path === 'products' || path.endsWith('products')) && method === 'GET') {
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

        // --- LOGIN/REGISTER ---
        if ((path === 'login' || path.endsWith('login')) && !path.includes('admin') && method === 'POST') {
            const { email, password } = req.body;
            const userRepo = dataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { email } });
            if (!user || !(await compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
            const token = sign({ userId: user.id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
            return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
        }

        if ((path === 'register' || path.endsWith('register')) && method === 'POST') {
            const { email, password, name, isSubscribed } = req.body;
            const userRepo = dataSource.getRepository(User);
            if (await userRepo.findOne({ where: { email } })) return res.status(400).json({ message: 'Email already exists' });

            const { hash } = require('bcryptjs');
            const hashedPassword = await hash(password, 10);
            const newUser = userRepo.create({ email, password: hashedPassword, name, isSubscribed: isSubscribed || false, role: 'user', isAdmin: false });
            await userRepo.save(newUser);
            const token = sign({ userId: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
            return res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
        }

        // --- ADMIN ALL ---
        if ((path === 'admin/login' || path.endsWith('admin/login')) && method === 'POST') {
            const { email, password } = req.body;
            const userRepo = dataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { email } });
            if (!user || !user.isAdmin || !(await compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
            const token = sign({ userId: user.id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
            return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
        }

        if (path === 'admin/content' || path.endsWith('admin/content')) {
            const contentRepo = dataSource.getRepository(AdminContent);
            if (method === 'GET') return res.status(200).json(await contentRepo.find());
            if (method === 'POST') return res.status(201).json(await contentRepo.save(req.body));
        }

        // --- USER PROFILE ---
        if (path === 'user/profile' || path.endsWith('user/profile')) {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'No token' });
            try {
                const { verify } = require('jsonwebtoken');
                const decoded: any = verify(token, process.env.JWT_SECRET || 'default_secret');
                const user = await dataSource.getRepository(User).findOne({ where: { id: decoded.userId } });
                if (!user) return res.status(404).json({ message: 'User not found' });

                if (method === 'GET') {
                    return res.status(200).json({ id: user.id, name: user.name, email: user.email, isSubscribed: user.isSubscribed, addresses: user.addresses || [] });
                }
                if (method === 'POST') {
                    if (req.body.name) user.name = req.body.name;
                    if (req.body.isSubscribed !== undefined) user.isSubscribed = req.body.isSubscribed;
                    if (req.body.password) {
                        const { hash } = require('bcryptjs');
                        user.password = await hash(req.body.password, 10);
                    }
                    await dataSource.getRepository(User).save(user);
                    return res.status(200).json({ message: 'Profile updated' });
                }
            } catch (e) { return res.status(401).json({ message: 'Invalid token' }); }
        }

        // --- USER ADDRESS ---
        if (path === 'user/address' || path.endsWith('user/address')) {
            if (method === 'POST') {
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) return res.status(401).json({ message: 'No token' });
                try {
                    const { verify } = require('jsonwebtoken');
                    const decoded: any = verify(token, process.env.JWT_SECRET || 'default_secret');
                    const user = await dataSource.getRepository(User).findOne({ where: { id: decoded.userId } });
                    if (!user) return res.status(404).json({ message: 'User not found' });

                    const newAddress = req.body;
                    let addresses = user.addresses || [];
                    if (newAddress.id) {
                        addresses = addresses.map((a: any) => a.id === newAddress.id ? newAddress : a);
                    } else {
                        newAddress.id = Date.now().toString();
                        if (newAddress.isDefault) addresses = addresses.map((a: any) => ({ ...a, isDefault: false }));
                        addresses.push(newAddress);
                    }
                    user.addresses = addresses;
                    await dataSource.getRepository(User).save(user);
                    return res.status(200).json(user.addresses);
                } catch (e) { return res.status(401).json({ message: 'Invalid token' }); }
            }
        }

        return res.status(404).json({ message: `Route not found`, path });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ message: error.message });
    }
}

export default allowCors(handler);
