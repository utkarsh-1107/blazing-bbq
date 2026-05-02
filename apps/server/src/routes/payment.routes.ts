import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { paymentService } from '../services/payment.service';
import { z } from 'zod';

const router = Router();

const createOrderSchema = z.object({
  orderId: z.string().uuid(),
});

// POST /payment/create-order - Create Razorpay order
router.post('/create-order', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = createOrderSchema.parse(req.body);
    const result = await paymentService.createRazorpayOrder(req.user.id, orderId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid order ID' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /payment/verify - Verify payment (called from frontend after Razorpay success)
router.post('/verify', async (req: AuthRequest, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const result = await paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
