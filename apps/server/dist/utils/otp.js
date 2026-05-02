"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.hashOTP = hashOTP;
exports.verifyOTP = verifyOTP;
exports.getOTPExpiration = getOTPExpiration;
const crypto_1 = __importDefault(require("crypto"));
// Generate 4-digit OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
// Hash OTP for storage
function hashOTP(otp) {
    return crypto_1.default.createHash('sha256').update(otp + process.env.OTP_SECRET).digest('hex');
}
// Verify OTP
function verifyOTP(otp, hashedOtp) {
    const hashed = hashOTP(otp);
    return hashed === hashedOtp;
}
// OTP expiration time (5 minutes)
function getOTPExpiration() {
    return new Date(Date.now() + 5 * 60 * 1000);
}
//# sourceMappingURL=otp.js.map