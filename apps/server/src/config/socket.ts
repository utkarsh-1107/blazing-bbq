import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, OrderStatus } from '../../../../shared/types';

export interface ExtendedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
  userId?: string;
  isAdmin?: boolean;
}

interface DeliveryPartner {
  name: string;
  phone: string;
}

let io: Server<ClientToServerEvents, ServerToClientEvents>;

export function initSocket(httpServer: HttpServer): Server<ClientToServerEvents, ServerToClientEvents> {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: ExtendedSocket) => {
    console.log('Client connected:', socket.id);

    // Join admin room
    socket.on('join:admin', () => {
      socket.join('admin');
      console.log('Admin joined room:', socket.id);
    });

    // Join order tracking room
    socket.on('join:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log('Client joined order room:', orderId);
    });

    // Leave order tracking room
    socket.on('leave:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log('Client left order room:', orderId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): Server<ClientToServerEvents, ServerToClientEvents> {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

// Helper functions to emit events

export function emitNewOrder(order: any) {
  io?.to('admin').emit('order:created', order);
}

export function emitOrderStatusUpdate(
  orderId: string, 
  status: OrderStatus, 
  estimatedTime?: number,
  deliveryPartner?: DeliveryPartner
) {
  io?.to(`order:${orderId}`).emit('order:statusUpdate', { 
    orderId, 
    status,
    estimatedTime,
    deliveryPartner
  });
}

export function emitOrderCompleted(order: any) {
  io?.to(`order:${order.id}`).emit('order:completed', order);
}

export function emitNotification(message: string) {
  io?.to('admin').emit('notification', message);
}
