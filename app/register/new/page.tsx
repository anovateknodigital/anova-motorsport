'use client';

import { useState } from 'react';
import { sendOtpAction, verifyOtpAction } from '../actions';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Send, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterNewPage() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setAlreadyRegistered(false);
    setIsSending(true);

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('full_name', fullName);
    formData.append('team_name', teamName);
    formData.append('is_register', 'true');

    try {
      const result = await sendOtpAction(formData);
      
      if (result?.success) {
        setStep('otp');
        startCountdown();
      } else if ((result as any)?.isRegistered) {
        // Nomor sudah terdaftar, arahkan ke login
        setAlreadyRegistered(true);
        setError(result?.message || 'Nomor WhatsApp sudah terdaftar. Silakan login.');
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
    formData.append('full_name', fullName);
    formData.append('team_name', teamName);
    formData.append('is_register', 'true');

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

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setError(null);
    setIsSending(true);

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('full_name', fullName);
    formData.append('team_name', teamName);
    formData.append('is_register', 'true');

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
                  Daftar Manager Baru
                </span>
                <div className="h-[2px] w-8 bg-[#D32F2F]" />
              </div>
              <h1 className="font-teko text-4xl md:text-5xl font-bold uppercase italic text-white mb-2">
                REGISTRASI MANAGER
              </h1>
              <p className="text-zinc-400 text-sm">
                Isi data berikut untuk mendaftar sebagai manager team
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
              {step === 'form' ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="full_name" className="block text-white text-sm font-semibold mb-2">
                      Nama Manager <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  {/* Team Name */}
                  <div>
                    <label htmlFor="team_name" className="block text-white text-sm font-semibold mb-2">
                      Nama Team/Club <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="text"
                      id="team_name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                      placeholder="Masukkan nama team/club"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-white text-sm font-semibold mb-2">
                      Nomor WhatsApp Aktif <span className="text-[#D32F2F]">*</span>
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
                    <div className={`flex items-start gap-3 rounded-lg p-4 ${
                      alreadyRegistered 
                        ? 'bg-blue-500/10 border border-blue-500/20' 
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      {alreadyRegistered ? (
                        <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm ${alreadyRegistered ? 'text-blue-400' : 'text-red-400'}`}>
                          {error}
                        </p>
                        {alreadyRegistered && (
                          <Link
                            href={`/register/login?phone=${encodeURIComponent(phone)}`}
                            className="inline-flex items-center gap-2 mt-2 text-[#D32F2F] hover:text-[#B71C1C] text-sm font-semibold transition-colors"
                          >
                            Login di sini →
                          </Link>
                        )}
                      </div>
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
                        Verifikasi & Daftar
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
