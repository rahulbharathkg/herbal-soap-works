import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
import { User } from '../backend/entities/User';
import { Product } from '../backend/entities/Product';
import { Event } from '../backend/entities/Event';
import { Order } from '../backend/entities/Order';
import { AdminLog } from '../backend/entities/AdminLog';

dotenv.config();

const useSqlite = process.env.USE_SQLITE === 'true';

export const AppDataSource = new DataSource(
  useSqlite
    ? {
        type: 'sqlite',
        database: process.env.SQLITE_DB || path.resolve(__dirname, '../backend/dev.sqlite'),
        entities: [User, Product, Event, Order, AdminLog],
        synchronize: true,
        logging: false,
      }
    : {
        type: 'postgres',
        url: process.env.DATABASE_URL, // Use DATABASE_URL if available
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'postgres',
        entities: [User, Product, Event, Order, AdminLog],
        synchronize: true,
        logging: false,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
);

// Initialize the database connection
let dbInitialized = false;

export async function getDbConnection() {
  if (!dbInitialized) {
    await AppDataSource.initialize();
    dbInitialized = true;
  }
  return AppDataSource;
}
