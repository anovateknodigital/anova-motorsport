'use client';

import { useState, useEffect, Suspense } from 'react';
import { sendOtpAction, verifyOtpAction } from '../actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Send, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const phoneFromUrl = searchParams.get('phone') || '';
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState(phoneFromUrl);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update phone if URL param changes
  useEffect(() => {
    if (phoneFromUrl) {
      setPhone(phoneFromUrl);
    }
  }, [phoneFromUrl]);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSending(true);

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('is_register', 'false');

    try {
      const result = await sendOtpAction(formData);
      
      if (result?.success) {
        setStep('otp');
        startCountdown();
      } else {
        setError(result?.message || 'Gagal mengirim OTP');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim OTP');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('otp_code', otpCode);
    formData.append('is_register', 'false');

    try {
      const result = await verifyOtpAction(formData);

      // If we get here, it means the action returned without redirecting
      // Check if it was successful
      if (result && !result.success) {
        setError(result.message || 'Verifikasi gagal');
        setIsVerifying(false);
      }
      // If result.success is true but no redirect happened, something is wrong
      else if (result && result.success) {
        setError('Verifikasi berhasil tetapi tidak dapat redirect');
        setIsVerifying(false);
      }
    } catch (err: any) {
      // In Next.js 16, redirect errors might not have the expected structure
      // Just check if it looks like a redirect error by checking various properties
      const isRedirectError = 
        err?.digest?.includes?.('NEXT_REDIRECT') ||
        err?.message?.includes?.('NEXT_REDIRECT') ||
        err?.name === 'NEXT_REDIRECT' ||
        // If the error message mentions redirect, it's probably a redirect
        err?.message?.includes?.('redirect') ||
        // Or if there's no message and no result, it's probably a redirect
        (!err?.message && !err?.digest);
      
      if (isRedirectError) {
        // This is a redirect error, let Next.js handle it
        return;
      }
      
      // It's a real error, show it to the user
      setError('Terjadi kesalahan saat verifikasi');
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setError(null);
    setIsSending(true);

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('is_register', 'false');

    try {
      const result = await sendOtpAction(formData);
      if (result?.success) {
        startCountdown();
      } else {
        setError(result?.message || 'Gagal mengirim ulang OTP');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim ulang OTP');
    } finally {
      setIsSending(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <div className="w-full bg-zinc-950 border-b border-zinc-800 py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Link href="/register" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
              <ArrowLeft size={16} />
              Kembali
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg">
            {/* Hero */}
            <div className="text-center mb-8">
              <div className="flex items-center gap-3 justify-center mb-4">
                <div className="h-[2px] w-8 bg-[#D32F2F]" />
                <span className="text-[#D32F2F] text-xs font-bold uppercase tracking-widest">
                  Manager Login
                </span>
                <div className="h-[2px] w-8 bg-[#D32F2F]" />
              </div>
              <h1 className="font-teko text-4xl md:text-5xl font-bold uppercase italic text-white mb-2">
                LOGIN MANAGER
              </h1>
              <p className="text-zinc-400 text-sm">
                Login menggunakan nomor WhatsApp yang sudah terdaftar
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
              {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-white text-sm font-semibold mb-2">
                      Nomor WhatsApp <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                      placeholder="Contoh: 08123456789"
                    />
                    <p className="text-zinc-500 text-xs mt-1">
                      Format: 08xx atau 62xxx
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Kirim OTP
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  {/* OTP Info */}
                  <div className="bg-[#D32F2F]/10 border border-[#D32F2F]/20 rounded-lg p-4 mb-5">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={20} className="text-[#D32F2F] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-sm font-semibold mb-1">
                          Kode OTP telah dikirim
                        </p>
                        <p className="text-zinc-400 text-xs">
                          Masukkan kode 5 digit yang dikirim ke WhatsApp {phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label htmlFor="otp_code" className="block text-white text-sm font-semibold mb-2">
                      Kode OTP <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="text"
                      id="otp_code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      required
                      maxLength={5}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors text-center text-2xl tracking-[0.5em] font-mono"
                      placeholder="00000"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isVerifying || otpCode.length !== 5}
                    className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Login
                      </>
                    )}
                  </button>

                  {/* Resend OTP */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-zinc-500 text-sm">
                        Kirim ulang kode dalam <span className="text-[#D32F2F] font-semibold">{countdown}</span> detik
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#D32F2F] hover:text-[#B71C1C] text-sm font-semibold transition-colors"
                      >
                        Kirim Ulang Kode OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-950 border-t border-zinc-800 py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <p className="text-zinc-500 text-sm">
              © 2026 Anova Motorsport. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D32F2F]/30 border-t-[#D32F2F] rounded-full animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
