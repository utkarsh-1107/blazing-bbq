'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import { formatDate, formatTime, formatPrice, getStatusColor, getStatusLabel } from '@/lib/utils';
import { Loader2, Package, TrendingUp, DollarSign, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import { joinAdminRoom } from '@/lib/socket';
import { getSocket } from '@/lib/socket';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  items: any[];
  total: number;
  paymentStatus: string;
  user: { name?: string; phone: string };
  createdAt: string;
}

interface Stats {
  todayRevenue: number;
  todayOrders: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

const statusOptions = ['QUEUED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'];

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { isAuthenticated, token, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (!token) return;
        const [ordersRes, statsRes] = await Promise.all([
          api.getAdminOrders(token, filter || undefined),
          api.getRevenueStats(token),
        ]);
        if (ordersRes.success) {
          setOrders(ordersRes.data.orders);
        }
        if (statsRes.success) {
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Join admin socket room
    joinAdminRoom();
    const socket = getSocket();

    socket?.on('order:created', (newOrder: any) => {
      setOrders((prev) => [newOrder as Order, ...prev]);
    });

    return () => {
      socket?.off('order:created');
    };
  }, [isAuthenticated, token, user, router, filter]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      if (!token) return;
      await api.updateOrderStatus(token, orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Blazing Barbecue</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/menu" className="text-sm text-gray-600 hover:text-primary">
              View Site
            </Link>
            <button
              onClick={() => useAuthStore.getState().logout()}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today's Revenue</p>
                  <p className="text-xl font-bold">{formatPrice(stats.todayRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today's Orders</p>
                  <p className="text-xl font-bold">{stats.todayOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Order</p>
                  <p className="text-xl font-bold">{formatPrice(stats.averageOrderValue)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
              filter === '' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            All Orders
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
                filter === status ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.paymentStatus}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{order.user.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatPrice(Number(order.total))}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(order.status))}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        <p>{formatDate(order.createdAt)}</p>
                        <p>{formatTime(order.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
