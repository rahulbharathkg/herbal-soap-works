import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
dotenv.config();
import multer from 'multer';
import path from 'path';

const router = Router();
const uploadDir = path.resolve(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, safe);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req: Request, res: Response) => {
  // Allow upload if admin jwt present OR x-sb-secret header matches
  const auth = req.headers.authorization;
  let authorized = false;
  if (auth) {
    try {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      if (payload.role === 'admin') authorized = true;
    } catch {
      authorized = false;
    }
  }
  const key = req.headers['x-sb-secret'] as string | undefined;
  if (!authorized && key && process.env.SB_SECRET && key === process.env.SB_SECRET) authorized = true;
  if (!authorized) return res.status(401).json({ message: 'Unauthorized' });

  if (!req.file) return res.status(400).json({ message: 'No file' });
  const url = `/uploads/${req.file.filename}`;
  // log upload
  try {
    const { AdminLog } = require('../entities/AdminLog');
  } catch {}
  // save log if possible
  try {
    const adminLogRepo = AppDataSource.getRepository(require('../entities/AdminLog').AdminLog);
    const user = (req as any).user;
    adminLogRepo
      .save(
        adminLogRepo.create({ action: 'upload', userEmail: user?.email || (req.headers['x-sb-secret'] ? 'sb_secret' : 'unknown'), details: JSON.stringify({ filename: req.file.filename, original: req.file.originalname }) })
      )
      .catch(() => {});
  } catch (e) {
    // ignore logging errors
  }
  res.json({ url });
});

export default router;
