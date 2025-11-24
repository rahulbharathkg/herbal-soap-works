import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
// Load .env relative to the backend dist folder or source folder
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Load editable JSON config if present (root-level EDIT.json)
try {
  const editPath = path.resolve(__dirname, '..', '..', 'EDIT.json');
  if (fs.existsSync(editPath)) {
    const raw = fs.readFileSync(editPath, 'utf-8');
    const cfg = JSON.parse(raw);
    // Merge top-level keys into process.env if not set
    Object.keys(cfg).forEach((k) => {
      if (process.env[k] === undefined) {
        if (typeof cfg[k] === 'object') {
          process.env[k] = JSON.stringify(cfg[k]);
        } else {
          process.env[k] = String(cfg[k]);
        }
      }
    });
  }
} catch (err) {
  console.warn('Could not load EDIT.json', err);
}

const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);

import productRoutes from './routes/products';
app.use('/api/products', productRoutes);

import uploadRoutes from './routes/upload';
app.use('/api/upload', uploadRoutes);

import eventsRoutes from './routes/events';
app.use('/api/events', eventsRoutes);

import ordersRoutes from './routes/orders';
app.use('/api/orders', ordersRoutes);

import reportsRoutes from './routes/reports';
app.use('/api/reports', reportsRoutes);

import logsRoutes from './routes/logs';
app.use('/api/admin/logs', logsRoutes);

// serve uploads folder
const uploadsDir = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// expose editable config to frontend (safe defaults only)
app.get('/config', (_req, res) => {
  const cfgPath = path.resolve(__dirname, '..', '..', 'EDIT.json');
  if (fs.existsSync(cfgPath)) {
    const raw = fs.readFileSync(cfgPath, 'utf-8');
    try {
      const cfg = JSON.parse(raw);
      // send minimal safe config (avoid secrets)
      const safe = {
        BACKEND_PORT: cfg.BACKEND_PORT || 4000,
        USE_SQLITE: cfg.USE_SQLITE === true,
        SQLITE_DB: cfg.SQLITE_DB || './backend/dev.sqlite',
      };
      return res.json(safe);
    } catch (e) {
      return res.status(500).json({ message: 'Invalid EDIT.json' });
    }
  }
  return res.json({ BACKEND_PORT: 4000, USE_SQLITE: true });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
