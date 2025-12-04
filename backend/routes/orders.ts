import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source.js';
import { Order } from '../entities/Order.js';
import { Event } from '../entities/Event.js';
import { Product } from '../entities/Product.js';
import { User } from '../entities/User.js';
import { sendPurchaseConfirmationEmail } from '../services/emailService.js';
import * as jwt from 'jsonwebtoken';

const router = Router();
const orderRepo = AppDataSource.getRepository(Order);
const eventRepo = AppDataSource.getRepository(Event);

// Create order
router.post('/', async (req: Request, res: Response) => {
  const { items, total, location, customerEmail } = req.body;

  // Check for auth token to link user
  let userId: number | null = null;
  const auth = req.headers.authorization;
  if (auth && process.env.JWT_SECRET) {
    try {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET) as any;
      userId = payload.id;
    } catch (e) { /* ignore invalid token for order creation */ }
  }

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Items array required' });
  }

  const order = orderRepo.create({ items: JSON.stringify(items), total, location, customerEmail, userId: userId || undefined });
  await orderRepo.save(order);
  // log order event
  await eventRepo.save(eventRepo.create({ type: 'order', metadata: JSON.stringify({ orderId: order.id, total }), userEmail: customerEmail }));

  // Send confirmation email
  if (customerEmail) {
    await sendPurchaseConfirmationEmail(customerEmail, {
      orderId: order.id,
      items,
      total,
      currency: '$' // Assuming USD for now
    });
  }

  res.status(201).json(order);
});

// List orders (Admin sees all, User sees theirs)
router.get('/', async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });

  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Server error' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET) as any;

    if (payload.role === 'admin') {
      const orders = await orderRepo.find({ order: { createdAt: 'DESC' }, relations: ['payments'] });
      res.json(orders);
    } else {
      const orders = await orderRepo.find({
        where: { userId: payload.id },
        order: { createdAt: 'DESC' },
        relations: ['payments']
      });
      res.json(orders);
    }
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
