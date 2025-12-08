"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../data-source.js");
const Event_js_1 = require("../entities/Event.js");
const Order_js_1 = require("../entities/Order.js");
const Product_js_1 = require("../entities/Product.js");
const router = (0, express_1.Router)();
// Basic analytics endpoints
router.get('/overview', async (_req, res) => {
    const eventRepo = data_source_js_1.AppDataSource.getRepository(Event_js_1.Event);
    const orderRepo = data_source_js_1.AppDataSource.getRepository(Order_js_1.Order);
    const totalViews = await eventRepo.count({ where: { type: 'view' } });
    const totalClicks = await eventRepo.count({ where: { type: 'click' } });
    const totalOrders = await orderRepo.count();
    const revenueRaw = await orderRepo.createQueryBuilder('o').select('SUM(o.total)', 'sum').getRawOne();
    const revenue = Number(revenueRaw.sum) || 0;
    res.json({ totalViews, totalClicks, totalOrders, revenue });
});
router.get('/by-product', async (_req, res) => {
    const eventRepo = data_source_js_1.AppDataSource.getRepository(Event_js_1.Event);
    const clicks = await eventRepo.createQueryBuilder('e').select('e.productId', 'productId').addSelect('COUNT(*)', 'clicks').where("e.type='click'").groupBy('e.productId').getRawMany();
    res.json(clicks);
});
router.get('/revenue-by-location', async (_req, res) => {
    const orderRepo = data_source_js_1.AppDataSource.getRepository(Order_js_1.Order);
    const q = await orderRepo.createQueryBuilder('o').select('o.location', 'location').addSelect('COUNT(*)', 'orders').addSelect('SUM(o.total)', 'revenue').groupBy('o.location').getRawMany();
    res.json(q);
});
router.get('/profit-by-location', async (_req, res) => {
    const orderRepo = data_source_js_1.AppDataSource.getRepository(Order_js_1.Order);
    const productRepo = data_source_js_1.AppDataSource.getRepository(Product_js_1.Product);
    const orders = await orderRepo.find();
    const map = {};
    for (const o of orders) {
        const loc = o.location || 'unknown';
        if (!map[loc])
            map[loc] = { revenue: 0, cost: 0, profit: 0, orders: 0 };
        map[loc].orders += 1;
        const items = Array.isArray(o.items) ? o.items : [];
        for (const it of items) {
            const qty = Number(it.quantity || 1);
            const price = Number(it.price || 0);
            const prod = it.productId ? await productRepo.findOneBy({ id: Number(it.productId) }).catch(() => null) : null;
            const cost = prod ? Number(prod.cost || 0) * qty : 0;
            const revenue = price * qty;
            map[loc].revenue += revenue;
            map[loc].cost += cost;
            map[loc].profit += revenue - cost;
        }
    }
    const out = Object.keys(map).map((k) => ({ location: k, ...map[k] }));
    res.json(out);
});
exports.default = router;
