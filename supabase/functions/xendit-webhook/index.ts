import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Verifikasi Token Xendit
    const callbackToken = req.headers.get('x-callback-token');
    const expectedToken = Deno.env.get('XENDIT_WEBHOOK_TOKEN') ?? 'zHvJKdIrI6qcZIY6rPZZCtKvNMyEw5npEGTqZuPacEV3VLrF';
    
    if (callbackToken !== expectedToken) {
      console.error('Invalid or missing x-callback-token. Received:', callbackToken);
      // Return 401 Unauthorized jika token tidak cocok
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = await req.json();
    console.log('Xendit Webhook Payload:', JSON.stringify(payload));

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Deteksi tipe event
    const event = payload.event;
    const data = payload.data || payload; // Xendit v2 wraps in data

    // Handle QR Payment Success
    if (event === 'qr.payment' || (data.status === 'SUCCEEDED' && data.reference_id)) {
      const referenceId = data.reference_id || payload.reference_id;
      const paymentId = data.id || payload.id; // qrpy_xxx
      const amount = data.amount || payload.amount;

      console.log(`QR Payment received: ref=${referenceId}, payment=${paymentId}, amount=${amount}`);

      if (!referenceId) {
        console.error('Missing reference_id in payload');
        return new Response(JSON.stringify({ message: 'Missing reference_id' }), { status: 200 });
      }

      // Cari rider_payment berdasarkan reference_id
      const { data: riderPayment, error: findErr } = await supabase
        .from('rider_payments')
        .select('id, manager_id, event_id, status')
        .eq('reference_id', referenceId)
        .single();

      if (findErr || !riderPayment) {
        console.error('rider_payment not found for reference_id:', referenceId, findErr);
        return new Response(JSON.stringify({ message: 'Payment record not found' }), { status: 200 });
      }

      // Jika sudah paid, skip (idempotent)
      if (riderPayment.status === 'paid') {
        console.log('Payment already marked as paid, skipping');
        return new Response(JSON.stringify({ message: 'Already paid' }), { status: 200 });
      }

      // Update rider_payments
      const { error: updateErr } = await supabase
        .from('rider_payments')
        .update({
          status: 'paid',
          xendit_payment_id: paymentId,
          paid_at: new Date().toISOString()
        })
        .eq('id', riderPayment.id);

      if (updateErr) {
        console.error('Error updating rider_payments:', updateErr);
        throw updateErr;
      }

      // Update semua rider_class_registrations terkait (berdasarkan payment_id)
      const { error: classUpdateErr } = await supabase
        .from('rider_class_registrations')
        .update({ payment_status: 'paid' })
        .eq('payment_id', riderPayment.id);

      if (classUpdateErr) {
        console.error('Error updating rider_class_registrations:', classUpdateErr);
      }

      // Generate start numbers
      const { error: rpcErr } = await supabase.rpc('assign_start_numbers', { p_payment_id: riderPayment.id });
      if (rpcErr) {
        console.error('Error calling assign_start_numbers RPC:', rpcErr);
      }

      console.log(`Payment confirmed and start numbers generated for manager_id: ${riderPayment.manager_id}`);
      return new Response(JSON.stringify({ message: 'Payment confirmed' }), { status: 200 });
    }

    // Handle QR Refund
    if (event === 'qr.payment.refunded' || (data.status === 'SUCCEEDED' && data.refund_id)) {
      const referenceId = data.reference_id || payload.reference_id;
      const refundId = data.refund_id || data.id;

      console.log(`QR Refund received: ref=${referenceId}, refund=${refundId}`);

      if (!referenceId) {
        console.error('Missing reference_id in refund payload');
        return new Response(JSON.stringify({ message: 'Missing reference_id' }), { status: 200 });
      }

      const { data: riderPayment, error: findErr } = await supabase
        .from('rider_payments')
        .select('id, manager_id')
        .eq('reference_id', referenceId)
        .single();

      if (findErr || !riderPayment) {
        console.error('rider_payment not found for refund:', referenceId);
        return new Response(JSON.stringify({ message: 'Payment not found' }), { status: 200 });
      }

      await supabase
        .from('rider_payments')
        .update({ status: 'refunded' })
        .eq('id', riderPayment.id);

      await supabase
        .from('rider_class_registrations')
        .update({ payment_status: 'refunded' })
        .eq('payment_id', riderPayment.id);

      console.log(`Refund confirmed for manager_id: ${riderPayment.manager_id}`);
      return new Response(JSON.stringify({ message: 'Refund confirmed' }), { status: 200 });
    }

    // Event lain yang tidak dihandle
    console.log('Unhandled webhook event:', event);
    return new Response(JSON.stringify({ message: 'Event not handled' }), { status: 200 });

  } catch (err) {
    console.error('xendit-webhook error:', err.message);
    // Selalu return 200 ke Xendit agar tidak retry terus
    return new Response(JSON.stringify({ error: err.message }), { status: 200 });
  }
});
