// WhatsApp Business API integration utilities

export interface WhatsAppMessageParams {
  phone: string;
  template: 'order_confirmation' | 'order_ready' | 'delivery_partner' | 'order_delivered' | 'custom';
  data?: {
    orderId?: string;
    orderNumber?: string;
    customerName?: string;
    deliveryPartnerName?: string;
    deliveryPartnerPhone?: string;
    eta?: number;
    message?: string;
  };
}

const WHATSAPP_BUSINESS_NUMBER = process.env.WHATSAPP_BUSINESS_NUMBER || '';

export const whatsAppService = {
  formatPhoneForWhatsApp(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) {
      return digits;
    }
    if (digits.length === 10) {
      return `91${digits}`;
    }
    return digits;
  },

  getWhatsAppDeepLink(phone: string, message?: string): string {
    const formattedPhone = this.formatPhoneForWhatsApp(phone);
    const encodedMessage = message ? encodeURIComponent(message) : '';
    if (message) {
      return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    }
    return `https://wa.me/${formattedPhone}`;
  },

  getOrderTrackingLink(orderId: string): string {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return `${baseUrl}/orders/${orderId}`;
  },

  getDeliveryPartnerContactLink(orderId: string, deliveryPartnerName: string, deliveryPartnerPhone: string): string {
    const message = `Hi ${deliveryPartnerName}, I have an order from Blazing Barbecue. Order ID: ${orderId}. Please reach out when you're nearby.`;
    return this.getWhatsAppDeepLink(deliveryPartnerPhone, message);
  },

  generateOrderConfirmationMessage(order: {
    orderNumber: string;
    customerName?: string;
    total: number;
    orderType: string;
  }): string {
    const orderType = order.orderType === 'DELIVERY' ? 'Delivery' : 'Pickup';
    return `Blazing Barbecue - Order Confirmed!

Hi ${order.customerName || 'Customer'},

Your order ${order.orderNumber} has been confirmed!

Order Type: ${orderType}
Total: Rs. ${Number(order.total).toFixed(2)}

Track your order: ${this.getOrderTrackingLink(order.orderNumber)}

Thank you for choosing Blazing Barbecue!`;
  },

  generateOrderReadyMessage(order: {
    orderNumber: string;
    customerName?: string;
    orderType: string;
    estimatedTime?: number;
  }): string {
    const etaText = order.estimatedTime ? `in ${order.estimatedTime} minutes` : 'shortly';
    const pickupText = order.orderType === 'PICKUP' 
      ? 'Please visit our outlet to collect your order.' 
      : 'Our delivery partner will reach you soon.';

    return `Blazing Barbecue - Order Ready!

Hi ${order.customerName || 'Customer'},

Great news! Your order ${order.orderNumber} will be ready ${etaText}!

${pickupText}

Track your order: ${this.getOrderTrackingLink(order.orderNumber)}`;
  },

  generateOutForDeliveryMessage(order: {
    orderNumber: string;
    customerName?: string;
    deliveryPartnerName: string;
    deliveryPartnerPhone: string;
    estimatedTime?: number;
  }): string {
    const etaText = order.estimatedTime ? `ETA: ${order.estimatedTime} minutes` : 'Arriving soon!';

    return `Blazing Barbecue - Out for Delivery!

Hi ${order.customerName || 'Customer'},

Your order ${order.orderNumber} is on the way!

Delivery Partner: ${order.deliveryPartnerName}
${etaText}

Track your order: ${this.getOrderTrackingLink(order.orderNumber)}`;
  },

  generateOrderDeliveredMessage(order: {
    orderNumber: string;
    customerName?: string;
  }): string {
    return `Blazing Barbecue - Order Delivered!

Hi ${order.customerName || 'Customer'},

Your order ${order.orderNumber} has been delivered!

We hope you enjoy your meal!

Thank you for ordering with Blazing Barbecue!`;
  },

  buildMessage(params: WhatsAppMessageParams): string | null {
    switch (params.template) {
      case 'order_confirmation':
        return this.generateOrderConfirmationMessage({
          orderNumber: params.data?.orderNumber || '',
          customerName: params.data?.customerName,
          total: Number(params.data?.orderId) || 0,
          orderType: 'DELIVERY',
        });
      case 'order_ready':
        return this.generateOrderReadyMessage({
          orderNumber: params.data?.orderNumber || '',
          customerName: params.data?.customerName,
          orderType: 'DELIVERY',
          estimatedTime: params.data?.eta,
        });
      case 'delivery_partner':
        return this.generateOutForDeliveryMessage({
          orderNumber: params.data?.orderNumber || '',
          customerName: params.data?.customerName,
          deliveryPartnerName: params.data?.deliveryPartnerName || 'Our delivery partner',
          deliveryPartnerPhone: params.data?.deliveryPartnerPhone || '',
          estimatedTime: params.data?.eta,
        });
      case 'order_delivered':
        return this.generateOrderDeliveredMessage({
          orderNumber: params.data?.orderNumber || '',
          customerName: params.data?.customerName,
        });
      case 'custom':
        return params.data?.message || null;
      default:
        return null;
    }
  },

  async sendMessage(params: WhatsAppMessageParams): Promise<{ success: boolean; message?: string }> {
    const phone = this.formatPhoneForWhatsApp(params.phone);
    const message = this.buildMessage(params);

    if (!message) {
      return { success: false, message: 'Invalid message template' };
    }

    console.log(`[WhatsApp] Sending to ${phone}:`);
    console.log(message);

    return { success: true, message };
  },
};