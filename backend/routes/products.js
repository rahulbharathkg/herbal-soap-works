"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../data-source.js");
const Product_js_1 = require("../entities/Product.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const productRepo = data_source_js_1.AppDataSource.getRepository(Product_js_1.Product);
const AdminLog_js_1 = require("../entities/AdminLog.js");
const adminLogRepo = data_source_js_1.AppDataSource.getRepository(AdminLog_js_1.AdminLog);
async function logAction(action, userEmail, details) {
    try {
        const entry = adminLogRepo.create({ action, userEmail: userEmail || 'unknown', details: JSON.stringify(details) });
        await adminLogRepo.save(entry);
    }
    catch (e) {
        console.warn('Failed to write admin log', e);
    }
}
function isAdmin(req, res, next) {
    const auth = req.headers.authorization;
    if (auth) {
        try {
            const secret = process.env.JWT_SECRET || 'fallback_secret';
            const token = auth.split(' ')[1];
            const payload = jsonwebtoken_1.default.verify(token, secret);
            if (payload.role === 'admin') {
                req.user = payload;
                return next();
            }
        }
        catch {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
    return res.status(401).json({ message: 'Unauthorized' });
}
// Admin: Create product
router.post('/', isAdmin, async (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    const product = productRepo.create({ name, description, price, imageUrl });
    await productRepo.save(product);
    const user = req.user;
    await logAction('create_product', user?.email, { id: product.id, name });
    res.status(201).json(product);
});
// Admin: Update product
router.put('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;
    const product = await productRepo.findOneBy({ id: Number(id) });
    if (!product)
        return res.status(404).json({ message: 'Not found' });
    product.name = name;
    product.description = description;
    product.price = price;
    product.imageUrl = imageUrl;
    await productRepo.save(product);
    const user = req.user;
    await logAction('update_product', user?.email, { id: product.id, name });
    res.json(product);
});
// Admin: Delete product
router.delete('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const product = await productRepo.findOneBy({ id: Number(id) });
    if (!product)
        return res.status(404).json({ message: 'Not found' });
    await productRepo.remove(product);
    const user = req.user;
    await logAction('delete_product', user?.email, { id: product.id, name: product.name });
    res.json({ message: 'Deleted' });
});
// Public: List products
router.get('/', async (req, res) => {
    // Query params: search, minPrice, maxPrice, page, limit
    const search = req.query.search || '';
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 1000000;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const query = productRepo.createQueryBuilder('product');
    if (search) {
        query.where('(product.name LIKE :search OR product.description LIKE :search)', { search: `%${search}%` });
    }
    query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
    const [products, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
    res.json({ products, total, page, limit });
});
// Public: Get product detail
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await productRepo.findOneBy({ id: Number(id) });
    if (!product)
        return res.status(404).json({ message: 'Not found' });
    res.json(product);
});
exports.default = router;
