import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verifikasi user
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const { event_id } = await req.json();
    if (!event_id) throw new Error('event_id diperlukan');

    // Ambil semua registrasi yang pending dan belum memiliki payment_id,
    // milik manager ini, dan berada di event ini.
    const { data: classRegs, error: classErr } = await supabase
      .from('rider_class_registrations')
      .select(`
        id, 
        payment_id,
        race_classes!inner(event_id, registration_fee),
        riders!inner(manager_id)
      `)
      .eq('payment_status', 'pending')
      .is('payment_id', null)
      .eq('race_classes.event_id', event_id)
      .eq('riders.manager_id', user.id);

    if (classErr) throw new Error('Gagal mengambil data pendaftaran');

    // Cek apakah ada existing pending payment untuk event ini
    const { data: existingPayment } = await supabase
      .from('rider_payments')
      .select('id, qr_string, amount, expires_at, status')
      .eq('manager_id', user.id)
      .eq('event_id', event_id)
      .eq('status', 'pending')
      .single();

    // Hitung total tagihan baru
    let newAmount = 0;
    if (classRegs && classRegs.length > 0) {
      for (const reg of classRegs) {
        // Registration fee + 10k admin fee per start
        newAmount += Number(reg.race_classes.registration_fee) + 10000;
      }
    }

    // Jika tidak ada kelas baru yang unassigned, dan ada payment yang pending, kembalikan payment tersebut.
    if ((!classRegs || classRegs.length === 0) && existingPayment) {
      const expiresAt = new Date(existingPayment.expires_at);
      if (expiresAt > new Date()) {
        return new Response(JSON.stringify({
          success: true,
          payment_id: existingPayment.id,
          qr_string: existingPayment.qr_string,
          amount: existingPayment.amount,
          expires_at: existingPayment.expires_at,
          reused: true
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Jika kita sampai sini tapi classRegs kosong, dan tidak ada existing payment valid, return error
    if (!classRegs || classRegs.length === 0) {
      throw new Error('Tidak ada tagihan yang pending.');
    }

    let totalAmountToPay = newAmount;

    // Jika ada existing payment yang valid, kita batalkan payment lama agar tidak bentrok, 
    // karena amount-nya pasti berbeda (bertambah)
    if (existingPayment) {
       await supabase.from('rider_payments').update({ status: 'cancelled' }).eq('id', existingPayment.id);
       // Reset payment_id di class_regs lama yang terhubung dengan existingPayment
       await supabase.from('rider_class_registrations').update({ payment_id: null }).eq('payment_id', existingPayment.id);
    }

    // Ambil lagi SEMUA yang pending setelah kita mereset existingPayment
    const { data: allPendingRegs, error: allPendingErr } = await supabase
      .from('rider_class_registrations')
      .select(`
        id, 
        race_classes!inner(event_id, registration_fee),
        riders!inner(manager_id)
      `)
      .eq('payment_status', 'pending')
      .eq('race_classes.event_id', event_id)
      .eq('riders.manager_id', user.id);

    if (allPendingErr || !allPendingRegs || allPendingRegs.length === 0) {
      throw new Error('Gagal mengambil ulang data tagihan');
    }

    totalAmountToPay = 0;
    for (const reg of allPendingRegs) {
      totalAmountToPay += Number(reg.race_classes.registration_fee) + 10000;
    }

    if (totalAmountToPay <= 0) throw new Error('Total pembayaran tidak valid');

    // Generate reference_id unik
    const shortManagerId = user.id.replace(/-/g, '').substring(0, 8).toUpperCase();
    const timestamp = Date.now();
    const referenceId = `ANOVA-BULK-${shortManagerId}-${timestamp}`;

    // Call Xendit API untuk buat QR Code
    const xenditKey = Deno.env.get('XENDIT_SECRET_KEY') ?? '';
    const xenditAuth = btoa(xenditKey + ':');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 jam

    const xenditBody = {
      reference_id: referenceId,
      type: 'DYNAMIC',
      currency: 'IDR',
      amount: totalAmountToPay
    };

    console.log('Creating Xendit QR:', JSON.stringify(xenditBody));

    const xenditRes = await fetch('https://api.xendit.co/qr_codes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${xenditAuth}`,
        'api-version': '2022-07-31'
      },
      body: JSON.stringify(xenditBody)
    });

    const xenditData = await xenditRes.json();
    console.log('Xendit Response:', JSON.stringify(xenditData));

    if (!xenditRes.ok || xenditData.error_code) {
      throw new Error(`Xendit Error: ${xenditData.message || xenditData.error_code || 'Unknown error'}`);
    }

    // Simpan ke rider_payments
    const { data: payment, error: paymentErr } = await supabase
      .from('rider_payments')
      .insert({
        manager_id: user.id,
        event_id,
        xendit_qr_id: xenditData.id,
        reference_id: referenceId,
        qr_string: xenditData.qr_string,
        amount: totalAmountToPay,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (paymentErr) throw new Error(`Gagal menyimpan payment: ${paymentErr.message}`);

    // Update semua rider_class_registrations agar terhubung dengan payment_id ini
    const regIds = allPendingRegs.map(r => r.id);
    const { error: updateRegsErr } = await supabase
      .from('rider_class_registrations')
      .update({ payment_id: payment.id })
      .in('id', regIds);

    if (updateRegsErr) throw new Error(`Gagal mengupdate relasi tagihan: ${updateRegsErr.message}`);

    return new Response(JSON.stringify({
      success: true,
      payment_id: payment.id,
      qr_string: xenditData.qr_string,
      amount: totalAmountToPay,
      expires_at: expiresAt.toISOString(),
      reused: false
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('xendit-create-qris error:', err.message);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
