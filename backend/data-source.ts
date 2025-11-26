import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const useSqlite = process.env.USE_SQLITE === 'true';

// Support both DATABASE_URL (Render) and individual env vars (Supabase)
const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
  useSqlite
    ? {
      type: 'sqlite',
      database: process.env.SQLITE_DB || path.resolve(__dirname, 'dev.sqlite'),
      entities: [path.join(__dirname, 'entities', '*.ts'), path.join(__dirname, 'entities', '*.js')],
      synchronize: true,
      logging: false,
    }
    : databaseUrl
      ? {
        type: 'postgres',
        url: databaseUrl,
        entities: [path.join(__dirname, 'entities', '*.ts'), path.join(__dirname, 'entities', '*.js')],
        synchronize: true, // WARNING: set to false in production after initial setup
        logging: false,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
      : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'postgres',
        entities: [path.join(__dirname, 'entities', '*.ts'), path.join(__dirname, 'entities', '*.js')],
        synchronize: true,
        logging: false,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
);
