import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source.js';
import { Order } from '../entities/Order.js';
import { Event } from '../entities/Event.js';

const router = Router();
const orderRepo = AppDataSource.getRepository(Order);
const eventRepo = AppDataSource.getRepository(Event);

// Create order
router.post('/', async (req: Request, res: Response) => {
  const { items, total, location, customerEmail } = req.body;
  const order = orderRepo.create({ items: JSON.stringify(items), total, location, customerEmail });
  await orderRepo.save(order);
  // log order event
  await eventRepo.save(eventRepo.create({ type: 'order', metadata: JSON.stringify({ orderId: order.id, total }), userEmail: customerEmail }));
  res.status(201).json(order);
});

// List orders (admin)
router.get('/', async (_req: Request, res: Response) => {
  const orders = await orderRepo.find({ order: { createdAt: 'DESC' } });
  res.json(orders);
});

export default router;
