"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../data-source.js");
const Product_js_1 = require("../entities/Product.js");
const User_js_1 = require("../entities/User.js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.post('/seed-database', async (req, res) => {
    try {
        console.log('Starting database seed process...');
        const userRepo = data_source_js_1.AppDataSource.getRepository(User_js_1.User);
        const productRepo = data_source_js_1.AppDataSource.getRepository(Product_js_1.Product);
        // Create admin user if not exists
        const adminEmail = process.env.SEED_ADMIN_EMAIL || 'lavanya@herbal';
        const adminPass = process.env.SEED_ADMIN_PASSWORD || 'adminpass';
        let admin = await userRepo.findOneBy({ email: adminEmail });
        if (!admin) {
            const hashed = await bcryptjs_1.default.hash(adminPass, 10);
            admin = userRepo.create({ email: adminEmail, password: hashed, role: 'admin', emailVerified: true });
            await userRepo.save(admin);
            console.log('Admin user created:', adminEmail);
        }
        // Add products
        const adjectives = ["Organic", "Luxury", "Handmade", "Natural", "Creamy", "Exfoliating", "Soothing", "Refreshing", "Aromatic", "Pure", "Gentle", "Rich", "Silky", "Premium", "Herbal"];
        const ingredients = ["Lavender", "Charcoal", "Goat Milk", "Honey", "Aloe Vera", "Turmeric", "Sandalwood", "Rose", "Lemon", "Tea Tree", "Coconut", "Shea Butter", "Neem", "Saffron", "Jasmine", "Mint", "Eucalyptus", "Orange", "Papaya", "Cucumber"];
        const types = ["Soap", "Bar", "Body Wash", "Scrub", "Cleanser", "Beauty Bar", "Bath Bar"];
        const products = [];
        // Generate 50 random products
        for (let i = 0; i < 50; i++) {
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const ing = ingredients[Math.floor(Math.random() * ingredients.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const name = `${adj} ${ing} ${type}`;
            // Avoid duplicates in this batch
            if (products.find(p => p.name === name))
                continue;
            const price = Math.floor(Math.random() * (200 - 50 + 1)) + 50; // 50 to 200
            products.push({
                name,
                description: `Experience the goodness of ${ing} with our ${adj.toLowerCase()} ${type.toLowerCase()}. Perfect for daily use to keep your skin healthy and glowing.`,
                price: price,
                cost: Math.floor(price * 0.6),
                imageUrl: `https://placehold.co/600x400/e0c3fc/4a148c?text=${encodeURIComponent(name)}`,
            });
        }
        for (const p of products) {
            const exists = await productRepo.findOneBy({ name: p.name });
            if (!exists) {
                const product = productRepo.create(p);
                await productRepo.save(product);
                console.log('Seeded product:', p.name);
            }
        }
        res.json({ success: true, message: 'Database seeded successfully!' });
    }
    catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ success: false, error: 'Seeding failed' });
    }
});
exports.default = router;
