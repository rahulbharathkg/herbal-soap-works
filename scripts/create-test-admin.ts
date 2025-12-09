
import { getDataSource } from '../api/shared/db';
import { User } from '../api/shared/User';
import { hash } from 'bcryptjs';

async function createTestAdmin() {
    try {
        const ds = await getDataSource();
        const userRepo = ds.getRepository(User);

        const email = 'test_admin@herbal.com';
        const password = 'password123';

        let user = await userRepo.findOne({ where: { email } });
        const hashedPassword = await hash(password, 10);

        if (user) {
            user.password = hashedPassword;
            user.isAdmin = true;
            user.role = 'admin';
            user.name = 'Test Admin';
            await userRepo.save(user);
            console.log('Updated existing test_admin');
        } else {
            user = userRepo.create({
                email,
                password: hashedPassword,
                name: 'Test Admin',
                isAdmin: true,
                role: 'admin',
                isSubscribed: false
            });
            await userRepo.save(user);
            console.log('Created new test_admin');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating test admin:', error);
        process.exit(1);
    }
}

createTestAdmin();
