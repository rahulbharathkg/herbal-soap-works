import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbConnection } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDbConnection();
  const productRepo = db.getRepository('Product');

  try {
    const { id } = req.query;

    if (req.method === 'GET') {
      // Get product detail (public)
      const product = await productRepo.findOneBy({ id: Number(id) });
      if (!product) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json(product);
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Product detail API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
