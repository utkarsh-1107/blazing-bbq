import prisma from '../config/database';
import { generateOTP, hashOTP, verifyOTP, getOTPExpiration } from '../utils/otp';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';

export const authService = {
  async sendOtp(phone: string) {
    // Normalize phone number
    const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    // Generate OTP
    const code = generateOTP();
    const hashedCode = hashOTP(code);
    const expiresAt = getOTPExpiration();

    // Delete old OTPs for this phone
    await prisma.otp.deleteMany({
      where: { phone: normalizedPhone },
    });

    // Create new OTP
    await prisma.otp.create({
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

  async verifyOtp(phone: string, code: string) {
    const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    // Find valid OTP
    const otp = await prisma.otp.findFirst({
      where: {
        phone: normalizedPhone,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new AppError('OTP expired or not found. Please request a new one.', 400);
    }

    // Verify OTP
    if (!verifyOTP(code, otp.code)) {
      throw new AppError('Invalid OTP', 400);
    }

    // Mark OTP as verified
    await prisma.otp.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          role: 'CUSTOMER',
        },
      });
    }

    // Generate JWT
    const token = generateToken(user.id, user.role);

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
