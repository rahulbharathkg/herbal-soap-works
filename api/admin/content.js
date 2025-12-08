"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../_lib/db");
// import { requireAdmin, AuthRequest } from '../_lib/auth';
const AdminContent_js_1 = require("../entities/AdminContent.js");
async function handler(req, res) {
    try {
        const dataSource = await (0, db_1.getDataSource)();
        const contentRepo = dataSource.getRepository(AdminContent_js_1.AdminContent);
        if (req.method === 'GET') {
            // Return all content as a flat object
            const allContent = await contentRepo.find();
            const contentObj = {};
            allContent.forEach((item) => {
                contentObj[item.key] = item.value;
            });
            return res.status(200).json(contentObj);
        }
        if (req.method === 'POST') {
            // Update or create content keys
            const updates = req.body;
            for (const [key, value] of Object.entries(updates)) {
                let content = await contentRepo.findOne({ where: { key } });
                if (content) {
                    content.value = value;
                }
                else {
                    content = contentRepo.create({ key, value: value });
                }
                await contentRepo.save(content);
            }
            return res.status(200).json({ message: 'Content updated' });
        }
        return res.status(405).json({ message: 'Method not allowed' });
    }
    catch (error) {
        console.error('Admin content API error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
// Temporarily disable admin auth for testing
// export default requireAdmin(handler);
exports.default = handler;
