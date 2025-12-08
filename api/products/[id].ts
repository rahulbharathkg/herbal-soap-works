import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDataSource } from '../../backend/_lib/db.js';
import { Product } from '../../backend/entities/Product.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { id } = req.query;
        const dataSource = await getDataSource();
        const productRepo = dataSource.getRepository(Product);

        const product = await productRepo.findOneBy({ id: Number(id) });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error: any) {
        console.error('Product detail API error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
