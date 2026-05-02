import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { z } from 'zod';

const router = Router();

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(15),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(4),
});

// POST /auth/send-otp
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { phone } = sendOtpSchema.parse(req.body);
    const result = await authService.sendOtp(phone);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid phone number' });
    }
    res.status(500).json({ success: false, error: error.message || 'Failed to send OTP' });
  }
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { phone, code } = verifyOtpSchema.parse(req.body);
    const result = await authService.verifyOtp(phone, code);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid input' });
    }
    res.status(400).json({ success: false, error: error.message || 'Invalid OTP' });
  }
});

export default router;
