import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
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
                name: 'Lavender Bliss Soap',
                description: 'Soothing lavender soap with natural essential oils.',
                price: 6.5,
                imageUrl: '',
            },
            {
                name: 'Rose Glow Soap',
                description: 'Gentle rose-scented soap for radiant skin.',
                price: 7.0,
                imageUrl: '',
            },
            {
                name: 'Mint Fresh Soap',
                description: 'Cooling mint soap to refresh and revitalize.',
                price: 5.75,
                imageUrl: '',
            },
            {
                name: 'Goat Milk Soap',
                description: 'Luxurious goat milk soap that deeply nourishes and moisturizes your skin. Rich in vitamins and minerals.',
                price: 80,
                imageUrl: '',
            },
            {
                name: 'Tan Soap',
                description: 'Natural tan removal soap with herbal extracts. Helps restore your skin\'s natural glow.',
                price: 80,
                imageUrl: '',
            },
            {
                name: 'Red Wine Soap',
                description: 'Anti-aging red wine soap packed with antioxidants. Rejuvenates and revitalizes your skin.',
                price: 85,
                imageUrl: '',
            },
            {
                name: 'Charcoal Soap',
                description: 'Activated charcoal soap for deep cleansing. Removes impurities and detoxifies skin.',
                price: 80,
                imageUrl: '',
            },
            {
                name: 'Coffee Honey Soap',
                description: 'Energizing coffee and honey blend. Exfoliates and brightens your complexion.',
                price: 80,
                imageUrl: '',
            },
            {
                name: 'Sandalwood Soap',
                description: 'Premium sandalwood soap with a calming fragrance. Naturally antiseptic and soothing.',
                price: 85,
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
