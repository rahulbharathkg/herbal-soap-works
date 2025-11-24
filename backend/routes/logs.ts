import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { AdminLog } from '../entities/AdminLog';

const router = Router();
const repo = AppDataSource.getRepository(AdminLog);

router.get('/', async (_req, res) => {
  const logs = await repo.find({ order: { createdAt: 'DESC' }, take: 200 });
  res.json(logs);
});

export default router;
