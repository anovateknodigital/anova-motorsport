'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const EDGE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/whatsapp-auth`;

export async function sendOtpAction(
  formData: FormData
) {
  const phone = formData.get('phone') as string;
  const isRegister = formData.get('is_register') === 'true';

  if (!phone) {
    return { success: false, message: 'Nomor WhatsApp wajib diisi' };
  }

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      },
      body: JSON.stringify({
        action: 'send-otp',
        phone,
        is_register: isRegister,
      }),
    });

    const data = await response.json();

    if (data.is_registered) {
      return { success: false, message: data.message, isRegistered: true };
    }

    if (data.is_not_registered) {
      return { success: false, message: data.message, isNotRegistered: true };
    }

    return {
      success: data.success,
      message: data.message,
    };
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}

export async function verifyOtpAction(
  formData: FormData
) {
  const phone = formData.get('phone') as string;
  const otpCode = formData.get('otp_code') as string;
  const fullName = formData.get('full_name') as string;
  const teamName = formData.get('team_name') as string;
  const isRegister = formData.get('is_register') === 'true';

  if (!phone || !otpCode) {
    return { success: false, message: 'Semua field wajib diisi' };
  }

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    },
    body: JSON.stringify({
      action: 'verify-otp',
      phone,
      otp_code: otpCode,
      full_name: fullName || undefined,
      team_name: teamName || undefined,
      is_register: isRegister,
    }),
  });

  const data = await response.json();

  if (data.success && data.session) {
    // Set session cookie
    const supabase = await createClient();
    await supabase.auth.setSession(data.session);

    revalidatePath('/');

    // Redirect to dashboard (profile should be created by edge function)
    redirect('/register/dashboard');
  }

  return {
    success: data.success,
    message: data.message,
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/register');
}
