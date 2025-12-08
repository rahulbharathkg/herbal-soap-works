import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './User';
import { Product } from './Product';
import { Order } from './Order';
import { AdminLog } from './AdminLog';
import { Event } from './Event';
import { Subscriber } from './Subscriber';
import { Payment } from './Payment';
import { AdminContent } from './AdminContent';

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
