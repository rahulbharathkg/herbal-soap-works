import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../backend/entities/User.js';
import { Product } from '../../backend/entities/Product.js';
import { Order } from '../../backend/entities/Order.js';
import { AdminLog } from '../../backend/entities/AdminLog.js';
import { Event } from '../../backend/entities/Event.js';
import { Subscriber } from '../../backend/entities/Subscriber.js';
import { Payment } from '../../backend/entities/Payment.js';
import { AdminContent } from '../../backend/entities/AdminContent.js';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
    if (dataSource && dataSource.isInitialized) {
        return dataSource;
    }

    dataSource = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: true,
        entities: [User, Product, Order, AdminLog, Event, Subscriber, Payment, AdminContent],
        synchronize: true, // Temporarily enabled to create schema in PROD
        logging: false,
        extra: {
            ssl: {
                rejectUnauthorized: false
            },
            max: 5, // Smaller pool for serverless
            connectionTimeoutMillis: 10000,
        },
    });

    await dataSource.initialize();
    return dataSource;
}
