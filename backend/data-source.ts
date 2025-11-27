import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Product } from './entities/Product';
import { Order } from './entities/Order';
import { AdminLog } from './entities/AdminLog';
import { Event } from './entities/Event';

// Vercel Postgres configuration
export const AppDataSource = new DataSource({
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
});
