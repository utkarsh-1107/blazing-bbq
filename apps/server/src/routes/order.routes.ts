import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { orderService } from '../services/order.service';
import { z } from 'zod';

const router = Router();

const createOrderSchema = z.object({
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  orderType: z.enum(['DELIVERY', 'PICKUP']).optional().default('DELIVERY'),
});

// POST /order - Create order from cart
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { deliveryAddress, notes, couponCode, customerName, customerPhone, orderType } = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(req.user.id, { 
      deliveryAddress, 
      notes, 
      couponCode,
      customerName,
      customerPhone,
      orderType 
    });
    res.json({ success: true, data: order });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid input' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /orders - Get user's orders
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /orders/:id - Get single order
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const order = await orderService.getOrder(req.user.id, req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;