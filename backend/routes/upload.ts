import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
dotenv.config();
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const router = Router();
const uploadDir = path.resolve(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, safe);
  },
});

const upload = multer({ storage });

function isAdmin(req: Request, res: Response, next: Function) {
  const auth = req.headers.authorization;
  if (auth) {
    try {
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not set');
        return res.status(500).json({ message: 'Server error' });
      }
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET) as any;
      if (payload.role === 'admin') {
        (req as any).user = payload;
        return next();
      }
    } catch {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

router.post('/', isAdmin, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const url = `/uploads/${req.file.filename}`;
  // log upload
  try {
    const adminLogRepo = AppDataSource.getRepository(require('../entities/AdminLog').AdminLog);
    const user = (req as any).user;
    adminLogRepo
      .save(
        adminLogRepo.create({ action: 'upload', userEmail: user?.email || 'unknown', details: JSON.stringify({ filename: req.file.filename, original: req.file.originalname }) })
      )
      .catch(() => { });
  } catch (e) {
    // ignore logging errors
  }
  res.json({ url });
});

export default router;
