import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';
// Load .env relative to the backend dist folder or source folder
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const useSqlite = process.env.USE_SQLITE === 'true';

export const AppDataSource = new DataSource(
  useSqlite
    ? {
      type: 'sqlite',
      database: process.env.SQLITE_DB || './dev.sqlite',
      synchronize: true,
      logging: false,
      entities: [__dirname + '/entities/*.{js,ts}'],
      migrations: [__dirname + '/migrations/*.{js,ts}'],
      subscribers: [],
    }
    : {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      logging: false,
      entities: [__dirname + '/entities/*.{js,ts}'],
      migrations: [__dirname + '/migrations/*.{js,ts}'],
      subscribers: [],
    }
);
