"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_js_1 = require("../data-source.js");
const Product_js_1 = require("../entities/Product.js");
const User_js_1 = require("../entities/User.js");
const AdminContent_js_1 = require("../entities/AdminContent.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
async function exportData() {
    console.log('📦 Exporting SQLite data...\n');
    try {
        await data_source_js_1.AppDataSource.initialize();
        console.log('✓ Connected to SQLite database\n');
        const data = {};
        // Export Products
        const productRepo = data_source_js_1.AppDataSource.getRepository(Product_js_1.Product);
        const products = await productRepo.find();
        data.products = products;
        console.log(`✓ Exported ${products.length} products`);
        // Export Users
        const userRepo = data_source_js_1.AppDataSource.getRepository(User_js_1.User);
        const users = await userRepo.find();
        data.users = users;
        console.log(`✓ Exported ${users.length} users`);
        // Export Admin Content
        const contentRepo = data_source_js_1.AppDataSource.getRepository(AdminContent_js_1.AdminContent);
        const content = await contentRepo.find();
        data.adminContent = content;
        console.log(`✓ Exported ${content.length} admin content entries`);
        // Save to JSON file
        const exportPath = path_1.default.join(__dirname, '..', 'export_data.json');
        fs_1.default.writeFileSync(exportPath, JSON.stringify(data, null, 2));
        console.log(`\n✅ Data exported to: ${exportPath}`);
        await data_source_js_1.AppDataSource.destroy();
    }
    catch (error) {
        console.error('❌ Export failed:', error);
        process.exit(1);
    }
}
exportData();
