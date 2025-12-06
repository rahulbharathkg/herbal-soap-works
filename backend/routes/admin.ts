import express from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source.js';
import { AdminContent } from '../entities/AdminContent.js';

const router = express.Router();
const contentRepo = AppDataSource.getRepository(AdminContent);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Admin Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials as requested for local dev
    if (username === 'admin' && password === 'herbalsw24') {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware to verify admin token
const verifyAdmin = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded.role !== 'admin') throw new Error();
        next();
    } catch (e) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Get all content
router.get('/content', async (req, res) => {
    try {
        const content = await contentRepo.find();
        // Convert array to object for easier frontend consumption: { key: value }
        const contentMap = content.reduce((acc: any, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        res.json(contentMap);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching content' });
    }
});

// Update content (Batch update)
router.post('/content', verifyAdmin, async (req, res) => {
    const updates = req.body; // Expecting { key: value, key2: value2 }

    try {
        for (const [key, value] of Object.entries(updates)) {
            let item = await contentRepo.findOneBy({ key });
            if (!item) {
                item = new AdminContent();
                item.key = key;
                item.type = 'text'; // Default, can be inferred or passed separately if needed
            }
            item.value = String(value);
            await contentRepo.save(item);
        }
        res.json({ message: 'Content updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating content' });
    }
});

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../../frontend/public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Upload File
router.post('/upload', verifyAdmin, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// List Media
router.get('/media', verifyAdmin, (req, res) => {
    const uploadPath = path.resolve(__dirname, '../../frontend/public/uploads');
    if (!fs.existsSync(uploadPath)) return res.json([]);

    const files = fs.readdirSync(uploadPath).map(file => ({
        name: file,
        url: `/uploads/${file}`
    }));
    res.json(files);
});

// Deploy (Git Push)
router.post('/deploy', verifyAdmin, (req, res) => {
    const projectRoot = path.resolve(__dirname, '../../');

    // Execute git commands
    exec('git add . && git commit -m "Content update via Admin Panel" && git push', { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Deploy error: ${error}`);
            return res.status(500).json({ message: 'Deployment failed', details: stderr });
        }
        res.json({ message: 'Deployment triggered successfully', output: stdout });
    });
});

export default router;
