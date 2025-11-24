import 'reflect-metadata';
import path from 'path';
import { AppDataSource } from './data-source';
import { User } from './entities/User';
import { Product } from './entities/Product';
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

    // Add sample products
    const samples = [
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
