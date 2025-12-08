"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_js_1 = require("../data-source.js");
dotenv_1.default.config();
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const AdminLog_js_1 = require("../entities/AdminLog.js");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const router = (0, express_1.Router)();
const uploadDir = path_1.default.resolve(__dirname, '..', 'uploads');
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
        const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
        cb(null, safe);
    },
});
const upload = (0, multer_1.default)({ storage });
function isAdmin(req, res, next) {
    const auth = req.headers.authorization;
    if (auth) {
        try {
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET not set');
                return res.status(500).json({ message: 'Server error' });
            }
            const token = auth.split(' ')[1];
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
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
router.post('/', isAdmin, upload.single('file'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: 'No file' });
    const url = `/uploads/${req.file.filename}`;
    // log upload
    try {
        const adminLogRepo = data_source_js_1.AppDataSource.getRepository(AdminLog_js_1.AdminLog);
        const user = req.user;
        adminLogRepo
            .save(adminLogRepo.create({ action: 'upload', userEmail: user?.email || 'unknown', details: JSON.stringify({ filename: req.file.filename, original: req.file.originalname }) }))
            .catch(() => { });
    }
    catch (e) {
        // ignore logging errors
    }
    res.json({ url });
});
exports.default = router;
