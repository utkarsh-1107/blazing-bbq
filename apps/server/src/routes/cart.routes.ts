import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { cartService } from '../services/cart.service';
import { z } from 'zod';

const router = Router();

const addItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1),
  notes: z.string().optional(),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0),
  notes: z.string().optional(),
});

const applyCouponSchema = z.object({
  code: z.string().min(1),
});

// GET /cart - Get user's cart
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /cart/items - Add item to cart
router.post('/items', async (req: AuthRequest, res: Response) => {
  try {
    const { menuItemId, quantity, notes } = addItemSchema.parse(req.body);
    const cart = await cartService.addItem(req.user.id, menuItemId, quantity, notes);
    res.json({ success: true, data: cart });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid input' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH /cart/items/:id - Update cart item
router.patch('/items/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { quantity, notes } = updateItemSchema.parse(req.body);
    const cart = await cartService.updateItem(req.user.id, req.params.id, quantity, notes);
    res.json({ success: true, data: cart });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid input' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /cart/items/:id - Remove item from cart
router.delete('/items/:id', async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.id);
    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /cart/apply-coupon - Apply coupon
router.post('/apply-coupon', async (req: AuthRequest, res: Response) => {
  try {
    const { code } = applyCouponSchema.parse(req.body);
    const cart = await cartService.applyCoupon(req.user.id, code);
    res.json({ success: true, data: cart });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid coupon code' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /cart - Clear cart
router.delete('/', async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
