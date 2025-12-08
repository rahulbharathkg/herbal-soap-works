"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../data-source.js");
const AdminLog_js_1 = require("../entities/AdminLog.js");
const router = (0, express_1.Router)();
const repo = data_source_js_1.AppDataSource.getRepository(AdminLog_js_1.AdminLog);
router.get('/', async (_req, res) => {
    const logs = await repo.find({ order: { createdAt: 'DESC' }, take: 200 });
    res.json(logs);
});
exports.default = router;
