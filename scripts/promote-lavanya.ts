
import { getDataSource } from '../api/shared/db';
import { User } from '../api/shared/User';

async function promoteUser() {
    try {
        const ds = await getDataSource();
        const userRepo = ds.getRepository(User);

        const email = 'lavanya@herbal';
        const user = await userRepo.findOne({ where: { email } });

        if (!user) {
            console.error(`User ${email} not found!`);
            process.exit(1);
        }

        user.isAdmin = true;
        user.role = 'admin';
        await userRepo.save(user);

        console.log(`Successfully promoted ${email} to Admin!`);
        process.exit(0);
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
}

promoteUser();
