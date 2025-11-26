import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbConnection } from './_db';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const db = await getDbConnection();
  const userRepo = db.getRepository('User');
  const productRepo = db.getRepository('Product');

  try {
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

    return res.status(200).json({ success: true, message: 'Database seeded successfully!' });

  } catch (error) {
    console.error('Seeding error:', error);
    return res.status(500).json({ success: false, error: 'Seeding failed' });
  }
}
