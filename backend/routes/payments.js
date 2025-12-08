"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../data-source.js");
const Payment_js_1 = require("../entities/Payment.js");
const Order_js_1 = require("../entities/Order.js");
const router = (0, express_1.Router)();
const paymentRepo = data_source_js_1.AppDataSource.getRepository(Payment_js_1.Payment);
const orderRepo = data_source_js_1.AppDataSource.getRepository(Order_js_1.Order);
// Create a payment for an order
router.post('/', async (req, res) => {
    const { orderId, method, reference, amount } = req.body;
    if (!orderId || !method || !amount) {
        return res.status(400).json({ message: 'orderId, method and amount are required' });
    }
    const order = await orderRepo.findOneBy({ id: Number(orderId) });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    const payment = paymentRepo.create({ order, orderId: order.id, method, reference, amount, status: 'Pending' });
    await paymentRepo.save(payment);
    res.status(201).json(payment);
});
// Get payments for a specific order
router.get('/order/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const payments = await paymentRepo.find({ where: { orderId: Number(orderId) } });
    res.json(payments);
});
// Update payment status (e.g., after verification)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, reference } = req.body;
    const payment = await paymentRepo.findOneBy({ id: Number(id) });
    if (!payment)
        return res.status(404).json({ message: 'Payment not found' });
    if (status)
        payment.status = status;
    if (reference)
        payment.reference = reference;
    await paymentRepo.save(payment);
    res.json(payment);
});
exports.default = router;
