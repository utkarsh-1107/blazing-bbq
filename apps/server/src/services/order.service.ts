import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { emitNewOrder, emitOrderStatusUpdate, emitOrderCompleted } from '../config/socket';
import { cartService } from './cart.service';

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

interface UpdateOrderParams {
  status?: string;
  estimatedTime?: number;
  deliveryPartner?: DeliveryPartner;
}

export const orderService = {
  async createOrder(userId: string, params: CreateOrderParams) {
    const { deliveryAddress, notes, couponCode, customerName, customerPhone, orderType = 'DELIVERY' } = params;

    // Get user's cart
    const cart = await cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `BBQ-${new Date().getFullYear()}-${String(orderCount + 1).padStart(5, '0')}`;

    // Calculate totals
    const subtotal = cart.subtotal;
    const gst = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
    const deliveryFee = orderType === 'DELIVERY' ? 50 : 0;
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = Math.min(
            Number(coupon.discountValue) / 100 * subtotal,
            Number(coupon.maxDiscount) || Infinity
          );
        } else {
          discount = Number(coupon.discountValue);
        }

        // Increment coupon usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const total = subtotal + gst + deliveryFee - discount;

    // Get user for customer info
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Create order
    const order = await prisma.order.create({
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
    await cartService.clearCart(userId);

    // Emit to admin
    emitNewOrder(order);

    return order;
  },

  async getOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
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

  async getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
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

  async getAdminOrders(status?: string, limit = 50, offset = 0) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
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
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  },

  async getAdminOrder(orderId: string) {
    const order = await prisma.order.findUnique({
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

  async updateOrderStatus(
    orderId: string, 
    status: string, 
    adminId: string,
    params?: { estimatedTime?: number; deliveryPartner?: DeliveryPartner }
  ) {
    const updateData: any = {
      status: status as any,
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

    const order = await prisma.order.update({
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
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'UPDATE_STATUS',
        entity: 'ORDER',
        entityId: orderId,
        newValue: { status, estimatedTime: params?.estimatedTime, deliveryPartner: params?.deliveryPartner },
      },
    });

    // Emit to customer with additional data
    emitOrderStatusUpdate(orderId, status, params?.estimatedTime, params?.deliveryPartner);

    if (status === 'COMPLETED' || status === 'DELIVERED') {
      emitOrderCompleted(order);
    }

    return order;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: string, paymentId?: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentStatus as any,
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

    const [
      totalRevenue,
      totalOrders,
      todayRevenue,
      todayOrders,
      monthRevenue,
      monthOrders,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { paymentStatus: 'PAID' } }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startOfDay },
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startOfDay },
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),
      prisma.order.count({
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
    const orders = await prisma.order.findMany({
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
