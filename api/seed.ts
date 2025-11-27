import 'reflect-metadata';
import { AppDataSource } from './_db'; // Changed from './data-source'
import { User } from '../backend/entities/User';
import { Product } from '../backend/entities/Product';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('DataSource initialized for seeding');

    const userRepo = AppDataSource.getRepository(User);
    const productRepo = AppDataSource.getRepository(Product);

    // Create admin user if not exists
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@herbalsoapworks.local';
    const adminPass = process.env.SEED_ADMIN_PASSWORD || 'adminpass';
    let admin = await userRepo.findOneBy({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash(adminPass, 10);
      admin = userRepo.create({ email: adminEmail, password: hashed, role: 'admin' });
      await userRepo.save(admin);
      console.log('Admin user created:', adminEmail);
    } else {
      console.log('Admin user already exists:', adminEmail);
    }

    // Add real products from business
    const samples = [
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

    for (const s of samples) {
      const exists = await productRepo.findOneBy({ name: s.name });
      if (!exists) {
        const p = productRepo.create(s as any);
        await productRepo.save(p);
        console.log('Seeded product:', s.name);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
