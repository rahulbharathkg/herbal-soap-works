"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const db_1 = require("../_lib/db");
const Product_1 = require("../../backend/entities/Product");
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { id } = req.query;
        const dataSource = await (0, db_1.getDataSource)();
        const productRepo = dataSource.getRepository(Product_1.Product);
        const product = await productRepo.findOneBy({ id: Number(id) });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        console.error('Product detail API error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
