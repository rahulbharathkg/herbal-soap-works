import { AppDataSource } from '../data-source.js';
import { Product } from '../entities/Product.js';
import { User } from '../entities/User.js';
import { AdminContent } from '../entities/AdminContent.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportData() {
    console.log('📦 Exporting SQLite data...\n');

    try {
        await AppDataSource.initialize();
        console.log('✓ Connected to SQLite database\n');

        const data: any = {};

        // Export Products
        const productRepo = AppDataSource.getRepository(Product);
        const products = await productRepo.find();
        data.products = products;
        console.log(`✓ Exported ${products.length} products`);

        // Export Users
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find();
        data.users = users;
        console.log(`✓ Exported ${users.length} users`);

        // Export Admin Content
        const contentRepo = AppDataSource.getRepository(AdminContent);
        const content = await contentRepo.find();
        data.adminContent = content;
        console.log(`✓ Exported ${content.length} admin content entries`);

        // Save to JSON file
        const exportPath = path.join(__dirname, '..', 'export_data.json');
        fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
        console.log(`\n✅ Data exported to: ${exportPath}`);

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Export failed:', error);
        process.exit(1);
    }
}

exportData();
