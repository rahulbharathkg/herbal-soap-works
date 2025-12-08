"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../data-source.js");
const Subscriber_js_1 = require("../entities/Subscriber.js");
const User_js_1 = require("../entities/User.js");
const router = (0, express_1.Router)();
const subscriberRepo = data_source_js_1.AppDataSource.getRepository(Subscriber_js_1.Subscriber);
const userRepo = data_source_js_1.AppDataSource.getRepository(User_js_1.User);
// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: 'Email required' });
    // Check if already subscribed in Subscriber table
    const existingSub = await subscriberRepo.findOneBy({ email });
    if (existingSub)
        return res.json({ message: 'Already subscribed' });
    // Check if user exists, update their subscription status
    const user = await userRepo.findOneBy({ email });
    if (user) {
        user.isSubscribed = true;
        await userRepo.save(user);
    }
    // Add to Subscriber table
    const sub = subscriberRepo.create({ email });
    await subscriberRepo.save(sub);
    res.status(201).json({ message: 'Subscribed successfully' });
});
// Admin: Broadcast email
router.post('/broadcast', async (req, res) => {
    // Basic admin check (should use middleware in real app)
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ message: 'Unauthorized' });
    // ... verify admin token logic ...
    const { subject, message } = req.body;
    if (!subject || !message)
        return res.status(400).json({ message: 'Subject and message required' });
    const subscribers = await subscriberRepo.find();
    const users = await userRepo.find({ where: { isSubscribed: true } });
    // Merge unique emails
    const emails = new Set([...subscribers.map(s => s.email), ...users.map(u => u.email)]);
    // Send emails (mock implementation for now, or use nodemailer)
    console.log(`Broadcasting to ${emails.size} recipients: ${subject}`);
    // In a real app, use a queue or batch sending
    // for (const email of emails) { await sendEmail(email, subject, message); }
    res.json({ message: `Broadcast sent to ${emails.size} subscribers` });
});
exports.default = router;
