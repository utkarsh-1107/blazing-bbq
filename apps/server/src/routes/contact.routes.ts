import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().max(255),
});

// POST /contact - Submit contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = contactSchema.parse(req.body);

    const { contactService } = await import('../services/contact.service');
    const result = await contactService.submit({ name, email, phone, message });

    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0].message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
