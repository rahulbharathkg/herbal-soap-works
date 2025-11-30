import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source.js';
import { Event } from '../entities/Event.js';

const router = Router();
const repo = AppDataSource.getRepository(Event);

router.post('/', async (req: Request, res: Response) => {
  const { type, productId, userEmail, metadata } = req.body;
  const ev = repo.create({ type, productId, userEmail, metadata: metadata ? JSON.stringify(metadata) : undefined });
  await repo.save(ev);
  res.json({ ok: true });
});

export default router;
