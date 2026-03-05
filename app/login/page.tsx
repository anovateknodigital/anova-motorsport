"use client";

import { loginAction } from "./actions";
import Image from "next/image";
import { useState, useEffect, useActionState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, null);

  // Shake animation on error
  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (state?.error) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [state]);

  const isLockout = state?.error?.includes("menit");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#09090b]">
      {/* ── Left Panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1625930545875-b6b0089df67d?q=80&w=1600&auto=format&fit=crop"
            alt="Racing"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-[#D32F2F]/30" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#D32F2F] to-transparent" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="bg-white rounded-xl px-4 py-2 inline-block">
            <Image
              src="/anova-motorsport-logo.png"
              alt="Anova Motorsport"
              width={200}
              height={60}
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <p className="text-[#D32F2F] font-bold uppercase tracking-[0.3em] text-xs">
            Admin Dashboard
          </p>
          <h1 className="font-teko text-6xl xl:text-7xl font-bold text-white uppercase italic leading-[0.9]">
            Kelola Event
            <br />
            <span className="text-[#D32F2F]">Balap</span> dengan
            <br />
            Lebih Mudah
          </h1>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <ShieldCheck size={18} className="text-[#D32F2F] shrink-0" />
            <p className="text-zinc-300 text-sm">
              Akses terbatas. Dilindungi sistem keamanan berlapis.
            </p>
          </div>
        </div>

        <p className="relative z-10 text-zinc-600 text-xs">
          © 2026 Anova Motorsport — ANOVA TEKNO DIGITAL
        </p>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-[#09090b] relative">
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/black-linen.png")',
          }}
        />
        {/* Mobile top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent lg:hidden" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex justify-center mb-10 lg:hidden">
            <div className="bg-white rounded-xl px-4 py-2">
              <Image
                src="/anova-motorsport-logo.png"
                alt="Anova Motorsport"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D32F2F]/10 border border-[#D32F2F]/20 text-[#D32F2F] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] animate-pulse" />
            Admin Panel
          </div>

          <h2 className="font-teko text-4xl sm:text-5xl font-bold text-white uppercase italic mb-2">
            Masuk ke Dashboard
          </h2>
          <p className="text-zinc-500 text-sm mb-8">
            Masukkan password admin untuk melanjutkan.
          </p>

          {/* Error bubble */}
          {state?.error && (
            <div
              className={`
                mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5
                transition-all duration-300
                ${shake ? "translate-x-0 animate-pulse" : ""}
                ${isLockout
                  ? "bg-orange-950/30 border border-orange-700/40 text-orange-400"
                  : "bg-red-950/30 border border-red-700/40 text-red-400"
                }
              `}
              style={shake ? { animation: "shake 0.4s ease" } : {}}
            >
              <Lock size={14} className="shrink-0" />
              {state.error}
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-4">
            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#D32F2F] transition-colors"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  autoFocus
                  required
                  disabled={isPending || isLockout}
                  placeholder="••••••••"
                  className="
                    w-full bg-zinc-900 border border-zinc-800
                    focus:border-[#D32F2F]/60 focus:ring-1 focus:ring-[#D32F2F]/20
                    text-zinc-100 text-sm rounded-xl
                    pl-10 pr-11 py-3.5
                    placeholder:text-zinc-700
                    focus:outline-none transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={isPending || isLockout}
              className="
                w-full bg-[#D32F2F] hover:bg-[#B71C1C]
                disabled:bg-zinc-800 disabled:text-zinc-500
                text-white font-bold py-3.5 px-6 rounded-xl text-sm
                transition-all duration-200
                shadow-[0_4px_24px_rgba(211,47,47,0.15)]
                hover:shadow-[0_4px_32px_rgba(211,47,47,0.3)]
                hover:scale-[1.01] active:scale-[0.99]
                disabled:scale-100 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : isLockout ? (
                <>
                  <ShieldCheck size={14} />
                  Akses Dikunci Sementara
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Bottom */}
          <div className="mt-10 text-center">
            <a
              href="/"
              className="text-zinc-700 hover:text-zinc-400 text-xs transition-colors"
            >
              ← Kembali ke Website Utama
            </a>
          </div>
        </div>
      </div>

      {/* Shake keyframe */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
