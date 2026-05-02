"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_service_1 = require("../services/cart.service");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const addItemSchema = zod_1.z.object({
    menuItemId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().min(1),
    notes: zod_1.z.string().optional(),
});
const updateItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(0),
    notes: zod_1.z.string().optional(),
});
const applyCouponSchema = zod_1.z.object({
    code: zod_1.z.string().min(1),
});
// GET /cart - Get user's cart
router.get('/', async (req, res) => {
    try {
        const cart = await cart_service_1.cartService.getCart(req.user.id);
        res.json({ success: true, data: cart });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// POST /cart/items - Add item to cart
router.post('/items', async (req, res) => {
    try {
        const { menuItemId, quantity, notes } = addItemSchema.parse(req.body);
        const cart = await cart_service_1.cartService.addItem(req.user.id, menuItemId, quantity, notes);
        res.json({ success: true, data: cart });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, error: 'Invalid input' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
});
// PATCH /cart/items/:id - Update cart item
router.patch('/items/:id', async (req, res) => {
    try {
        const { quantity, notes } = updateItemSchema.parse(req.body);
        const cart = await cart_service_1.cartService.updateItem(req.user.id, req.params.id, quantity, notes);
        res.json({ success: true, data: cart });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, error: 'Invalid input' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
});
// DELETE /cart/items/:id - Remove item from cart
router.delete('/items/:id', async (req, res) => {
    try {
        const cart = await cart_service_1.cartService.removeItem(req.user.id, req.params.id);
        res.json({ success: true, data: cart });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
// POST /cart/apply-coupon - Apply coupon
router.post('/apply-coupon', async (req, res) => {
    try {
        const { code } = applyCouponSchema.parse(req.body);
        const cart = await cart_service_1.cartService.applyCoupon(req.user.id, code);
        res.json({ success: true, data: cart });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, error: 'Invalid coupon code' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
});
// DELETE /cart - Clear cart
router.delete('/', async (req, res) => {
    try {
        const cart = await cart_service_1.cartService.clearCart(req.user.id);
        res.json({ success: true, data: cart });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=cart.routes.js.map