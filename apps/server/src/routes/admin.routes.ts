import { Router, Response } from 'express';
import { AuthRequest, requireAdmin } from '../middleware/auth.middleware';
import { orderService } from '../services/order.service';
import { whatsAppService } from '../utils/whatsapp';

const router = Router();

interface AdminOrderUpdate {
  status?: string;
  estimatedTime?: number;
  deliveryPartner?: {
    name: string;
    phone: string;
  };
  sendWhatsApp?: boolean;
}

// GET /admin/orders - Get all orders
router.get('/orders', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit, offset } = req.query;
    const orders = await orderService.getAdminOrders(
      status as string | undefined,
      Number(limit) || 50,
      Number(offset) || 0
    );
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /admin/orders/pending - Get pending orders for kitchen
router.get('/orders/pending', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderService.getPendingOrders();
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /admin/orders/:id - Get single order
router.get('/orders/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const order = await orderService.getAdminOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /admin/orders/:id - Update order status
router.patch('/orders/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, estimatedTime, deliveryPartner, sendWhatsApp } = req.body as AdminOrderUpdate;
    
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }
    
    const order = await orderService.updateOrderStatus(
      req.params.id, 
      status, 
      req.user.id,
      { estimatedTime, deliveryPartner }
    );
    
    // Send WhatsApp notification if requested
    if (sendWhatsApp && order.user?.phone) {
      const phone = order.customerPhone || order.user.phone;
      
      if (status === 'QUEUED' || status === 'CONFIRMED') {
        await whatsAppService.sendMessage({
          phone,
          template: 'order_confirmation',
          data: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
          }
        });
      } else if (status === 'READY') {
        await whatsAppService.sendMessage({
          phone,
          template: 'order_ready',
          data: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            eta: estimatedTime,
          }
        });
      } else if (status === 'OUT_FOR_DELIVERY') {
        await whatsAppService.sendMessage({
          phone,
          template: 'delivery_partner',
          data: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            deliveryPartnerName: deliveryPartner?.name || order.deliveryPartnerName,
            deliveryPartnerPhone: deliveryPartner?.phone || order.deliveryPartnerPhone,
            eta: estimatedTime,
          }
        });
      } else if (status === 'DELIVERED' || status === 'COMPLETED') {
        await whatsAppService.sendMessage({
          phone,
          template: 'order_delivered',
          data: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
          }
        });
      }
    }
    
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /admin/revenue - Get revenue stats
router.get('/revenue', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await orderService.getRevenueStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;