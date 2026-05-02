"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middleware/error.middleware");
const socket_1 = require("../config/socket");
const cart_service_1 = require("./cart.service");
exports.orderService = {
    async createOrder(userId, params) {
        const { deliveryAddress, notes, couponCode, customerName, customerPhone, orderType = 'DELIVERY' } = params;
        // Get user's cart
        const cart = await cart_service_1.cartService.getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new error_middleware_1.AppError('Cart is empty', 400);
        }
        // Generate order number
        const orderCount = await database_1.default.order.count();
        const orderNumber = `BBQ-${new Date().getFullYear()}-${String(orderCount + 1).padStart(5, '0')}`;
        // Calculate totals
        const subtotal = cart.subtotal;
        const gst = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
        const deliveryFee = orderType === 'DELIVERY' ? 50 : 0;
        let discount = 0;
        // Apply coupon if provided
        if (couponCode) {
            const coupon = await database_1.default.coupon.findUnique({
                where: { code: couponCode.toUpperCase() },
            });
            if (coupon && coupon.isActive) {
                if (coupon.discountType === 'PERCENTAGE') {
                    discount = Math.min(Number(coupon.discountValue) / 100 * subtotal, Number(coupon.maxDiscount) || Infinity);
                }
                else {
                    discount = Number(coupon.discountValue);
                }
                // Increment coupon usage
                await database_1.default.coupon.update({
                    where: { id: coupon.id },
                    data: { usedCount: { increment: 1 } },
                });
            }
        }
        const total = subtotal + gst + deliveryFee - discount;
        // Get user for customer info
        const user = await database_1.default.user.findUnique({ where: { id: userId } });
        // Create order
        const order = await database_1.default.order.create({
            data: {
                orderNumber,
                userId,
                items: {
                    create: cart.items.map((item) => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        price: item.menuItem.price,
                        total: Number(item.menuItem.price) * item.quantity,
                    })),
                },
                status: 'PENDING',
                subtotal,
                gst,
                deliveryFee,
                discount,
                couponCode: couponCode?.toUpperCase(),
                total,
                deliveryAddress,
                notes,
                paymentStatus: 'PENDING',
                customerPhone: customerPhone || user?.phone,
                customerName: customerName || user?.name,
                orderType,
            },
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
                user: true,
            },
        });
        // Clear cart
        await cart_service_1.cartService.clearCart(userId);
        // Emit to admin
        (0, socket_1.emitNewOrder)(order);
        return order;
    },
    async getOrder(userId, orderId) {
        const order = await database_1.default.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
        return order;
    },
    async getUserOrders(userId) {
        const orders = await database_1.default.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return orders;
    },
    async getAdminOrders(status, limit = 50, offset = 0) {
        const where = {};
        if (status) {
            where.status = status;
        }
        const [orders, total] = await Promise.all([
            database_1.default.order.findMany({
                where,
                include: {
                    user: true,
                    items: {
                        include: {
                            menuItem: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            database_1.default.order.count({ where }),
        ]);
        return { orders, total };
    },
    async getAdminOrder(orderId) {
        const order = await database_1.default.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
        return order;
    },
    async updateOrderStatus(orderId, status, adminId, params) {
        const updateData = {
            status: status,
        };
        // Handle completed status
        if (status === 'COMPLETED' || status === 'DELIVERED') {
            updateData.completedAt = new Date();
        }
        // Handle estimated time
        if (params?.estimatedTime !== undefined) {
            updateData.estimatedTime = params.estimatedTime;
        }
        // Handle delivery partner
        if (params?.deliveryPartner) {
            updateData.deliveryPartnerName = params.deliveryPartner.name;
            updateData.deliveryPartnerPhone = params.deliveryPartner.phone;
        }
        const order = await database_1.default.order.update({
            where: { id: orderId },
            data: updateData,
            include: {
                user: true,
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
        // Log admin action
        await database_1.default.adminLog.create({
            data: {
                adminId,
                action: 'UPDATE_STATUS',
                entity: 'ORDER',
                entityId: orderId,
                newValue: { status, estimatedTime: params?.estimatedTime, deliveryPartner: params?.deliveryPartner },
            },
        });
        // Emit to customer with additional data
        (0, socket_1.emitOrderStatusUpdate)(orderId, status, params?.estimatedTime, params?.deliveryPartner);
        if (status === 'COMPLETED' || status === 'DELIVERED') {
            (0, socket_1.emitOrderCompleted)(order);
        }
        return order;
    },
    async updatePaymentStatus(orderId, paymentStatus, paymentId) {
        const order = await database_1.default.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: paymentStatus,
                paymentId,
                // Set to QUEUED when payment is confirmed
                status: paymentStatus === 'PAID' ? 'QUEUED' : undefined,
            },
        });
        return order;
    },
    async getRevenueStats() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalRevenue, totalOrders, todayRevenue, todayOrders, monthRevenue, monthOrders,] = await Promise.all([
            database_1.default.order.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { total: true },
            }),
            database_1.default.order.count({ where: { paymentStatus: 'PAID' } }),
            database_1.default.order.aggregate({
                where: {
                    paymentStatus: 'PAID',
                    createdAt: { gte: startOfDay },
                },
                _sum: { total: true },
            }),
            database_1.default.order.count({
                where: {
                    paymentStatus: 'PAID',
                    createdAt: { gte: startOfDay },
                },
            }),
            database_1.default.order.aggregate({
                where: {
                    paymentStatus: 'PAID',
                    createdAt: { gte: startOfMonth },
                },
                _sum: { total: true },
            }),
            database_1.default.order.count({
                where: {
                    paymentStatus: 'PAID',
                    createdAt: { gte: startOfMonth },
                },
            }),
        ]);
        return {
            totalRevenue: Number(totalRevenue._sum.total) || 0,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? Number(totalRevenue._sum.total) / totalOrders : 0,
            todayRevenue: Number(todayRevenue._sum.total) || 0,
            todayOrders,
            monthRevenue: Number(monthRevenue._sum.total) || 0,
            monthOrders,
        };
    },
    // Get pending orders for kitchen display
    async getPendingOrders() {
        const orders = await database_1.default.order.findMany({
            where: {
                status: {
                    in: ['PENDING', 'QUEUED', 'PREPARING', 'READY'],
                },
            },
            include: {
                user: true,
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return orders;
    },
};
//# sourceMappingURL=order.service.js.map