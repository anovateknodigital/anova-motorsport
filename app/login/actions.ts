"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "admin@anovamotorsport.com";

// ── Rate Limiting Config ──────────────────────────────────────────
const MAX_ATTEMPTS = 5;           // max percobaan gagal sebelum lockout
const WINDOW_MS = 10 * 60 * 1000; // window tracking: 10 menit
const LOCKOUT_MS = 15 * 60 * 1000; // durasi lockout: 15 menit

interface AttemptRecord {
    count: number;
    firstAttempt: number;
    lockedUntil?: number;
}

// In-memory store per IP — cukup untuk single-instance server.
// Untuk multi-instance/edge, ganti dengan Upstash Redis.
const attemptStore = new Map<string, AttemptRecord>();

function getClientIP(h: Awaited<ReturnType<typeof headers>>): string {
    return (
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        h.get("x-real-ip") ??
        "unknown"
    );
}

function checkRateLimit(ip: string): { allowed: boolean; remainingMs?: number } {
    const now = Date.now();
    const rec = attemptStore.get(ip);

    if (!rec) return { allowed: true };

    // Masih dalam masa lockout?
    if (rec.lockedUntil && now < rec.lockedUntil) {
        return { allowed: false, remainingMs: rec.lockedUntil - now };
    }

    // Window tracking sudah kedaluwarsa → reset
    if (now - rec.firstAttempt > WINDOW_MS) {
        attemptStore.delete(ip);
        return { allowed: true };
    }

    // Sudah melebihi batas percobaan → lockout sekarang
    if (rec.count >= MAX_ATTEMPTS) {
        const lockedUntil = now + LOCKOUT_MS;
        attemptStore.set(ip, { ...rec, lockedUntil });
        return { allowed: false, remainingMs: LOCKOUT_MS };
    }

    return { allowed: true };
}

function recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const rec = attemptStore.get(ip);

    if (!rec || now - rec.firstAttempt > WINDOW_MS) {
        attemptStore.set(ip, { count: 1, firstAttempt: now });
    } else {
        attemptStore.set(ip, { ...rec, count: rec.count + 1 });
    }
}

function clearAttempts(ip: string): void {
    attemptStore.delete(ip);
}

// ── Server Action ─────────────────────────────────────────────────
export async function loginAction(
    _prevState: { error?: string } | null,
    formData: FormData
): Promise<{ error?: string }> {
    const password = (formData.get("password") as string | null) ?? "";

    if (!password) return { error: "Password tidak boleh kosong." };

    const h = await headers();
    const ip = getClientIP(h);

    // Rate limit check
    const { allowed, remainingMs } = checkRateLimit(ip);
    if (!allowed) {
        const minutes = Math.ceil((remainingMs ?? 0) / 60_000);
        return {
            error: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.`,
        };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
    });

    if (error) {
        recordFailedAttempt(ip);
        return { error: "Password salah." };
    }

    clearAttempts(ip);

    // redirect harus di luar try/catch — Next.js melempar error khusus
    redirect("/dashboard");
}
