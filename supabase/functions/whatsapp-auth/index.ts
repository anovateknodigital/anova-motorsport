import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const normalizePhone = (p: string) => {
  const digits = p.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (!digits.startsWith("62")) return "62" + digits;
  return digits;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const payload = await req.json();
    const { action, phone, full_name, team_name, is_register, otp_code } = payload;

    if (!phone) {
      return new Response(
        JSON.stringify({ success: false, message: "Nomor HP wajib disertakan" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

    // ================================================================
    // 1. ACTION: SEND OTP
    // ================================================================
    if (action === "send-otp") {
      const normalizedPhone = normalizePhone(phone);

      let existingProfile = null;
      let profileError = null;

      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("phone, id")
          .eq("phone", normalizedPhone)
          .eq("role", "manager")
          .maybeSingle();

        if (error) {
          console.error("Profile check error:", error);
          profileError = error;
        } else {
          existingProfile = data;
        }
      } catch (error) {
        console.error("Profile check exception:", error);
        profileError = error;
      }

      if (profileError) {
        return new Response(
          JSON.stringify({ success: false, message: "Terjadi kesalahan saat memeriksa profil pengguna" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
        );
      }

      if (is_register) {
        if (existingProfile) {
          return new Response(
            JSON.stringify({
              success: false,
              is_registered: true,
              message: "Nomor WhatsApp sudah terdaftar. Silahkan Login.",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      } else {
        if (!existingProfile) {
          return new Response(
            JSON.stringify({
              success: false,
              is_not_registered: true,
              message: "Nomor WhatsApp belum terdaftar. Silahkan daftar terlebih dahulu.",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }

      const otp = Math.floor(10000 + Math.random() * 90000).toString();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

      const { error: upsertError } = await supabaseClient
        .from("otp_codes")
        .upsert(
          {
            phone_number: normalizedPhone,
            code: otp,
            created_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
          },
          { onConflict: "phone_number" },
        );

      if (upsertError) {
        console.error("OTP Upsert Error:", upsertError);
        return new Response(
          JSON.stringify({ success: false, message: "Gagal menyimpan OTP" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
        );
      }

      // Kirim OTP via WhaCenter
      const waDeviceId = "e1e3f18d-6411-43ef-af58-963046fcd4ee";
      const waUrl = "https://api.whacenter.com/api/send";
      const waMessage = `Kode OTP Anova Motorsport Anda adalah: ${otp}. JANGAN BERIKAN KE SIAPAPUN.`;

      try {
        const response = await fetch(waUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: waDeviceId,
            number: normalizedPhone,
            message: waMessage,
            file: null,
            schedule: null,
          }),
        });
        const waResult = await response.json();
        console.log("WhaCenter API Response:", waResult);
        if (!response.ok || (waResult && waResult.status === false)) {
          console.error("WhatsApp API failed:", waResult);
        }
      } catch (waError) {
        console.error("Failed to call WhatsApp API:", waError);
      }

      console.log(`[DEV] OTP for ${normalizedPhone}: ${otp}`);

      return new Response(
        JSON.stringify({ success: true, message: "OTP terkirim" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ================================================================
    // 2. ACTION: VERIFY OTP
    // ================================================================
    if (action === "verify-otp") {
      if (!otp_code) {
        return new Response(
          JSON.stringify({ success: false, message: "Kode OTP diperlukan" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
        );
      }

      const normalizedPhone = normalizePhone(phone);
      console.log("[verify-otp] Start:", { phone, normalizedPhone, otp_code });

      // --- Cek OTP di database ---
      const { data: otpData, error: otpError } = await supabaseClient
        .from("otp_codes")
        .select("code, created_at, expires_at")
        .or(`phone_number.eq.${phone},phone_number.eq.${normalizedPhone}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("[verify-otp] OTP lookup:", { otpData, otpError });

      if (otpError) {
        return new Response(
          JSON.stringify({ success: false, message: "Terjadi kesalahan saat memverifikasi OTP" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
        );
      }

      if (!otpData) {
        return new Response(
          JSON.stringify({ success: false, message: "Kode OTP tidak ditemukan. Silakan minta OTP baru." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
        );
      }

      if (otpData.code !== otp_code) {
        console.warn("[verify-otp] OTP mismatch — expected:", otpData.code, "got:", otp_code);
        return new Response(
          JSON.stringify({ success: false, message: "Kode OTP salah. Periksa kembali kode yang diterima." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
        );
      }

      // Gunakan expires_at dari DB (bukan hitung ulang dari created_at)
      const isExpired = new Date() > new Date(otpData.expires_at);
      if (isExpired) {
        console.warn("[verify-otp] OTP expired at:", otpData.expires_at);
        return new Response(
          JSON.stringify({ success: false, message: "Kode OTP sudah kadaluarsa. Silakan minta OTP baru." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
        );
      }

      // Hapus OTP setelah validasi berhasil
      await supabaseClient
        .from("otp_codes")
        .delete()
        .or(`phone_number.eq.${phone},phone_number.eq.${normalizedPhone}`);

      // --- Login / Buat Akun Auth ---
      const dummyEmail = `${normalizedPhone}@anova-motorsport.com`;
      const dummyPassword = "WA_PASSWORD_" + normalizedPhone;

      // Coba sign in dulu — untuk user yang sudah terdaftar
      console.log("[verify-otp] Attempting sign in for:", dummyEmail);
      const { data: existingLogin, error: existingLoginError } =
        await supabaseClient.auth.signInWithPassword({
          email: dummyEmail,
          password: dummyPassword,
        });

      let loginData = existingLogin;
      let user = existingLogin?.user ?? null;

      if (existingLoginError || !existingLogin?.session) {
        // User belum ada — buat baru
        console.log("[verify-otp] Sign in failed, creating new user. Reason:", existingLoginError?.message);

        const { data: newUserData, error: createError } =
          await supabaseClient.auth.admin.createUser({
            email: dummyEmail,
            email_confirm: true,
            password: dummyPassword,
            user_metadata: {
              phone: normalizedPhone,
              full_name: full_name || "",
              team_name: team_name || "",
              role: "manager",
            },
          });

        if (createError) {
          console.error("[verify-otp] Create user error:", createError);
          return new Response(
            JSON.stringify({ success: false, message: "Gagal membuat akun: " + createError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
          );
        }

        user = newUserData.user;
        console.log("[verify-otp] New user created, id:", user?.id);

        // Sign in setelah user dibuat
        const { data: newLogin, error: newLoginError } =
          await supabaseClient.auth.signInWithPassword({
            email: dummyEmail,
            password: dummyPassword,
          });

        if (newLoginError || !newLogin?.session) {
          console.error("[verify-otp] Sign in after create error:", newLoginError);
          return new Response(
            JSON.stringify({ success: false, message: "Gagal masuk ke akun: " + (newLoginError?.message ?? "session kosong") }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
          );
        }

        loginData = newLogin;
        user = newLogin.user;
      } else {
        console.log("[verify-otp] Existing user signed in, id:", user?.id);
      }

      // Pastikan profil ada (fallback jika trigger belum jalan)
      if (user) {
        // First try to insert
        const { error: profError } = await supabaseClient
          .from("profiles")
          .insert({
            id: user.id,
            full_name: full_name || user.user_metadata?.full_name || "",
            team_name: team_name || user.user_metadata?.team_name || "",
            phone: normalizedPhone,
            role: "manager",
          });

        // If insert fails due to conflict, update instead
        if (profError && profError.code === "23505") {
          const { error: updateError } = await supabaseClient
            .from("profiles")
            .update({
              full_name: full_name || user.user_metadata?.full_name || "",
              team_name: team_name || user.user_metadata?.team_name || "",
              phone: normalizedPhone,
              role: "manager",
            })
            .eq("id", user.id);
          
          if (updateError) {
            console.error("[verify-otp] Profile update error:", updateError);
          }
        } else if (profError) {
          console.error("[verify-otp] Profile insert error:", profError);
        }
      }

      console.log("[verify-otp] Success for user:", loginData?.user?.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Verifikasi sukses",
          session: loginData!.session,
          user: loginData!.user,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Action tidak dikenal" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  } catch (err: any) {
    console.error("[whatsapp-auth] Unhandled error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err.message || "Terjadi kesalahan sistem",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
