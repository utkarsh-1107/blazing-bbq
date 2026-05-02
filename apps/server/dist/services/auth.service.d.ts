export declare const authService: {
    sendOtp(phone: string): Promise<{
        otp?: string | undefined;
        success: boolean;
        message: string;
    }>;
    verifyOtp(phone: string, code: string): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                phone: string;
                name: string | null;
                email: string | null;
                role: string;
            };
            token: string;
        };
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map