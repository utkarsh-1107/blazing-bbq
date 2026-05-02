"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const order_service_1 = require("../services/order.service");
const whatsapp_1 = require("../utils/whatsapp");
const router = (0, express_1.Router)();
// GET /admin/orders - Get all orders
router.get('/orders', auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const { status, limit, offset } = req.query;
        const orders = await order_service_1.orderService.getAdminOrders(status, Number(limit) || 50, Number(offset) || 0);
        res.json({ success: true, data: orders });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /admin/orders/pending - Get pending orders for kitchen
router.get('/orders/pending', auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const orders = await order_service_1.orderService.getPendingOrders();
        res.json({ success: true, data: orders });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /admin/orders/:id - Get single order
router.get('/orders/:id', auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const order = await order_service_1.orderService.getAdminOrder(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// PATCH /admin/orders/:id - Update order status
router.patch('/orders/:id', auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const { status, estimatedTime, deliveryPartner, sendWhatsApp } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, error: 'Status is required' });
        }
        const order = await order_service_1.orderService.updateOrderStatus(req.params.id, status, req.user.id, { estimatedTime, deliveryPartner });
        // Send WhatsApp notification if requested
        if (sendWhatsApp && order.user?.phone) {
            const phone = order.customerPhone || order.user.phone;
            if (status === 'QUEUED' || status === 'CONFIRMED') {
                await whatsapp_1.whatsAppService.sendMessage({
                    phone,
                    template: 'order_confirmation',
                    data: {
                        orderNumber: order.orderNumber,
                        customerName: order.customerName,
                    }
                });
            }
            else if (status === 'READY') {
                await whatsapp_1.whatsAppService.sendMessage({
                    phone,
                    template: 'order_ready',
                    data: {
                        orderNumber: order.orderNumber,
                        customerName: order.customerName,
                        eta: estimatedTime,
                    }
                });
            }
            else if (status === 'OUT_FOR_DELIVERY') {
                await whatsapp_1.whatsAppService.sendMessage({
                    phone,
                    template: 'delivery_partner',
                    data: {
                        orderNumber: order.orderNumber,
                        customerName: order.customerName,
                        deliveryPartnerName: deliveryPartner?.name || order.deliveryPartnerName,
                        deliveryPartnerPhone: deliveryPartner?.phone || order.deliveryPartnerPhone,
                        eta: estimatedTime,
                    }
                });
            }
            else if (status === 'DELIVERED' || status === 'COMPLETED') {
                await whatsapp_1.whatsAppService.sendMessage({
                    phone,
                    template: 'order_delivered',
                    data: {
                        orderNumber: order.orderNumber,
                        customerName: order.customerName,
                    }
                });
            }
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
// GET /admin/revenue - Get revenue stats
router.get('/revenue', auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const stats = await order_service_1.orderService.getRevenueStats();
        res.json({ success: true, data: stats });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map