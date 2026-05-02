"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_service_1 = require("../services/payment.service");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
});
// POST /payment/create-order - Create Razorpay order
router.post('/create-order', async (req, res) => {
    try {
        const { orderId } = createOrderSchema.parse(req.body);
        const result = await payment_service_1.paymentService.createRazorpayOrder(req.user.id, orderId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, error: 'Invalid order ID' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
});
// POST /payment/verify - Verify payment (called from frontend after Razorpay success)
router.post('/verify', async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const result = await payment_service_1.paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map