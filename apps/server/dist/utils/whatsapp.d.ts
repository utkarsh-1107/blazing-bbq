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
export declare const whatsAppService: {
    formatPhoneForWhatsApp(phone: string): string;
    getWhatsAppDeepLink(phone: string, message?: string): string;
    getOrderTrackingLink(orderId: string): string;
    getDeliveryPartnerContactLink(orderId: string, deliveryPartnerName: string, deliveryPartnerPhone: string): string;
    generateOrderConfirmationMessage(order: {
        orderNumber: string;
        customerName?: string;
        total: number;
        orderType: string;
    }): string;
    generateOrderReadyMessage(order: {
        orderNumber: string;
        customerName?: string;
        orderType: string;
        estimatedTime?: number;
    }): string;
    generateOutForDeliveryMessage(order: {
        orderNumber: string;
        customerName?: string;
        deliveryPartnerName: string;
        deliveryPartnerPhone: string;
        estimatedTime?: number;
    }): string;
    generateOrderDeliveredMessage(order: {
        orderNumber: string;
        customerName?: string;
    }): string;
    buildMessage(params: WhatsAppMessageParams): string | null;
    sendMessage(params: WhatsAppMessageParams): Promise<{
        success: boolean;
        message?: string;
    }>;
};
//# sourceMappingURL=whatsapp.d.ts.map