import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source.js';
import { Product } from '../entities/Product.js';
import { User } from '../entities/User.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/seed-database', async (req: Request, res: Response) => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        const productRepo = AppDataSource.getRepository(Product);

        // Create admin user if not exists
        const adminEmail = process.env.SEED_ADMIN_EMAIL || 'lavanya@herbal';
        const adminPass = process.env.SEED_ADMIN_PASSWORD || 'adminpass';
        let admin = await userRepo.findOneBy({ email: adminEmail });
        if (!admin) {
            const hashed = await bcrypt.hash(adminPass, 10);
            admin = userRepo.create({ email: adminEmail, password: hashed, role: 'admin', emailVerified: true });
            await userRepo.save(admin);
            console.log('Admin user created:', adminEmail);
        }

        // Add products
        const products = [
            {
                name: 'Goat Milk Soap',
                description: 'Rich and creamy goat milk soap for deep nourishment.',
                price: 80.00,
                imageUrl: '',
            },
            {
                name: 'Tan Removal Soap',
                description: 'Effective tan removal soap to restore natural skin tone.',
                price: 80.00,
                imageUrl: '',
            },
            {
                name: 'Red Wine Soap',
                description: 'Luxurious red wine soap with anti-aging properties.',
                price: 95.00,
                imageUrl: '',
            },
            {
                name: 'Charcoal Soap',
                description: 'Activated charcoal soap for deep cleansing and detox.',
                price: 80.00,
                imageUrl: '',
            },
            {
                name: 'Coffee Honey Soap',
                description: 'Exfoliating coffee and moisturizing honey blend.',
                price: 80.00,
                imageUrl: '',
            },
            {
                name: 'Sandalwood Soap',
                description: 'Classic sandalwood soap with a soothing fragrance.',
                price: 85.00,
                imageUrl: '',
            },
        ];

        for (const p of products) {
            const exists = await productRepo.findOneBy({ name: p.name });
            if (!exists) {
                const product = productRepo.create(p as any);
                await productRepo.save(product);
                console.log('Seeded product:', p.name);
            }
        }

        res.json({ success: true, message: 'Database seeded successfully!' });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ success: false, error: 'Seeding failed' });
    }
});

export default router;
