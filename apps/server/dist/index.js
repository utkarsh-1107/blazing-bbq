"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_1 = require("./config/socket");
const database_1 = __importDefault(require("./config/database"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const menu_routes_1 = __importDefault(require("./routes/menu.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const invoice_routes_1 = __importDefault(require("./routes/invoice.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_middleware_1 = require("./middleware/auth.middleware");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.io
(0, socket_1.initSocket)(httpServer);
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/menu', menu_routes_1.default);
app.use('/api/v1/cart', auth_middleware_1.authenticateToken, cart_routes_1.default);
app.use('/api/v1/orders', auth_middleware_1.authenticateToken, order_routes_1.default);
app.use('/api/v1/payment', auth_middleware_1.authenticateToken, payment_routes_1.default);
app.use('/api/v1/admin', auth_middleware_1.authenticateToken, admin_routes_1.default);
app.use('/api/v1/contact', contact_routes_1.default);
app.use('/api/v1/invoice', auth_middleware_1.authenticateToken, invoice_routes_1.default);
// Webhook route (needs raw body, must be before express.json)
app.post('/api/v1/webhook', express_1.default.raw({ type: 'application/json' }), async (req, res) => {
    const webhookHandler = (await Promise.resolve().then(() => __importStar(require('./services/payment.service')))).default;
    await webhookHandler(req, res);
});
// Error handler
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 4000;
async function main() {
    try {
        await database_1.default.$connect();
        console.log('Database connected');
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
main();
// Graceful shutdown
process.on('SIGINT', async () => {
    await database_1.default.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map