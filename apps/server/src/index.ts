import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createApp } from './app';
import { initSocket } from './config/socket';
import prisma from './config/database';
import authRoutes from './routes/auth.routes';
import menuRoutes from './routes/menu.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';
import contactRoutes from './routes/contact.routes';
import invoiceRoutes from './routes/invoice.routes';
import { errorHandler } from './middleware/error.middleware';
import { authenticateToken } from './middleware/auth.middleware';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/cart', authenticateToken, cartRoutes);
app.use('/api/v1/orders', authenticateToken, orderRoutes);
app.use('/api/v1/payment', authenticateToken, paymentRoutes);
app.use('/api/v1/admin', authenticateToken, adminRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/invoice', authenticateToken, invoiceRoutes);

// Webhook route (needs raw body, must be before express.json)
app.post('/api/v1/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const webhookHandler = (await import('./services/payment.service')).default;
  await webhookHandler(req, res);
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
