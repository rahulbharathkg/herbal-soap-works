import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source.js';
import { Payment } from '../entities/Payment.js';
import { Order } from '../entities/Order.js';

const router = Router();
const paymentRepo = AppDataSource.getRepository(Payment);
const orderRepo = AppDataSource.getRepository(Order);

// Create a payment for an order
router.post('/', async (req: Request, res: Response) => {
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
router.get('/order/:orderId', async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const payments = await paymentRepo.find({ where: { orderId: Number(orderId) } });
    res.json(payments);
});

// Update payment status (e.g., after verification)
router.patch('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, reference } = req.body;
    const payment = await paymentRepo.findOneBy({ id: Number(id) });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (status) payment.status = status;
    if (reference) payment.reference = reference;
    await paymentRepo.save(payment);
    res.json(payment);
});

export default router;
