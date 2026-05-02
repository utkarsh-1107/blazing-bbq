import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { invoiceService } from '../services/invoice.service';
import { orderService } from '../services/order.service';

const router = Router();

// GET /invoice/:orderId - Download invoice PDF
router.get('/:orderId', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    // Verify order belongs to user (or user is admin)
    const order = await orderService.getOrder(req.user.id, orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const pdfBuffer = await invoiceService.generateInvoice(orderId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
