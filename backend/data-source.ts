import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
import { Product } from './entities/Product.js';
import { Order } from './entities/Order.js';
import { AdminLog } from './entities/AdminLog.js';
import { Event } from './entities/Event.js';
import path from 'path';

// Check if we should use SQLite (from environment or EDIT.json)
// In production (Fly.io), we use DATABASE_URL. Locally we use SQLite unless configured otherwise.
const isProduction = process.env.NODE_ENV === 'production';
const useSqlite = process.env.USE_SQLITE === 'true' || !isProduction;

export const AppDataSource = new DataSource(
  useSqlite
    ? {
      type: 'sqlite',
      database: process.env.SQLITE_DB || path.resolve('./backend/dev.sqlite'),
      entities: [User, Product, Order, AdminLog, Event],
      synchronize: true, // Auto-create tables in dev
      logging: true,
    }
    : {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Required for many cloud providers
      entities: [User, Product, Order, AdminLog, Event],
      synchronize: true, // Auto-sync schema in production for simplicity (use migrations for strict prod)
      logging: false,
      extra: {
        max: 10,
        connectionTimeoutMillis: 10000,
      },
    }
);
