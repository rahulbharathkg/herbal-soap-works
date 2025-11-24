import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const productRepo = AppDataSource.getRepository(Product);
import { AdminLog } from '../entities/AdminLog';
const adminLogRepo = AppDataSource.getRepository(AdminLog);

async function logAction(action: string, userEmail: string | undefined, details: any) {
  try {
    const entry = adminLogRepo.create({ action, userEmail: userEmail || 'unknown', details: JSON.stringify(details) });
    await adminLogRepo.save(entry);
  } catch (e) {
    console.warn('Failed to write admin log', e);
  }
}

function isAdminOrKey(req: Request, res: Response, next: Function) {
  // Allow access if valid admin JWT OR if x-sb-secret header matches SB_SECRET
  const auth = req.headers.authorization;
  if (auth) {
    try {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      if (payload.role === 'admin') {
        (req as any).user = payload;
        return next();
      }
    } catch {
      // fallthrough to check header
    }
  }

  const key = req.headers['x-sb-secret'] as string | undefined;
  if (key && process.env.SB_SECRET && key === process.env.SB_SECRET) {
    // allow with key
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized' });
}

// Admin: Create product
router.post('/', isAdminOrKey, async (req: Request, res: Response) => {
  const { name, description, price, imageUrl } = req.body;
  const product = productRepo.create({ name, description, price, imageUrl });
  await productRepo.save(product);
  const user = (req as any).user;
  await logAction('create_product', user?.email || (req.headers['x-sb-secret'] ? 'sb_secret' : undefined), { id: product.id, name });
  res.status(201).json(product);
});

// Admin: Update product
router.put('/:id', isAdminOrKey, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, imageUrl } = req.body;
  const product = await productRepo.findOneBy({ id: Number(id) });
  if (!product) return res.status(404).json({ message: 'Not found' });
  product.name = name;
  product.description = description;
  product.price = price;
  product.imageUrl = imageUrl;
  await productRepo.save(product);
  const user = (req as any).user;
  await logAction('update_product', user?.email || (req.headers['x-sb-secret'] ? 'sb_secret' : undefined), { id: product.id, name });
  res.json(product);
});

// Admin: Delete product
router.delete('/:id', isAdminOrKey, async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productRepo.findOneBy({ id: Number(id) });
  if (!product) return res.status(404).json({ message: 'Not found' });
  await productRepo.remove(product);
  const user = (req as any).user;
  await logAction('delete_product', user?.email || (req.headers['x-sb-secret'] ? 'sb_secret' : undefined), { id: product.id, name: product.name });
  res.json({ message: 'Deleted' });
});

// Public: List products
router.get('/', async (_req: Request, res: Response) => {
  const products = await productRepo.find();
  res.json(products);
});

// Public: Get product detail
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productRepo.findOneBy({ id: Number(id) });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

export default router;
