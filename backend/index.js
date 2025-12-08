"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_js_1 = require("./data-source.js");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const url_1 = require("url");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
// Load .env relative to the backend dist folder or source folder
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '..', '.env') });
// Load editable JSON config if present (root-level EDIT.json)
try {
    const editPath = path_1.default.resolve(__dirname, '..', '..', 'EDIT.json');
    if (fs_1.default.existsSync(editPath)) {
        const raw = fs_1.default.readFileSync(editPath, 'utf-8');
        const cfg = JSON.parse(raw);
        // Merge top-level keys into process.env if not set
        Object.keys(cfg).forEach((k) => {
            if (process.env[k] === undefined) {
                if (typeof cfg[k] === 'object') {
                    process.env[k] = JSON.stringify(cfg[k]);
                }
                else {
                    process.env[k] = String(cfg[k]);
                }
            }
        });
    }
}
catch (err) {
    console.warn('Could not load EDIT.json', err);
}
const app = (0, express_1.default)();
// CORS configuration for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://your-app.vercel.app'
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
const auth_js_1 = __importDefault(require("./routes/auth.js"));
app.use('/api/auth', auth_js_1.default);
const newsletter_js_1 = __importDefault(require("./routes/newsletter.js"));
app.use('/api/newsletter', newsletter_js_1.default);
const products_js_1 = __importDefault(require("./routes/products.js"));
app.use('/api/products', products_js_1.default);
const payments_js_1 = __importDefault(require("./routes/payments.js"));
app.use('/api/payments', payments_js_1.default);
const upload_js_1 = __importDefault(require("./routes/upload.js"));
app.use('/api/upload', upload_js_1.default);
const seed_js_1 = __importDefault(require("./routes/seed.js"));
app.use('/api', seed_js_1.default);
const events_js_1 = __importDefault(require("./routes/events.js"));
app.use('/api/events', events_js_1.default);
const orders_js_1 = __importDefault(require("./routes/orders.js"));
app.use('/api/orders', orders_js_1.default);
const reports_js_1 = __importDefault(require("./routes/reports.js"));
app.use('/api/reports', reports_js_1.default);
const logs_js_1 = __importDefault(require("./routes/logs.js"));
app.use('/api/admin/logs', logs_js_1.default);
const admin_js_1 = __importDefault(require("./routes/admin.js"));
app.use('/api/admin', admin_js_1.default);
// serve uploads folder
const uploadsDir = path_1.default.resolve(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir))
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express_1.default.static(uploadsDir));
// expose editable config to frontend (safe defaults only)
app.get('/config', (_req, res) => {
    const cfgPath = path_1.default.resolve(__dirname, '..', '..', 'EDIT.json');
    if (fs_1.default.existsSync(cfgPath)) {
        const raw = fs_1.default.readFileSync(cfgPath, 'utf-8');
        try {
            const cfg = JSON.parse(raw);
            // send minimal safe config (avoid secrets)
            const safe = {
                BACKEND_PORT: cfg.BACKEND_PORT || 4000,
                USE_SQLITE: cfg.USE_SQLITE === true,
                SQLITE_DB: cfg.SQLITE_DB || './backend/dev.sqlite',
            };
            return res.json(safe);
        }
        catch (e) {
            return res.status(500).json({ message: 'Invalid EDIT.json' });
        }
    }
    return res.json({ BACKEND_PORT: 4000, USE_SQLITE: true });
});
// Initialize database and start server (only in local development)
if (process.argv[1] === (0, url_1.fileURLToPath)(import.meta.url)) {
    data_source_js_1.AppDataSource.initialize()
        .then(() => {
        console.log('Data Source has been initialized!');
        const PORT = process.env.BACKEND_PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
        .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });
}
// Export app for Vercel serverless
exports.default = app;
