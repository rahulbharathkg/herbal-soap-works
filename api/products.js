"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const db_1 = require("./_lib/db");
const Product_js_1 = require("./entities/Product.js");
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const dataSource = await (0, db_1.getDataSource)();
        const productRepo = dataSource.getRepository(Product_js_1.Product);
        // Query params: search, minPrice, maxPrice, page, limit
        const search = req.query.search || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 1000000;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const query = productRepo.createQueryBuilder('product');
        if (search) {
            query.where('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${search}%` });
        }
        query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
        const [products, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return res.status(200).json({ products, total, page, limit });
    }
    catch (error) {
        console.error('Products API error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
