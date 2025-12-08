"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../data-source.js");
const Order_js_1 = require("../entities/Order.js");
const Event_js_1 = require("../entities/Event.js");
const emailService_js_1 = require("../services/emailService.js");
const jwt = __importStar(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const orderRepo = data_source_js_1.AppDataSource.getRepository(Order_js_1.Order);
const eventRepo = data_source_js_1.AppDataSource.getRepository(Event_js_1.Event);
// Create order
router.post('/', async (req, res) => {
    const { items, total, location, customerEmail } = req.body;
    // Check for auth token to link user
    let userId = null;
    const auth = req.headers.authorization;
    if (auth && process.env.JWT_SECRET) {
        try {
            const token = auth.split(' ')[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            userId = payload.id;
        }
        catch (e) { /* ignore invalid token for order creation */ }
    }
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Items array required' });
    }
    const order = orderRepo.create({ items: JSON.stringify(items), total, location, customerEmail, userId: userId || undefined });
    await orderRepo.save(order);
    // log order event
    await eventRepo.save(eventRepo.create({ type: 'order', metadata: JSON.stringify({ orderId: order.id, total }), userEmail: customerEmail }));
    // Send confirmation email
    if (customerEmail) {
        await (0, emailService_js_1.sendPurchaseConfirmationEmail)(customerEmail, {
            orderId: order.id,
            items,
            total,
            currency: '$' // Assuming USD for now
        });
    }
    res.status(201).json(order);
});
// List orders (Admin sees all, User sees theirs)
router.get('/', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        if (!process.env.JWT_SECRET)
            return res.status(500).json({ message: 'Server error' });
        const token = auth.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role === 'admin') {
            const orders = await orderRepo.find({ order: { createdAt: 'DESC' }, relations: ['payments'] });
            res.json(orders);
        }
        else {
            const orders = await orderRepo.find({
                where: { userId: payload.id },
                order: { createdAt: 'DESC' },
                relations: ['payments']
            });
            res.json(orders);
        }
    }
    catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
exports.default = router;
