"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const sendOtpSchema = zod_1.z.object({
    phone: zod_1.z.string().min(10).max(15),
});
const verifyOtpSchema = zod_1.z.object({
    phone: zod_1.z.string().min(10).max(15),
    code: zod_1.z.string().length(4),
});
// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { phone } = sendOtpSchema.parse(req.body);
        const result = await auth_service_1.authService.sendOtp(phone);
        res.json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, error: 'Invalid phone number' });
        }
        res.status(500).json({ success: false, error: error.message || 'Failed to send OTP' });
    }
});
// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, code } = verifyOtpSchema.parse(req.body);
        const result = await auth_service_1.authService.verifyOtp(phone, code);
        res.json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, error: 'Invalid input' });
        }
        res.status(400).json({ success: false, error: error.message || 'Invalid OTP' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map