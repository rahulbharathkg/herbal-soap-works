"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_js_1 = require("./data-source.js");
const Product_js_1 = require("./entities/Product.js");
const AdminContent_js_1 = require("./entities/AdminContent.js");
const products = [
    {
        name: 'Lavender Bliss',
        description: 'Calming lavender essential oil with shea butter for a relaxing bath.',
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1600857062241-98e5b4f1429c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        name: 'Citrus Burst',
        description: 'Energizing lemon and orange zest to wake up your senses.',
        price: 11.50,
        imageUrl: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        name: 'Oatmeal & Honey',
        description: 'Gentle exfoliation with soothing honey, perfect for sensitive skin.',
        price: 13.00,
        imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        name: 'Charcoal Detox',
        description: 'Activated charcoal deep cleans pores and removes impurities.',
        price: 14.50,
        imageUrl: 'https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        name: 'Rose Petal',
        description: 'Luxurious rose scent with real petals for a romantic touch.',
        price: 15.00,
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
];
const defaultLayout = [
    {
        id: 'hero-1',
        type: 'hero',
        content: {
            title: 'Handcrafted Organic Soaps',
            subtitle: 'Experience the purity of nature with our premium collection.',
            imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1200&auto=format&fit=crop&q=60'
        }
    },
    {
        id: 'text-1',
        type: 'text',
        content: {
            text: 'Our Best Sellers',
            align: 'center',
            variant: 'h4'
        }
    },
    {
        id: 'grid-1',
        type: 'product-grid',
        content: {
            limit: 3
        }
    }
];
async function seed() {
    try {
        await data_source_js_1.AppDataSource.initialize();
        console.log('Database connected');
        const productRepo = data_source_js_1.AppDataSource.getRepository(Product_js_1.Product);
        const contentRepo = data_source_js_1.AppDataSource.getRepository(AdminContent_js_1.AdminContent);
        // Seed Products
        for (const p of products) {
            const exists = await productRepo.findOneBy({ name: p.name });
            if (!exists) {
                await productRepo.save(productRepo.create(p));
                console.log(`Created product: ${p.name}`);
            }
        }
        // Seed Home Layout
        const layoutKey = 'home_layout';
        let layout = await contentRepo.findOneBy({ key: layoutKey });
        if (!layout) {
            layout = contentRepo.create({
                key: layoutKey,
                value: JSON.stringify(defaultLayout),
                type: 'json'
            });
            await contentRepo.save(layout);
            console.log('Created default home layout');
        }
        console.log('Seeding complete');
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding failed', error);
        process.exit(1);
    }
}
seed();
