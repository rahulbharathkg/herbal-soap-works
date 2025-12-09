
import { getDataSource } from '../api/shared/db';
import { User } from '../api/shared/User';

async function auditDatabase() {
    try {
        console.log('Connecting to database...');
        const ds = await getDataSource();
        console.log('Connected!');

        // Audit Tables
        console.log('\n--- TABLES ---');
        const queryRunner = ds.createQueryRunner();
        const tables = await queryRunner.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        console.table(tables);
        await queryRunner.release();

        // Audit Users
        console.log('\n--- USERS ---');
        const userRepo = ds.getRepository(User);
        const users = await userRepo.find();

        if (users.length === 0) {
            console.log('No users found.');
        } else {
            const safeUsers = users.map(u => ({
                id: u.id,
                email: u.email,
                name: u.name,
                role: u.role || 'user',
                isAdmin: u.isAdmin || false,
                isSubscribed: u.isSubscribed
            }));
            console.table(safeUsers);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error auditing database:', error);
        process.exit(1);
    }
}

auditDatabase();
