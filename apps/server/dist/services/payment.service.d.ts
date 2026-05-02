export declare const paymentService: {
    createRazorpayOrder(userId: string, orderId: string): Promise<{
        orderId: string;
        razorpayOrderId: string;
        amount: number;
        currency: string;
    }>;
    verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        success: boolean;
        orderId: string;
    }>;
    handleWebhook(req: any, res: any): Promise<any>;
};
export default function webhookHandler(req: any, res: any): Promise<any>;
//# sourceMappingURL=payment.service.d.ts.map