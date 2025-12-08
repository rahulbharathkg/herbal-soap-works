"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Product_js_1 = require("../entities/Product.js");
const User_js_1 = require("../entities/User.js");
const AdminContent_js_1 = require("../entities/AdminContent.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const Order_js_1 = require("../entities/Order.js");
const AdminLog_js_1 = require("../entities/AdminLog.js");
const Event_js_1 = require("../entities/Event.js");
const Subscriber_js_1 = require("../entities/Subscriber.js");
const Payment_js_1 = require("../entities/Payment.js");
async function importData() {
    console.log('📦 Importing data to PostgreSQL...\n');
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable not set');
        process.exit(1);
    }
    try {
        // Initialize PostgreSQL connection
        const dataSource = new typeorm_1.DataSource({
            type: 'postgres',
            url: DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            entities: [User_js_1.User, Product_js_1.Product, AdminContent_js_1.AdminContent, Order_js_1.Order, AdminLog_js_1.AdminLog, Event_js_1.Event, Subscriber_js_1.Subscriber, Payment_js_1.Payment],
            synchronize: true, // This will create tables
            logging: false,
        });
        await dataSource.initialize();
        console.log('✓ Connected to PostgreSQL database\n');
        // Read exported data
        const dataPath = path_1.default.join(__dirname, '..', 'export_data.json');
        if (!fs_1.default.existsSync(dataPath)) {
            console.error('❌ export_data.json not found. Run export_data script first.');
            process.exit(1);
        }
        const data = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
        // Import Users
        const userRepo = dataSource.getRepository(User_js_1.User);
        for (const userData of data.users) {
            const { id, ...rest } = userData; // Remove id to let PostgreSQL auto-generate
            const user = userRepo.create(rest);
            await userRepo.save(user);
        }
        console.log(`✓ Imported ${data.users.length} users`);
        // Import Products
        const productRepo = dataSource.getRepository(Product_js_1.Product);
        for (const productData of data.products) {
            const { id, ...rest } = productData;
            const product = productRepo.create(rest);
            await productRepo.save(product);
        }
        console.log(`✓ Imported ${data.products.length} products`);
        // Import Admin Content
        const contentRepo = dataSource.getRepository(AdminContent_js_1.AdminContent);
        for (const contentData of data.adminContent) {
            const { id, ...rest } = contentData;
            const content = contentRepo.create(rest);
            await contentRepo.save(content);
        }
        console.log(`✓ Imported ${data.adminContent.length} admin content entries`);
        console.log('\n✅ Data import complete!');
        await dataSource.destroy();
    }
    catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}
importData();
