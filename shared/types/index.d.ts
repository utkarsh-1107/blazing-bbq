export interface User {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    role: 'CUSTOMER' | 'ADMIN';
    createdAt: Date;
}
export interface OtpRequest {
    phone: string;
}
export interface OtpVerify {
    phone: string;
    code: string;
}
export interface AuthResponse {
    user: User;
    token: string;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    sortOrder: number;
    isActive: boolean;
    items?: MenuItem[];
}
export interface MenuItem {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    image?: string;
    categoryId: string;
    isAvailable: boolean;
    isVeg: boolean;
    prepTime?: number;
}
export interface MenuResponse {
    categories: Category[];
}
export interface CartItem {
    id: string;
    menuItemId: string;
    menuItem: MenuItem;
    quantity: number;
    notes?: string;
}
export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
}
export interface AddToCartRequest {
    menuItemId: string;
    quantity: number;
    notes?: string;
}
export interface UpdateCartItemRequest {
    quantity: number;
    notes?: string;
}
export interface ApplyCouponRequest {
    code: string;
}
export type OrderStatus = 'PENDING' | 'QUEUED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export interface DeliveryPartner {
    name: string;
    phone: string;
}
export interface OrderItem {
    id: string;
    menuItemId: string;
    menuItem: MenuItem;
    quantity: number;
    price: number;
    total: number;
}
export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    user?: User;
    items: OrderItem[];
    status: OrderStatus;
    subtotal: number;
    gst: number;
    deliveryFee: number;
    discount: number;
    couponCode?: string;
    total: number;
    deliveryAddress?: string;
    paymentId?: string;
    paymentStatus: PaymentStatus;
    notes?: string;
    customerPhone?: string;
    customerName?: string;
    estimatedTime?: number;
    deliveryPartner?: string;
    deliveryPartnerPhone?: string;
    deliveryPartnerName?: string;
    orderType: 'DELIVERY' | 'PICKUP';
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}
export interface CreateOrderRequest {
    deliveryAddress?: string;
    notes?: string;
    couponCode?: string;
    customerName?: string;
    customerPhone?: string;
    orderType?: 'DELIVERY' | 'PICKUP';
}
export interface StatusHistoryEntry {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
}
export interface CreatePaymentRequest {
    orderId: string;
}
export interface PaymentResponse {
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
}
export interface RazorPayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    status: string;
    created_at: number;
}
export interface AdminOrderUpdate {
    status: OrderStatus;
    estimatedTime?: number;
    deliveryPartner?: DeliveryPartner;
}
export interface RevenueStats {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    todayRevenue: number;
    todayOrders: number;
    monthRevenue: number;
    monthOrders: number;
}
export interface ContactMessage {
    name: string;
    email: string;
    phone?: string;
    message: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface ServerToClientEvents {
    'order:created': (order: Order) => void;
    'order:statusUpdate': (data: {
        orderId: string;
        status: OrderStatus;
        estimatedTime?: number;
        deliveryPartner?: DeliveryPartner;
    }) => void;
    'order:completed': (order: Order) => void;
    'notification': (message: string) => void;
}
export interface ClientToServerEvents {
    'join:order': (orderId: string) => void;
    'leave:order': (orderId: string) => void;
    'join:admin': () => void;
}
export interface WhatsAppMessage {
    phone: string;
    message: string;
}
export interface TimelineEvent {
    status: OrderStatus;
    label: string;
    description: string;
    timestamp?: Date;
    isCompleted: boolean;
    isCurrent: boolean;
}
//# sourceMappingURL=index.d.ts.map