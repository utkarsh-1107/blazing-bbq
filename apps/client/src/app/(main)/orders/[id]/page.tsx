'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { formatDate, formatTime, formatPrice, getStatusColor, getStatusLabel } from '@/lib/utils';
import { initSocket, joinOrderRoom, leaveOrderRoom } from '@/lib/socket';

interface OrderItem {
  id: string;
  quantity: number;
  total: number;
  menuItem?: {
    id: string;
    name: string;
    price: number;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  gst: number;
  deliveryFee: number;
  discount: number;
  paymentStatus: string;
  createdAt: string;
  estimatedTime?: number;
  deliveryAddress?: string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id;
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        if (!token || !orderId) return;
        const res = await api.getOrder(token, orderId);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const socket = initSocket();
    if (orderId) {
      joinOrderRoom(orderId);
      socket.on('order:statusUpdate', (payload: any) => {
        if (payload?.orderId === orderId) {
          setOrder((prev) => (prev ? { ...prev, status: payload.status, estimatedTime: payload.estimatedTime } : prev));
        }
      });
    }

    return () => {
      if (orderId) {
        leaveOrderRoom(orderId);
      }
      socket.off('order:statusUpdate');
    };
  }, [isAuthenticated, token, orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-4">Order not found.</p>
        <Link href="/orders" className="text-primary hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to orders
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">
              {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>{item.menuItem?.name || 'Menu Item'} x {item.quantity}</span>
              <span className="font-medium">{formatPrice(Number(item.total))}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold mb-3">Bill Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(Number(order.subtotal || 0))}</span></div>
          <div className="flex justify-between"><span>GST</span><span>{formatPrice(Number(order.gst || 0))}</span></div>
          <div className="flex justify-between"><span>Delivery Fee</span><span>{formatPrice(Number(order.deliveryFee || 0))}</span></div>
          {!!order.discount && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(Number(order.discount))}</span></div>}
          <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{formatPrice(Number(order.total || 0))}</span></div>
        </div>
      </div>
    </div>
  );
}
