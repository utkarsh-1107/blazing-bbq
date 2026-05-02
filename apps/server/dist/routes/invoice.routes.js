"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_service_1 = require("../services/invoice.service");
const order_service_1 = require("../services/order.service");
const router = (0, express_1.Router)();
// GET /invoice/:orderId - Download invoice PDF
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        // Verify order belongs to user (or user is admin)
        const order = await order_service_1.orderService.getOrder(req.user.id, orderId);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        const pdfBuffer = await invoice_service_1.invoiceService.generateInvoice(orderId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error('Invoice generation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=invoice.routes.js.map