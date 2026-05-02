import crypto from 'crypto';

// Generate 4-digit OTP
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Hash OTP for storage
export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp + process.env.OTP_SECRET).digest('hex');
}

// Verify OTP
export function verifyOTP(otp: string, hashedOtp: string): boolean {
  const hashed = hashOTP(otp);
  return hashed === hashedOtp;
}

// OTP expiration time (5 minutes)
export function getOTPExpiration(): Date {
  return new Date(Date.now() + 5 * 60 * 1000);
}
