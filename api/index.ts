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
            console.log(`[API] Fetching products...`);
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

            console.log(`[API] Found ${products.length} products`);
            return res.status(200).json({ products, total, page, limit });
        }

        // --- SINGLE PRODUCT ---
        // Matches /products/123
        const productMatch = path.match(/products\/(\d+)$/);
        if (productMatch && method === 'GET') {
            const id = parseInt(productMatch[1]);
            console.log(`[API] Fetching product ID: ${id}`);
            const product = await dataSource.getRepository(Product).findOne({ where: { id } });
            if (!product) {
                console.log(`[API] Product ID ${id} not found`);
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        }

        // --- EMERGENCY ADMIN RESET (TEMPORARY) ---
        if (path === 'admin/reset-default') {
            const userRepo = dataSource.getRepository(User);
            let admin = await userRepo.findOne({ where: { email: 'admin@herbalsoap.com' } });
            const { hash } = require('bcryptjs');
            const hashedPassword = await hash('admin123', 10);

            if (admin) {
                admin.password = hashedPassword;
                admin.isAdmin = true;
                admin.role = 'admin';
                await userRepo.save(admin);
                return res.status(200).json({ message: 'Admin reset to default (admin123)' });
            } else {
                admin = userRepo.create({
                    email: 'admin@herbalsoap.com',
                    password: hashedPassword,
                    name: 'Admin User',
                    isAdmin: true,
                    role: 'admin'
                });
                await userRepo.save(admin);
                return res.status(201).json({ message: 'Admin created with default (admin123)' });
            }
        }

        if (path === 'admin/promote-lavanya') {
            const userRepo = dataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { email: 'lavanya@herbal' } });
            if (!user) return res.status(404).json({ message: 'User lavanya@herbal not found' });

            user.isAdmin = true;
            user.role = 'admin';
            await userRepo.save(user);
            return res.status(200).json({ message: 'User lavanya@herbal promoted to ADMIN successfully' });
        }

        // --- FIX IMAGES (TEMPORARY) ---
        if (path === 'admin/fix-images') {
            const productRepo = dataSource.getRepository(Product);
            const products = await productRepo.find();

            const images = [
                'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-4.0.3', // Soap 1
                'https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3', // Soap 2
                'https://images.unsplash.com/photo-1547793549-127be1d4e92d?ixlib=rb-4.0.3', // Soap 3
                'https://images.unsplash.com/photo-1612808074350-440b85b46d71?ixlib=rb-4.0.3', // Soap 4
                'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3', // Soap 5
            ];

            for (let i = 0; i < products.length; i++) {
                const p = products[i];
                // Assign a random high-quality image if it's missing or using a placeholder
                if (!p.imageUrl || p.imageUrl.includes('placeholder')) {
                    p.imageUrl = images[i % images.length];
                    // Also update the gallery images
                    p.images = JSON.stringify([
                        p.imageUrl,
                        images[(i + 1) % images.length],
                        images[(i + 2) % images.length]
                    ]);
                    await productRepo.save(p);
                }
            }
            return res.status(200).json({ message: `Updated images for ${products.length} products` });
        }

        // --- LOGIN/REGISTER ---
        if ((path === 'login' || path.endsWith('login')) && !path.includes('admin') && method === 'POST') {
            const { email, password } = req.body;
            const userRepo = dataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { email } });
            if (!user || !(await compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
            const token = sign({ userId: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
            return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
        }

        if ((path === 'register' || path.endsWith('register')) && method === 'POST') {
            const { email, password, name, isSubscribed } = req.body;
            const userRepo = dataSource.getRepository(User);
            if (await userRepo.findOne({ where: { email } })) return res.status(400).json({ message: 'Email already exists' });

            const { hash } = require('bcryptjs');
            const hashedPassword = await hash(password, 10);
            const newUser = userRepo.create({ email, password: hashedPassword, name, isSubscribed: isSubscribed || false, role: 'user', isAdmin: false });
            await userRepo.save(newUser);
            const token = sign({ userId: newUser.id, email: newUser.email, role: newUser.role, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
            return res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
        }

        // --- ADMIN ALL ---
        if ((path === 'admin/login' || path.endsWith('admin/login')) && method === 'POST') {
            const { email, password } = req.body;
            const userRepo = dataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { email } });
            if (!user || !user.isAdmin || !(await compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
            const token = sign({ userId: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
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
