import 'reflect-metadata';
import { getDataSource } from '../api/shared/db';
import { User } from '../api/shared/User';
import { hash } from 'bcryptjs';

async function createAdmin() {
    console.log('Connecting to DB...');
    const ds = await getDataSource();
    const repo = ds.getRepository(User);

    const email = 'admin@herbalsoap.com';
    const password = 'admin123'; // Default password

    const existing = await repo.findOne({ where: { email } });
    if (existing) {
        console.log('Admin already exists.');
        if (!existing.isAdmin) {
            existing.isAdmin = true;
            await repo.save(existing);
            console.log('Promoted to admin.');
        }
    } else {
        console.log('Creating admin user...');
        const hashedPassword = await hash(password, 10);
        const admin = repo.create({
            email,
            password: hashedPassword,
            name: 'Admin User',
            isAdmin: true,
            role: 'admin'
        });
        await repo.save(admin);
        console.log(`Admin created! Email: ${email}, Password: ${password}`);
    }

    process.exit(0);
}

createAdmin();
