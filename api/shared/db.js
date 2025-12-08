"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = getDataSource;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Product_1 = require("./Product");
const Order_1 = require("./Order");
const AdminLog_1 = require("./AdminLog");
const Event_1 = require("./Event");
const Subscriber_1 = require("./Subscriber");
const Payment_1 = require("./Payment");
const AdminContent_1 = require("./AdminContent");
let dataSource = null;
async function getDataSource() {
    if (dataSource && dataSource.isInitialized) {
        return dataSource;
    }
    dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [User_1.User, Product_1.Product, Order_1.Order, AdminLog_1.AdminLog, Event_1.Event, Subscriber_1.Subscriber, Payment_1.Payment, AdminContent_1.AdminContent],
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
