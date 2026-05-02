'use client';

import { create } from 'zustand';

export type OrderStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  paymentStatus: string;
  estimatedTime?: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    quantity: number;
    total: number;
    menuItem?: {
      id: string;
      name: string;
      price: number;
    };
  }>;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  notes?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
}

interface OrderState {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; description: string; color: string }> = {
  PENDING: { label: 'Pending', description: 'Order placed, awaiting confirmation', color: 'text-amber-600 bg-amber-50' },
  QUEUED: { label: 'Queued', description: 'Order confirmed and queued', color: 'text-blue-600 bg-blue-50' },
  CONFIRMED: { label: 'Confirmed', description: 'Order confirmed by restaurant', color: 'text-blue-600 bg-blue-50' },
  PREPARING: { label: 'Preparing', description: 'Kitchen is preparing your order', color: 'text-orange-600 bg-orange-50' },
  READY: { label: 'Ready', description: 'Order is ready for pickup/delivery', color: 'text-green-600 bg-green-50' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', description: 'Delivery partner is on the way', color: 'text-purple-600 bg-purple-50' },
  DELIVERED: { label: 'Delivered', description: 'Order has been delivered', color: 'text-green-600 bg-green-50' },
  COMPLETED: { label: 'Completed', description: 'Order completed', color: 'text-green-600 bg-green-50' },
  CANCELLED: { label: 'Cancelled', description: 'Order was cancelled', color: 'text-red-600 bg-red-50' },
};

const TIMELINE: OrderStatus[] = ['PENDING', 'QUEUED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'];

export function getTimelineStep(status: OrderStatus): number {
  const idx = TIMELINE.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),
}));
