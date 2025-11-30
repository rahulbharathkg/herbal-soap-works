#!/usr/bin/env tsx

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { User } from '../backend/entities/User.js';
import { Product } from '../backend/entities/Product.js';
import { Order } from '../backend/entities/Order.js';
import { AdminLog } from '../backend/entities/AdminLog.js';
import { Event } from '../backend/entities/Event.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', 'backend', '.env') });

// PostgreSQL source (uses DATABASE_URL or individual vars)
const pgDataSource = new DataSource({
    type: 'postgres',
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    entities: [User, Product, Order, AdminLog, Event],
});

// SQLite target (uses same entities)
const sqliteDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.SQLITE_DB || path.resolve(__dirname, '..', 'backend', 'dev.sqlite'),
    synchronize: true, // create tables if missing
    entities: [User, Product, Order, AdminLog, Event],
});

async function migrate() {
    try {
        await pgDataSource.initialize();
        await sqliteDataSource.initialize();
        console.log('Both data sources initialized');

        // List of entity classes to migrate – add more if you have other tables
        const entities = pgDataSource.entityMetadatas.map(meta => meta.target as any);

        for (const Entity of entities) {
            const pgRepo = pgDataSource.getRepository(Entity);
            const sqliteRepo = sqliteDataSource.getRepository(Entity);

            const records = await pgRepo.find();
            if (records.length === 0) continue;

            // Clear target table first (optional – comment out if you want to merge)
            await sqliteRepo.clear();
            await sqliteRepo.save(records as any);
            console.log(`Migrated ${records.length} rows for ${Entity.name}`);
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed', err);
        process.exit(1);
    }
}

migrate();
