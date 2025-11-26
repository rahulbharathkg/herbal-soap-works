import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbConnection } from './_db';
import jwt from 'jsonwebtoken';
import { AdminLog } from '../backend/entities/AdminLog';

async function logAction(action: string, userEmail: string | undefined, details: any) {
  try {
    const db = await getDbConnection();
    const adminLogRepo = db.getRepository(AdminLog);
    const entry = adminLogRepo.create({ action, userEmail: userEmail || 'unknown', details: JSON.stringify(details) });
    await adminLogRepo.save(entry);
  } catch (e) {
    console.warn('Failed to write admin log', e);
  }
}

function isAdmin(req: VercelRequest, res: VercelResponse): { isValid: boolean, user?: any } {
  const auth = req.headers.authorization;
  if (auth) {
    try {
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not set');
        return { isValid: false };
      }
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET) as any;
      if (payload.role === 'admin') {
        return { isValid: true, user: payload };
      }
    } catch {
      return { isValid: false };
    }
  }
  return { isValid: false };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDbConnection();
  const productRepo = db.getRepository('Product');

  try {
    if (req.method === 'GET') {
      // List all products (public)
      const products = await productRepo.find();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      // Create product (admin only)
      const adminCheck = isAdmin(req, res);
      if (!adminCheck.isValid) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { name, description, price, imageUrl } = req.body;
      const product = productRepo.create({ name, description, price, imageUrl });
      await productRepo.save(product);

      await logAction('create_product', adminCheck.user?.email, { id: product.id, name });
      return res.status(201).json(product);
    }

    if (req.method === 'PUT') {
      // Update product (admin only)
      const adminCheck = isAdmin(req, res);
      if (!adminCheck.isValid) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id } = req.query;
      const { name, description, price, imageUrl } = req.body;
      const product = await productRepo.findOneBy({ id: Number(id) });

      if (!product) return res.status(404).json({ message: 'Not found' });

      product.name = name;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      await productRepo.save(product);

      await logAction('update_product', adminCheck.user?.email, { id: product.id, name });
      return res.status(200).json(product);
    }

    if (req.method === 'DELETE') {
      // Delete product (admin only)
      const adminCheck = isAdmin(req, res);
      if (!adminCheck.isValid) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id } = req.query;
      const product = await productRepo.findOneBy({ id: Number(id) });

      if (!product) return res.status(404).json({ message: 'Not found' });

      await productRepo.remove(product);
      await logAction('delete_product', adminCheck.user?.email, { id: product.id, name: product.name });
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
