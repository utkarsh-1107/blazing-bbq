const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  sendOtp: (phone: string) =>
    fetchAPI<{ success: boolean; message: string; otp?: string }>('/api/v1/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    fetchAPI<{ success: boolean; data: { user: any; token: string } }>('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),

  // Menu
  getMenu: () => fetchAPI<{ success: boolean; data: { categories: any[] } }>('/api/v1/menu'),

  getCategories: () => fetchAPI<{ success: boolean; data: any[] }>('/api/v1/menu/categories'),

  // Cart
  getCart: (token: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/v1/cart`, { token }),

  addToCart: (token: string, menuItemId: string, quantity: number, notes?: string) =>
    fetchAPI<{ success: boolean; data: any }>('/api/v1/cart/items', {
      method: 'POST',
      token,
      body: JSON.stringify({ menuItemId, quantity, notes }),
    }),

  updateCartItem: (token: string, itemId: string, quantity: number, notes?: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/v1/cart/items/${itemId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ quantity, notes }),
    }),

  removeCartItem: (token: string, itemId: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/v1/cart/items/${itemId}`, {
      method: 'DELETE',
      token,
    }),

  clearCart: (token: string) =>
    fetchAPI<{ success: boolean; data: any }>('/api/v1/cart', { method: 'DELETE', token }),

  applyCoupon: (token: string, code: string) =>
    fetchAPI<{ success: boolean; data: any }>('/api/v1/cart/apply-coupon', {
      method: 'POST',
      token,
      body: JSON.stringify({ code }),
    }),

  // Orders
  createOrder: (token: string, data: {
    deliveryAddress?: string;
    notes?: string;
    couponCode?: string;
    customerName?: string;
    customerPhone?: string;
    orderType?: 'DELIVERY' | 'PICKUP';
  }) =>
    fetchAPI<{ success: boolean; data: any }>('/api/v1/orders', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  getOrders: (token: string) =>
    fetchAPI<{ success: boolean; data: any[] }>('/api/v1/orders', { token }),

  getOrder: (token: string, orderId: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/v1/orders/${orderId}`, { token }),

  // Payment
  createPayment: (token: string, orderId: string) =>
    fetchAPI<{ success: boolean; data: any }>('/api/v1/payment/create-order', {
      method: 'POST',
      token,
      body: JSON.stringify({ orderId }),
    }),

  verifyPayment: (token: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) =>
    fetchAPI<{ success: boolean; data: any }>('/api/v1/payment/verify', {
      method: 'POST',
      token,
      body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
    }),

  // Admin
  getAdminOrders: (token: string, status?: string) =>
    fetchAPI<{ success: boolean; data: { orders: any[]; total: number } }>(
      `/api/v1/admin/orders${status ? `?status=${status}` : ''}`,
      { token }
    ),

  getPendingOrders: (token: string) =>
    fetchAPI<{ success: boolean; data: any[] }>('/api/v1/admin/orders/pending', { token }),

  updateOrderStatus: (token: string, orderId: string, status: string, estimatedTime?: number, deliveryPartner?: { name: string; phone: string }) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/v1/admin/orders/${orderId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status, estimatedTime, deliveryPartner }),
    }),

  getRevenueStats: (token: string) =>
    fetchAPI<{ success: boolean; data: any }>('/api/v1/admin/revenue', { token }),

  // Contact
  submitContact: (data: { name: string; email: string; phone?: string; message: string }) =>
    fetchAPI<{ success: boolean; data: any }>('/api/v1/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Invoice
  downloadInvoice: (token: string, orderId: string) =>
    fetch(`${API_URL}/api/v1/invoice/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
