"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const database_1 = __importDefault(require("../config/database"));
const otp_1 = require("../utils/otp");
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("../middleware/error.middleware");
exports.authService = {
    async sendOtp(phone) {
        // Normalize phone number
        const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        // Generate OTP
        const code = (0, otp_1.generateOTP)();
        const hashedCode = (0, otp_1.hashOTP)(code);
        const expiresAt = (0, otp_1.getOTPExpiration)();
        // Delete old OTPs for this phone
        await database_1.default.otp.deleteMany({
            where: { phone: normalizedPhone },
        });
        // Create new OTP
        await database_1.default.otp.create({
            data: {
                phone: normalizedPhone,
                code: hashedCode,
                expiresAt,
            },
        });
        // In production, send via WhatsApp Business API
        // For now, log the OTP (simulated)
        console.log(`[DEV] OTP for ${normalizedPhone}: ${code}`);
        return {
            success: true,
            message: 'OTP sent successfully',
            // Include OTP in response for development only
            ...(process.env.NODE_ENV === 'development' && { otp: code }),
        };
    },
    async verifyOtp(phone, code) {
        const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        // Find valid OTP
        const otp = await database_1.default.otp.findFirst({
            where: {
                phone: normalizedPhone,
                verified: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!otp) {
            throw new error_middleware_1.AppError('OTP expired or not found. Please request a new one.', 400);
        }
        // Verify OTP
        if (!(0, otp_1.verifyOTP)(code, otp.code)) {
            throw new error_middleware_1.AppError('Invalid OTP', 400);
        }
        // Mark OTP as verified
        await database_1.default.otp.update({
            where: { id: otp.id },
            data: { verified: true },
        });
        // Find or create user
        let user = await database_1.default.user.findUnique({
            where: { phone: normalizedPhone },
        });
        if (!user) {
            user = await database_1.default.user.create({
                data: {
                    phone: normalizedPhone,
                    role: 'CUSTOMER',
                },
            });
        }
        // Generate JWT
        const token = (0, jwt_1.generateToken)(user.id, user.role);
        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    phone: user.phone,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        };
    },
};
//# sourceMappingURL=auth.service.js.map