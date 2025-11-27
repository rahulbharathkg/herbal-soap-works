import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
import { User } from '../backend/entities/User';
import { Product } from '../backend/entities/Product';
import bcrypt from 'bcryptjs';

// Use process.cwd() for script location (CommonJS compatible)
const __dirname = process.cwd();

// Load env (will pick up USE_SQLITE=true and SQLITE_DB if set)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Reuse the same DataSource config from backend
const useSqlite = process.env.USE_SQLITE === 'true';

const AppDataSource = new DataSource(
    useSqlite
        ? {
            type: 'sqlite',
            database: process.env.SQLITE_DB || path.resolve(__dirname, 'backend', 'dev.sqlite'),
            entities: [
                path.join(__dirname, '..', 'backend', 'entities', '*.{ts,js}'),
            ],
            synchronize: true,
            logging: false,
        }
        : {
            // fallback – not used in this script
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [path.join(__dirname, '..', 'backend', 'entities', '*.{ts,js}')],
            synchronize: true,
            logging: false,
        }
);

async function seed() {
    await AppDataSource.initialize();
    const userRepo = AppDataSource.getRepository(User);
    const productRepo = AppDataSource.getRepository(Product);

    // Admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'lavanya@herbal';
    const adminPass = process.env.SEED_ADMIN_PASSWORD || 'adminpass';
    let admin = await userRepo.findOne({ where: { email: adminEmail } });
    if (!admin) {
        const hashed = await bcrypt.hash(adminPass, 10);
        admin = userRepo.create({ email: adminEmail, password: hashed, role: 'admin', emailVerified: true });
        await userRepo.save(admin);
        console.log('Created admin user');
    } else {
        console.log('Admin user already exists');
    }

    // Products list (same as seed route)
    const products = [
        { name: 'Lavender Bliss Soap', description: 'Soothing lavender soap with natural essential oils.', price: 6.5, imageUrl: '' },
        { name: 'Rose Glow Soap', description: 'Gentle rose-scented soap for radiant skin.', price: 7.0, imageUrl: '' },
        { name: 'Mint Fresh Soap', description: 'Cooling mint soap to refresh and revitalize.', price: 5.75, imageUrl: '' },
        { name: 'Goat Milk Soap', description: 'Luxurious goat milk soap that deeply nourishes and moisturizes your skin. Rich in vitamins and minerals.', price: 80, imageUrl: '' },
        { name: 'Tan Soap', description: "Natural tan removal soap with herbal extracts. Helps restore your skin's natural glow.", price: 80, imageUrl: '' },
        { name: 'Red Wine Soap', description: 'Anti-aging red wine soap packed with antioxidants. Rejuvenates and revitalizes your skin.', price: 85, imageUrl: '' },
        { name: 'Charcoal Soap', description: 'Activated charcoal soap for deep cleansing. Removes impurities and detoxifies skin.', price: 80, imageUrl: '' },
        { name: 'Coffee Honey Soap', description: 'Energizing coffee and honey blend. Exfoliates and brightens your complexion.', price: 80, imageUrl: '' },
        { name: 'Sandalwood Soap', description: 'Premium sandalwood soap with a calming fragrance. Naturally antiseptic and soothing.', price: 85, imageUrl: '' },
    ];

    for (const p of products) {
        const exists = await productRepo.findOne({ where: { name: p.name } });
        if (!exists) {
            await productRepo.save(productRepo.create(p as any));
            console.log('Inserted product', p.name);
        }
    }

    console.log('Seeding complete');
    await AppDataSource.destroy();
}

seed().catch((e) => {
    console.error('Seeding error', e);
    process.exit(1);
});
