import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User.js';
import { Product } from '../entities/Product.js';
import { Order } from '../entities/Order.js';
import { AdminLog } from '../entities/AdminLog.js';
import { Event } from '../entities/Event.js';
import { Subscriber } from '../entities/Subscriber.js';
import { Payment } from '../entities/Payment.js';
import { AdminContent } from '../entities/AdminContent.js';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
    if (dataSource && dataSource.isInitialized) {
        return dataSource;
    }

    dataSource = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [User, Product, Order, AdminLog, Event, Subscriber, Payment, AdminContent],
        synchronize: true, // Temporarily enabled to create DB tables in PROD
        logging: false,
        extra: {
            max: 5, // Smaller pool for serverless
            connectionTimeoutMillis: 10000,
        },
    });

    await dataSource.initialize();
    return dataSource;
}
