"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../data-source.js");
const Event_js_1 = require("../entities/Event.js");
const router = (0, express_1.Router)();
const repo = data_source_js_1.AppDataSource.getRepository(Event_js_1.Event);
router.post('/', async (req, res) => {
    const { type, productId, userEmail, metadata } = req.body;
    const ev = repo.create({ type, productId, userEmail, metadata: metadata ? JSON.stringify(metadata) : undefined });
    await repo.save(ev);
    res.json({ ok: true });
});
exports.default = router;
