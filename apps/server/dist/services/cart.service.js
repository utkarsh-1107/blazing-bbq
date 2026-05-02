"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middleware/error.middleware");
exports.cartService = {
    async getCart(userId) {
        let cart = await database_1.default.cart.findUnique({
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
            cart = await database_1.default.cart.create({
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
        const subtotal = cart.items.reduce((sum, item) => sum + Number(item.menuItem.price) * item.quantity, 0);
        return {
            ...cart,
            subtotal,
        };
    },
    async addItem(userId, menuItemId, quantity, notes) {
        // Verify menu item exists
        const menuItem = await database_1.default.menuItem.findUnique({
            where: { id: menuItemId },
        });
        if (!menuItem) {
            throw new error_middleware_1.AppError('Menu item not found', 404);
        }
        if (!menuItem.isAvailable) {
            throw new error_middleware_1.AppError('Item is currently unavailable', 400);
        }
        // Get or create cart
        let cart = await database_1.default.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            cart = await database_1.default.cart.create({
                where: { userId },
            });
        }
        // Check if item already in cart
        const existingItem = await database_1.default.cartItem.findUnique({
            where: {
                cartId_menuItemId: {
                    cartId: cart.id,
                    menuItemId,
                },
            },
        });
        if (existingItem) {
            // Update quantity
            await database_1.default.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                    notes: notes || existingItem.notes,
                },
            });
        }
        else {
            // Add new item
            await database_1.default.cartItem.create({
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
    async updateItem(userId, cartItemId, quantity, notes) {
        // Get user's cart
        const cart = await database_1.default.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            throw new error_middleware_1.AppError('Cart not found', 404);
        }
        // Find cart item
        const cartItem = await database_1.default.cartItem.findFirst({
            where: {
                id: cartItemId,
                cartId: cart.id,
            },
        });
        if (!cartItem) {
            throw new error_middleware_1.AppError('Cart item not found', 404);
        }
        if (quantity <= 0) {
            // Remove item
            await database_1.default.cartItem.delete({
                where: { id: cartItemId },
            });
        }
        else {
            // Update quantity
            await database_1.default.cartItem.update({
                where: { id: cartItemId },
                data: { quantity, notes },
            });
        }
        return this.getCart(userId);
    },
    async removeItem(userId, cartItemId) {
        // Get user's cart
        const cart = await database_1.default.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            throw new error_middleware_1.AppError('Cart not found', 404);
        }
        await database_1.default.cartItem.deleteMany({
            where: {
                id: cartItemId,
                cartId: cart.id,
            },
        });
        return this.getCart(userId);
    },
    async applyCoupon(userId, code) {
        const cart = await this.getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new error_middleware_1.AppError('Cart is empty', 400);
        }
        // Find coupon
        const coupon = await database_1.default.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!coupon) {
            throw new error_middleware_1.AppError('Invalid coupon code', 400);
        }
        if (!coupon.isActive) {
            throw new error_middleware_1.AppError('Coupon is no longer active', 400);
        }
        if (new Date() < coupon.startsAt || new Date() > coupon.expiresAt) {
            throw new error_middleware_1.AppError('Coupon has expired', 400);
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new error_middleware_1.AppError('Coupon usage limit reached', 400);
        }
        if (cart.subtotal < Number(coupon.minOrderValue)) {
            throw new error_middleware_1.AppError(`Minimum order value is Rs. ${coupon.minOrderValue}`, 400);
        }
        return {
            ...cart,
            coupon,
        };
    },
    async clearCart(userId) {
        const cart = await database_1.default.cart.findUnique({
            where: { userId },
        });
        if (cart) {
            await database_1.default.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }
        return this.getCart(userId);
    },
};
//# sourceMappingURL=cart.service.js.map