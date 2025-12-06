import { VercelRequest, VercelResponse } from '@vercel/node';
// import { getDataSource } from './_lib/db';
// import { Product } from '../backend/entities/Product';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Mock data for testing
    const mockProducts = [
        {
            id: 1,
            name: "Herbal Soap - Lavender",
            description: "Relaxing lavender-scented herbal soap",
            price: 12.99,
            imageUrl: "/uploads/lavender-soap.jpg",
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: "Herbal Soap - Mint",
            description: "Refreshing mint herbal soap",
            price: 11.99,
            imageUrl: "/uploads/mint-soap.jpg",
            createdAt: new Date().toISOString()
        }
    ];

    return res.status(200).json({
        products: mockProducts,
        total: mockProducts.length,
        page: 1,
        limit: 20
    });
}
