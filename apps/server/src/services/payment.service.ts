import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../config/database';
import { orderService } from './order.service';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const paymentService = {
  async createRazorpayOrder(userId: string, orderId: string) {
    // Verify order belongs to user
    const order = await prisma.order.findFirst({
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
    await prisma.payment.create({
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

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      throw new Error('Invalid payment signature');
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: { razorpayId: razorpayOrderId },
      data: {
        status: 'completed',
        method: 'upi',
      },
    });

    // Update order
    await orderService.updatePaymentStatus(payment.orderId, 'PAID', razorpayPaymentId);

    return { success: true, orderId: payment.orderId };
  },

  async handleWebhook(req: any, res: any) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body.toString();

    if (webhookSecret) {
      const expectedSignature = crypto
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

        const payment = await prisma.payment.findUnique({
          where: { razorpayId: razorpayOrderId },
        });

        if (payment && payment.status !== 'completed') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'completed',
              method: event.payload.payment.entity.method,
              webhookData: event,
            },
          });

          await orderService.updatePaymentStatus(payment.orderId, 'PAID', paymentId);
        }
        break;
      }

      case 'order.failed': {
        const razorpayOrderId = event.payload.order.entity.id;

        const payment = await prisma.payment.findUnique({
          where: { razorpayId: razorpayOrderId },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'failed',
              webhookData: event,
            },
          });

          await orderService.updatePaymentStatus(payment.orderId, 'FAILED');
        }
        break;
      }
    }

    res.json({ status: 'ok' });
  },
};

// Default export for webhook handler
export default async function webhookHandler(req: any, res: any) {
  return paymentService.handleWebhook(req, res);
}
