'use client';

import { io, Socket } from 'socket.io-client';

type OrderStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

type TypedSocket = Socket;

let socket: TypedSocket | null = null;

export const initSocket = (): TypedSocket => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const getSocket = (): TypedSocket | null => socket;

export const joinOrderRoom = (orderId: string) => {
  socket?.emit('join:order', orderId);
};

export const leaveOrderRoom = (orderId: string) => {
  socket?.emit('leave:order', orderId);
};

export const joinAdminRoom = () => {
  socket?.emit('join:admin');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  estimatedTime?: number;
  deliveryPartner?: {
    name: string;
    phone: string;
  };
}
