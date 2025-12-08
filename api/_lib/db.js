"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = getDataSource;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_js_1 = require("../entities/User.js");
const Product_js_1 = require("../entities/Product.js");
const Order_js_1 = require("../entities/Order.js");
const AdminLog_js_1 = require("../entities/AdminLog.js");
const Event_js_1 = require("../entities/Event.js");
const Subscriber_js_1 = require("../entities/Subscriber.js");
const Payment_js_1 = require("../entities/Payment.js");
const AdminContent_js_1 = require("../entities/AdminContent.js");
let dataSource = null;
async function getDataSource() {
    if (dataSource && dataSource.isInitialized) {
        return dataSource;
    }
    dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [User_js_1.User, Product_js_1.Product, Order_js_1.Order, AdminLog_js_1.AdminLog, Event_js_1.Event, Subscriber_js_1.Subscriber, Payment_js_1.Payment, AdminContent_js_1.AdminContent],
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
