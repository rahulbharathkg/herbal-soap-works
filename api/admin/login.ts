import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDataSource } from '../shared/db';
import { User } from '../shared/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        const dataSource = await getDataSource();
        const userRepo = dataSource.getRepository(User);

        const user = await userRepo.findOne({ where: { email: username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({ token, role: user.role, email: user.email });
    } catch (error: any) {
        console.error('Login API error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
