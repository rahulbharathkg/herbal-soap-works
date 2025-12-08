"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_js_1 = require("./entities/User.js");
const Product_js_1 = require("./entities/Product.js");
const Order_js_1 = require("./entities/Order.js");
const AdminLog_js_1 = require("./entities/AdminLog.js");
const Event_js_1 = require("./entities/Event.js");
const Subscriber_js_1 = require("./entities/Subscriber.js");
const Payment_js_1 = require("./entities/Payment.js");
const AdminContent_js_1 = require("./entities/AdminContent.js");
const path_1 = __importDefault(require("path"));
// Check if we should use SQLite (from environment or EDIT.json)
// In production (Fly.io), we use DATABASE_URL. Locally we use SQLite unless configured otherwise.
const isProduction = process.env.NODE_ENV === 'production';
const useSqlite = process.env.USE_SQLITE === 'true' || !isProduction;
exports.AppDataSource = new typeorm_1.DataSource(useSqlite
    ? {
        type: 'sqlite',
        database: process.env.SQLITE_DB || path_1.default.resolve('./backend/dev.sqlite'),
        entities: [User_js_1.User, Product_js_1.Product, Order_js_1.Order, AdminLog_js_1.AdminLog, Event_js_1.Event, Subscriber_js_1.Subscriber, Payment_js_1.Payment, AdminContent_js_1.AdminContent],
        synchronize: true, // Auto-create tables in dev
        logging: true,
    }
    : {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Required for many cloud providers
        entities: [User_js_1.User, Product_js_1.Product, Order_js_1.Order, AdminLog_js_1.AdminLog, Event_js_1.Event, Subscriber_js_1.Subscriber, Payment_js_1.Payment, AdminContent_js_1.AdminContent],
        synchronize: true, // Auto-sync schema in production for simplicity (use migrations for strict prod)
        logging: false,
        extra: {
            max: 10,
            connectionTimeoutMillis: 10000,
        },
    });
