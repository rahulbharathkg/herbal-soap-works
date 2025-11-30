import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
import { Product } from './entities/Product.js';
import { Order } from './entities/Order.js';
import { AdminLog } from './entities/AdminLog.js';
import { Event } from './entities/Event.js';
import path from 'path';

// Check if we should use SQLite (from environment or EDIT.json)
const useSqlite = process.env.USE_SQLITE === 'true';

export const AppDataSource = new DataSource(
  useSqlite
    ? {
      type: 'sqlite',
      database: process.env.SQLITE_DB || path.resolve('./backend/dev.sqlite'),
      entities: [User, Product, Order, AdminLog, Event],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }
    : {
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      entities: [User, Product, Order, AdminLog, Event],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in dev only
      logging: process.env.NODE_ENV !== 'production',
      // Connection pooling for serverless
      extra: {
        max: 10, // Maximum connections
        connectionTimeoutMillis: 10000,
      },
    }
);
