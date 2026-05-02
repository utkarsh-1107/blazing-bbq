import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { Decimal } from '@prisma/client/runtime/library';

interface CartItemData {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

export const cartService = {
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: {
              include: { category: true },
            },
          },
        },
      },
    });

    // Create cart if doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        where: { userId },
        include: {
          items: {
            include: {
              menuItem: {
                include: { category: true },
              },
            },
          },
        },
      });
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.menuItem.price) * item.quantity,
      0
    );

    return {
      ...cart,
      subtotal,
    };
  },

  async addItem(userId: string, menuItemId: string, quantity: number, notes?: string) {
    // Verify menu item exists
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      throw new AppError('Menu item not found', 404);
    }

    if (!menuItem.isAvailable) {
      throw new AppError('Item is currently unavailable', 400);
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        where: { userId },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_menuItemId: {
          cartId: cart.id,
          menuItemId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          notes: notes || existingItem.notes,
        },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId,
          quantity,
          notes,
        },
      });
    }

    return this.getCart(userId);
  },

  async updateItem(userId: string, cartItemId: string, quantity: number, notes?: string) {
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    // Find cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    if (quantity <= 0) {
      // Remove item
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity, notes },
      });
    }

    return this.getCart(userId);
  },

  async removeItem(userId: string, cartItemId: string) {
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    await prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    return this.getCart(userId);
  },

  async applyCoupon(userId: string, code: string) {
    const cart = await this.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new AppError('Invalid coupon code', 400);
    }

    if (!coupon.isActive) {
      throw new AppError('Coupon is no longer active', 400);
    }

    if (new Date() < coupon.startsAt || new Date() > coupon.expiresAt) {
      throw new AppError('Coupon has expired', 400);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError('Coupon usage limit reached', 400);
    }

    if (cart.subtotal < Number(coupon.minOrderValue)) {
      throw new AppError(`Minimum order value is Rs. ${coupon.minOrderValue}`, 400);
    }

    return {
      ...cart,
      coupon,
    };
  },

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getCart(userId);
  },
};
