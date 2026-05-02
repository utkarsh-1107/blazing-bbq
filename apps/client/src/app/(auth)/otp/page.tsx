'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { ArrowLeft, Loader2, RotateCcw } from 'lucide-react';

export default function OtpPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const phone = typeof window !== 'undefined' ? sessionStorage.getItem('loginPhone') : '';

  useEffect(() => {
    if (!phone) {
      router.push('/login');
      return;
    }
    // Focus first input
    inputRefs.current[0]?.focus();
    
    // Resend timer
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [phone]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all filled
    if (newOtp.every(digit => digit) && newOtp.join('').length === 4) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 4) newOtp[i] = char;
    });
    setOtp(newOtp);
    if (pastedData.length === 4) {
      handleVerifyOtp(pastedData);
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('');
    
    if (codeToVerify.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.verifyOtp(phone!, codeToVerify);
      
      if (response.success) {
        setUser(response.data.user, response.data.token);
        sessionStorage.removeItem('loginPhone');
        router.push('/menu');
      } else {
        setError('Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    try {
      await api.sendOtp(phone!);
      setResendTimer(30);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Back Button */}
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* OTP Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verify OTP</h1>
            <p className="text-gray-500 text-sm">
              Enter the 4-digit code sent to
              <span className="font-medium text-gray-900"> +91 {phone}</span>
            </p>
          </div>

          {/* OTP Inputs */}
          <div 
            className="flex justify-center gap-3 mb-6"
            onPaste={handlePaste}
          >
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-16 text-center text-2xl font-bold border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            onClick={() => handleVerifyOtp()}
            disabled={loading || otp.join('').length !== 4}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Verify OTP'
            )}
          </button>

          {/* Resend */}
          <div className="mt-6 text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in <span className="font-medium text-gray-900">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Resend OTP
              </button>
            )}
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg text-center">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-primary">Demo Mode:</span> Check the server console for the OTP code
          </p>
        </div>
      </div>
    </div>
  );
}
