interface CreateOrderParams {
    deliveryAddress?: string;
    notes?: string;
    couponCode?: string;
    customerName?: string;
    customerPhone?: string;
    orderType?: 'DELIVERY' | 'PICKUP';
}
interface DeliveryPartner {
    name: string;
    phone: string;
}
export declare const orderService: {
    createOrder(userId: string, params: CreateOrderParams): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        couponCode: string | null;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveryAddress: string | null;
        paymentId: string | null;
        paymentStatus: string;
        estimatedTime: number | null;
        completedAt: Date | null;
    }>;
    getOrder(userId: string, orderId: string): Promise<({
        items: ({
            menuItem: {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: import("@prisma/client/runtime/library").Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            menuItemId: string;
            quantity: number;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        couponCode: string | null;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveryAddress: string | null;
        paymentId: string | null;
        paymentStatus: string;
        estimatedTime: number | null;
        completedAt: Date | null;
    }) | null>;
    getUserOrders(userId: string): Promise<({
        items: ({
            menuItem: {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: import("@prisma/client/runtime/library").Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            menuItemId: string;
            quantity: number;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        couponCode: string | null;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveryAddress: string | null;
        paymentId: string | null;
        paymentStatus: string;
        estimatedTime: number | null;
        completedAt: Date | null;
    })[]>;
    getAdminOrders(status?: string, limit?: number, offset?: number): Promise<{
        orders: ({
            user: {
                role: string;
                phone: string;
                id: string;
                createdAt: Date;
                name: string | null;
                email: string | null;
                updatedAt: Date;
            };
            items: ({
                menuItem: {
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    slug: string;
                    image: string | null;
                    isAvailable: boolean;
                    price: import("@prisma/client/runtime/library").Decimal;
                    categoryId: string;
                    isVeg: boolean;
                    prepTime: number | null;
                };
            } & {
                id: string;
                createdAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                menuItemId: string;
                quantity: number;
                total: import("@prisma/client/runtime/library").Decimal;
                orderId: string;
            })[];
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            notes: string | null;
            orderNumber: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            gst: import("@prisma/client/runtime/library").Decimal;
            deliveryFee: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            couponCode: string | null;
            total: import("@prisma/client/runtime/library").Decimal;
            deliveryAddress: string | null;
            paymentId: string | null;
            paymentStatus: string;
            estimatedTime: number | null;
            completedAt: Date | null;
        })[];
        total: number;
    }>;
    getAdminOrder(orderId: string): Promise<({
        user: {
            role: string;
            phone: string;
            id: string;
            createdAt: Date;
            name: string | null;
            email: string | null;
            updatedAt: Date;
        };
        items: ({
            menuItem: {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: import("@prisma/client/runtime/library").Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            menuItemId: string;
            quantity: number;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        couponCode: string | null;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveryAddress: string | null;
        paymentId: string | null;
        paymentStatus: string;
        estimatedTime: number | null;
        completedAt: Date | null;
    }) | null>;
    updateOrderStatus(orderId: string, status: string, adminId: string, params?: {
        estimatedTime?: number;
        deliveryPartner?: DeliveryPartner;
    }): Promise<{
        user: {
            role: string;
            phone: string;
            id: string;
            createdAt: Date;
            name: string | null;
            email: string | null;
            updatedAt: Date;
        };
        items: ({
            menuItem: {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: import("@prisma/client/runtime/library").Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            menuItemId: string;
            quantity: number;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        couponCode: string | null;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveryAddress: string | null;
        paymentId: string | null;
        paymentStatus: string;
        estimatedTime: number | null;
        completedAt: Date | null;
    }>;
    updatePaymentStatus(orderId: string, paymentStatus: string, paymentId?: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        couponCode: string | null;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveryAddress: string | null;
        paymentId: string | null;
        paymentStatus: string;
        estimatedTime: number | null;
        completedAt: Date | null;
    }>;
    getRevenueStats(): Promise<{
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        todayRevenue: number;
        todayOrders: number;
        monthRevenue: number;
        monthOrders: number;
    }>;
    getPendingOrders(): Promise<({
        user: {
            role: string;
            phone: string;
            id: string;
            createdAt: Date;
            name: string | null;
            email: string | null;
            updatedAt: Date;
        };
        items: ({
            menuItem: {
                description: string | null;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                image: string | null;
                isAvailable: boolean;
                price: import("@prisma/client/runtime/library").Decimal;
                categoryId: string;
                isVeg: boolean;
                prepTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            menuItemId: string;
            quantity: number;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        couponCode: string | null;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveryAddress: string | null;
        paymentId: string | null;
        paymentStatus: string;
        estimatedTime: number | null;
        completedAt: Date | null;
    })[]>;
};
export {};
//# sourceMappingURL=order.service.d.ts.map