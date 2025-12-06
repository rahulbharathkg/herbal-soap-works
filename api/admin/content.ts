import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDataSource } from '../_lib/db';
import { requireAdmin, AuthRequest } from '../_lib/auth';
import { AdminContent } from '../../backend/entities/AdminContent';

async function handler(req: AuthRequest, res: VercelResponse) {
    try {
        const dataSource = await getDataSource();
        const contentRepo = dataSource.getRepository(AdminContent);

        if (req.method === 'GET') {
            // Return all content as a flat object
            const allContent = await contentRepo.find();
            const contentObj: any = {};
            allContent.forEach((item) => {
                contentObj[item.key] = item.value;
            });
            return res.status(200).json(contentObj);
        }

        if (req.method === 'POST') {
            // Update or create content keys
            const updates = req.body;
            for (const [key, value] of Object.entries(updates)) {
                let content = await contentRepo.findOne({ where: { key } });
                if (content) {
                    content.value = value as string;
                } else {
                    content = contentRepo.create({ key, value: value as string });
                }
                await contentRepo.save(content);
            }
            return res.status(200).json({ message: 'Content updated' });
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error: any) {
        console.error('Admin content API error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export default requireAdmin(handler);
