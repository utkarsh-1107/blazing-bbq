"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
exports.default = webhookHandler;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = __importDefault(require("../config/database"));
const order_service_1 = require("./order.service");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
exports.paymentService = {
    async createRazorpayOrder(userId, orderId) {
        // Verify order belongs to user
        const order = await database_1.default.order.findFirst({
            where: { id: orderId, userId },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.paymentStatus === 'PAID') {
            throw new Error('Order already paid');
        }
        const amount = Math.round(Number(order.total) * 100); // Razorpay uses paise
        const razorpayOrder = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `rcpt_${order.orderNumber}`,
            notes: {
                orderId: order.id,
                orderNumber: order.orderNumber,
            },
        });
        // Store Razorpay order ID
        await database_1.default.payment.create({
            data: {
                orderId: order.id,
                razorpayId: razorpayOrder.id,
                amount: order.total,
                currency: 'INR',
                status: 'pending',
            },
        });
        return {
            orderId: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount,
            currency: 'INR',
        };
    },
    async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        const body = `${razorpayOrderId}|${razorpayPaymentId}`;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body)
            .digest('hex');
        if (expectedSignature !== razorpaySignature) {
            throw new Error('Invalid payment signature');
        }
        // Update payment record
        const payment = await database_1.default.payment.update({
            where: { razorpayId: razorpayOrderId },
            data: {
                status: 'completed',
                method: 'upi',
            },
        });
        // Update order
        await order_service_1.orderService.updatePaymentStatus(payment.orderId, 'PAID', razorpayPaymentId);
        return { success: true, orderId: payment.orderId };
    },
    async handleWebhook(req, res) {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        // Verify webhook signature
        const signature = req.headers['x-razorpay-signature'];
        const body = req.body.toString();
        if (webhookSecret) {
            const expectedSignature = crypto_1.default
                .createHmac('sha256', webhookSecret)
                .update(body)
                .digest('hex');
            if (signature !== expectedSignature) {
                console.error('Invalid webhook signature');
                return res.status(400).json({ error: 'Invalid signature' });
            }
        }
        const event = JSON.parse(body);
        console.log('Webhook event:', event.event);
        switch (event.event) {
            case 'order.paid': {
                const razorpayOrderId = event.payload.order.entity.id;
                const paymentId = event.payload.payment.entity.id;
                const payment = await database_1.default.payment.findUnique({
                    where: { razorpayId: razorpayOrderId },
                });
                if (payment && payment.status !== 'completed') {
                    await database_1.default.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: 'completed',
                            method: event.payload.payment.entity.method,
                            webhookData: event,
                        },
                    });
                    await order_service_1.orderService.updatePaymentStatus(payment.orderId, 'PAID', paymentId);
                }
                break;
            }
            case 'order.failed': {
                const razorpayOrderId = event.payload.order.entity.id;
                const payment = await database_1.default.payment.findUnique({
                    where: { razorpayId: razorpayOrderId },
                });
                if (payment) {
                    await database_1.default.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: 'failed',
                            webhookData: event,
                        },
                    });
                    await order_service_1.orderService.updatePaymentStatus(payment.orderId, 'FAILED');
                }
                break;
            }
        }
        res.json({ status: 'ok' });
    },
};
// Default export for webhook handler
async function webhookHandler(req, res) {
    return exports.paymentService.handleWebhook(req, res);
}
//# sourceMappingURL=payment.service.js.map