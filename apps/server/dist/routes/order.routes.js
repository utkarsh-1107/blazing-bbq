"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_service_1 = require("../services/order.service");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
    deliveryAddress: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    couponCode: zod_1.z.string().optional(),
    customerName: zod_1.z.string().optional(),
    customerPhone: zod_1.z.string().optional(),
    orderType: zod_1.z.enum(['DELIVERY', 'PICKUP']).optional().default('DELIVERY'),
});
// POST /order - Create order from cart
router.post('/', async (req, res) => {
    try {
        const { deliveryAddress, notes, couponCode, customerName, customerPhone, orderType } = createOrderSchema.parse(req.body);
        const order = await order_service_1.orderService.createOrder(req.user.id, {
            deliveryAddress,
            notes,
            couponCode,
            customerName,
            customerPhone,
            orderType
        });
        res.json({ success: true, data: order });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, error: 'Invalid input' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
});
// GET /orders - Get user's orders
router.get('/', async (req, res) => {
    try {
        const orders = await order_service_1.orderService.getUserOrders(req.user.id);
        res.json({ success: true, data: orders });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /orders/:id - Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await order_service_1.orderService.getOrder(req.user.id, req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=order.routes.js.map