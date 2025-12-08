import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDataSource } from '../backend/_lib/db.js';
import { Product } from '../backend/entities/Product.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const dataSource = await getDataSource();
        const productRepo = dataSource.getRepository(Product);

        // Query params: search, minPrice, maxPrice, page, limit
        const search = (req.query.search as string) || '';
        const minPrice = parseFloat(req.query.minPrice as string) || 0;
        const maxPrice = parseFloat(req.query.maxPrice as string) || 1000000;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const query = productRepo.createQueryBuilder('product');

        if (search) {
            query.where('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${search}%` });
        }

        query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });

        const [products, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return res.status(200).json({ products, total, page, limit });
    } catch (error: any) {
        console.error('Products API error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
