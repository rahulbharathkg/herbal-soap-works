import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Product } from '../entities/Product.js';
import { User } from '../entities/User.js';
import { AdminContent } from '../entities/AdminContent.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Order } from '../entities/Order.js';
import { AdminLog } from '../entities/AdminLog.js';
import { Event } from '../entities/Event.js';
import { Subscriber } from '../entities/Subscriber.js';
import { Payment } from '../entities/Payment.js';

async function importData() {
    console.log('📦 Importing data to PostgreSQL...\n');

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable not set');
        process.exit(1);
    }

    try {
        // Initialize PostgreSQL connection
        const dataSource = new DataSource({
            type: 'postgres',
            url: DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            entities: [User, Product, AdminContent, Order, AdminLog, Event, Subscriber, Payment],
            synchronize: true, // This will create tables
            logging: false,
        });

        await dataSource.initialize();
        console.log('✓ Connected to PostgreSQL database\n');

        // Read exported data
        const dataPath = path.join(__dirname, '..', 'export_data.json');
        if (!fs.existsSync(dataPath)) {
            console.error('❌ export_data.json not found. Run export_data script first.');
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        // Import Users
        const userRepo = dataSource.getRepository(User);
        for (const userData of data.users) {
            const { id, ...rest } = userData; // Remove id to let PostgreSQL auto-generate
            const user = userRepo.create(rest);
            await userRepo.save(user);
        }
        console.log(`✓ Imported ${data.users.length} users`);

        // Import Products
        const productRepo = dataSource.getRepository(Product);
        for (const productData of data.products) {
            const { id, ...rest } = productData;
            const product = productRepo.create(rest);
            await productRepo.save(product);
        }
        console.log(`✓ Imported ${data.products.length} products`);

        // Import Admin Content
        const contentRepo = dataSource.getRepository(AdminContent);
        for (const contentData of data.adminContent) {
            const { id, ...rest } = contentData;
            const content = contentRepo.create(rest);
            await contentRepo.save(content);
        }
        console.log(`✓ Imported ${data.adminContent.length} admin content entries`);

        console.log('\n✅ Data import complete!');
        await dataSource.destroy();
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

importData();
