'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Users, PlusCircle, ArrowLeft, UserCircle, Calendar, MapPin, Loader2, AlertCircle, CreditCard, QrCode, X } from 'lucide-react';
import RiderList, { QrisModal } from '../../RiderList';

interface EventData {
  id: number;
  title: string;
  slug: string;
  category: string;
  start_date: string;
  end_date: string;
  image_url: string;
  location: string;
}

export default function EventDashboardPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [riders, setRiders] = useState<any[]>([]);
  const [manager, setManager] = useState<any>(null);
  
  // Bulk payment states
  const [qrisModalOpen, setQrisModalOpen] = useState(false);
  const [currentQrisData, setCurrentQrisData] = useState<any>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [raceClasses, setRaceClasses] = useState<any[]>([]);
  
  // Transaction history states
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentDetailsModalOpen, setPaymentDetailsModalOpen] = useState(false);
  const [isCancellingPayment, setIsCancellingPayment] = useState(false);
  const [currentQrisRegistrations, setCurrentQrisRegistrations] = useState<any[]>([]);

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/register');
        return;
      }

      // Get manager profile
      const { data: managerProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setManager(managerProfile);

      // Get event details
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', Number(eventId))
        .single();
      setEvent(eventData);

      // Get riders for this event
      const { data: ridersData } = await supabase
        .from('riders')
        .select(`
          *,
          rider_class_registrations (
            id,
            category,
            payment_status,
            payment_id,
            start_number,
            motorcycle_brand,
            frame_number,
            engine_number,
            race_classes (
              id,
              class_name,
              class_category,
              event_id,
              registration_fee
            )
          ),
          rider_payments (
            id,
            status,
            amount,
            qr_string,
            expires_at
          )
        `)
        .eq('manager_id', user.id)
        .eq('event_id', Number(eventId))
        .order('created_at', { ascending: false });
      setRiders(ridersData || []);

      // Get latest pending payment for this event and manager
      const { data: pendingPaymentData } = await supabase
        .from('rider_payments')
        .select('*')
        .eq('manager_id', user.id)
        .eq('event_id', Number(eventId))
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pendingPaymentData) {
        const expiresAt = new Date(pendingPaymentData.expires_at);
        const now = new Date();
        
        if (expiresAt > now) {
          setCurrentQrisData({
            qr_string: pendingPaymentData.qr_string,
            amount: pendingPaymentData.amount,
            payment_request_id: pendingPaymentData.xendit_payment_request_id,
            expires_at: pendingPaymentData.expires_at
          });
        } else {
          setCurrentQrisData(null);
        }
      } else {
        setCurrentQrisData(null);
      }

      // Get transaction history
      const { data: paymentsData } = await supabase
        .from('rider_payments')
        .select(`
          *,
          rider_class_registrations (
            id,
            category,
            start_number,
            payment_status,
            registration_fee,
            race_classes (
              class_name,
              registration_fee
            ),
            riders (
              id,
              name
            )
          )
        `)
        .eq('manager_id', user.id)
        .eq('event_id', Number(eventId))
        .order('created_at', { ascending: false });
      
      setPayments(paymentsData || []);

      // Get available classes for this event
      const { data: classesData } = await supabase
        .from('race_classes')
        .select('*')
        .eq('event_id', Number(eventId))
        .eq('is_active', true)
        .order('class_name', { ascending: true });
      
      setRaceClasses(classesData || []);
    } catch (error) {
      console.error('Error loading event dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadData();
    }
  }, [eventId, supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#D32F2F] animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Event tidak ditemukan</h1>
        <Link href="/register/dashboard" className="text-[#D32F2F] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const pendingCount = riders.reduce((acc, rider) => {
    return acc + (rider.rider_class_registrations?.filter((r: any) => r.payment_status === 'pending').length || 0);
  }, 0);

  const handleBulkPay = async () => {
    setIsGeneratingQr(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/xendit-create-qris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ event_id: eventId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat QRIS');
      
      setCurrentQrisData(data);
      setQrisModalOpen(true);
    } catch (error: any) {
      console.error('QR error:', error);
      alert('Gagal menampilkan QRIS: ' + error.message);
    } finally {
      setIsGeneratingQr(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="w-full bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-3 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/register/dashboard" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="font-teko text-2xl font-bold uppercase italic text-white">
                  EVENT DASHBOARD
                </h1>
                <p className="text-zinc-500 text-xs">Kelola pembalap untuk event ini</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-3 md:px-8">
          {/* Event Header Card */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={event.image_url || '/event-placeholder.jpg'}
                alt={event.title}
                fill
                className="object-cover opacity-20 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>
            
            <div className="relative p-5 md:p-12 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-700 shrink-0">
                <Image
                  src={event.image_url || '/event-placeholder.jpg'}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {event.category}
                  </span>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest">
                    <Calendar size={14} className="text-[#D32F2F]" />
                    {new Date(event.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white uppercase italic font-teko tracking-tight leading-tight mb-4">
                  {event.title}
                </h2>
                
                <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
                  <MapPin size={16} className="text-[#D32F2F]" />
                  <span className="text-sm font-medium">{event.location}</span>
                </div>
              </div>

              <Link
                href={`/register/rider/new?event=${event.slug}`}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-xl shadow-[#D32F2F]/20 active:scale-95"
              >
                <PlusCircle size={20} />
                Daftarkan Pembalap
              </Link>
            </div>
          </div>

          <QrisModal 
            isOpen={qrisModalOpen}
            onClose={() => {
              setQrisModalOpen(false);
              // Refresh data after closing
              window.location.reload();
            }}
            qrisData={currentQrisData}
            registrations={currentQrisRegistrations}
          />

          {/* Bulk Payment Banner */}
          {pendingCount > 0 && (
            <div className="bg-[#D32F2F]/10 border border-[#D32F2F]/30 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-sm shadow-xl shadow-[#D32F2F]/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D32F2F]/20 flex items-center justify-center shrink-0 border border-[#D32F2F]/30">
                  <AlertCircle size={24} className="text-[#D32F2F]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1 font-teko uppercase italic tracking-wide">Menunggu Pembayaran</h3>
                  <p className="text-zinc-400 text-sm">
                    Terdapat <strong className="text-white">{pendingCount} start</strong> yang belum dibayar. 
                    {currentQrisData ? ' Anda memiliki pembayaran aktif yang belum diselesaikan.' : ' Lakukan pembayaran sekaligus untuk semua pembalap Anda.'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {currentQrisData && (
                  <button
                    onClick={() => {
                      // Find registrations for the active pending payment
                      const activePmt = payments.find(p => p.qr_string === currentQrisData?.qr_string);
                      setCurrentQrisRegistrations(activePmt?.rider_class_registrations || []);
                      setQrisModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Lihat QRIS Aktif
                  </button>
                )}
                <button
                  onClick={handleBulkPay}
                  disabled={isGeneratingQr}
                  className="w-full sm:w-auto bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all whitespace-nowrap shadow-lg shadow-[#D32F2F]/20 flex items-center justify-center gap-2"
                >
                  {isGeneratingQr ? <Loader2 size={18} className="animate-spin" /> : null}
                  {isGeneratingQr ? 'Memproses...' : currentQrisData ? 'Perbarui QRIS' : 'Bayar Semua'}
                </button>
              </div>
            </div>
          )}

          {/* Riders Section */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-5 md:p-8 relative z-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20 flex items-center justify-center">
                  <Users size={20} className="text-[#D32F2F]" />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase italic font-teko tracking-wider">Pembalap Terdaftar</h3>
              </div>
              <div className="hidden md:block">
                <span className="text-zinc-500 text-sm font-medium">Total: {riders.length} Pembalap</span>
              </div>
            </div>

            <RiderList 
              riders={riders} 
              availableClasses={raceClasses} 
              eventId={Number(eventId)} 
              onRefresh={loadData}
            />

            {riders.length === 0 && (
              <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-2xl">
                <Users size={48} className="mx-auto text-zinc-800 mb-4" />
                <h4 className="text-white font-bold mb-1 uppercase italic font-teko text-xl">Belum Ada Pembalap</h4>
                <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">
                  Anda belum mendaftarkan pembalap untuk event ini. Klik tombol di atas untuk memulai.
                </p>
                <Link
                  href={`/register/rider/new?event=${event.slug}`}
                  className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-[#D32F2F]/20"
                >
                  <PlusCircle size={16} />
                  Daftarkan Pembalap Pertama
                </Link>
              </div>
            )}
          </div>

          {/* Transaction History Section */}
          <div className="mt-8 md:mt-12 bg-zinc-950/80 border border-zinc-800 rounded-3xl p-5 md:p-8 relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <CreditCard size={20} className="text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase italic font-teko tracking-wider">Riwayat Transaksi</h3>
            </div>

            {payments.length > 0 ? (
              <div className="grid gap-4">
                {payments.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPayment(p);
                      setPaymentDetailsModalOpen(true);
                    }}
                    className="w-full text-left bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-bold font-mono text-xs">{p.reference_id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          p.status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          p.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                          'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {p.status === 'paid' ? 'LUNAS' : p.status === 'pending' ? 'MENUNGGU' : p.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-zinc-500 text-[10px] uppercase tracking-widest">
                        {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">Rp {Number(p.amount).toLocaleString('id-ID')}</div>
                      <div className="text-zinc-500 text-[10px] uppercase tracking-widest">
                        {p.rider_class_registrations?.length || 0} START
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-2xl">
                <p className="text-zinc-500 text-sm">Belum ada riwayat transaksi untuk event ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {paymentDetailsModalOpen && selectedPayment && (() => {
        const regs: any[] = selectedPayment.rider_class_registrations || [];
        const totalStarts = regs.length;
        const ADMIN_FEE_PER_START = 10000;
        const totalAdminFee = totalStarts * ADMIN_FEE_PER_START;

        // Group registrations by rider id
        const riderMap = new Map<string, { name: string; regs: any[] }>();
        regs.forEach((reg: any) => {
          const riderId = reg.riders?.id || 'unknown';
          const riderName = reg.riders?.name || 'Unknown';
          if (!riderMap.has(riderId)) riderMap.set(riderId, { name: riderName, regs: [] });
          riderMap.get(riderId)!.regs.push(reg);
        });

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="absolute inset-0" onClick={() => setPaymentDetailsModalOpen(false)} />
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setPaymentDetailsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-1 font-teko uppercase italic">Detail Transaksi</h2>
              <p className="text-zinc-500 text-xs font-mono mb-6">{selectedPayment.reference_id}</p>

              {/* Per-rider breakdown */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from(riderMap.entries()).map(([riderId, rider]) => {
                  const riderSubtotal = rider.regs.reduce((acc: number, reg: any) =>
                    acc + Number(reg.registration_fee || reg.race_classes?.registration_fee || 0), 0);
                  return (
                    <div key={riderId} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden">
                      {/* Rider header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/50 bg-zinc-800/80">
                        <span className="text-white font-bold text-sm">{rider.name}</span>
                        <span className="text-zinc-400 text-xs font-mono">{rider.regs.length} start</span>
                      </div>
                      {/* Class rows — grouped by class name */}
                      <div className="divide-y divide-zinc-700/30">
                        {(() => {
                          // Group by class id/name
                          const classMap = new Map<string, { className: string; feePerStart: number; count: number; startNumbers: string[] }>();
                          rider.regs.forEach((reg: any) => {
                            const classKey = reg.race_classes?.class_name || 'Unknown';
                            const feePerStart = Number(reg.registration_fee || reg.race_classes?.registration_fee || 0);
                            if (!classMap.has(classKey)) {
                              classMap.set(classKey, { className: classKey, feePerStart, count: 0, startNumbers: [] });
                            }
                            const entry = classMap.get(classKey)!;
                            entry.count += 1;
                            if (reg.start_number) entry.startNumbers.push(`#${reg.start_number}`);
                          });
                          return Array.from(classMap.values()).map((cls) => {
                            const lineTotal = cls.feePerStart * cls.count;
                            return (
                              <div key={cls.className} className="px-4 py-2.5 flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <span className="text-zinc-200 text-xs font-medium block truncate">
                                    {cls.className}
                                  </span>
                                  {cls.startNumbers.length > 0 && (
                                    <span className="text-[#D32F2F] text-sm font-mono font-bold mt-1 block">
                                      {cls.startNumbers.sort((a: any, b: any) => a.localeCompare(b, undefined, {numeric: true})).map((n: string) => `#${n}`).join(', ')}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-zinc-300 text-xs font-medium">
                                    Rp {lineTotal.toLocaleString('id-ID')}
                                  </div>
                                  <div className="text-zinc-500 text-[10px]">
                                    {cls.count} start × Rp {cls.feePerStart.toLocaleString('id-ID')}
                                  </div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                      {/* Rider subtotal */}
                      <div className="px-4 py-2.5 flex items-center justify-between bg-zinc-900/50 border-t border-zinc-700/30">
                        <span className="text-zinc-500 text-[10px] uppercase tracking-widest">Subtotal</span>
                        <span className="text-white text-xs font-bold">Rp {riderSubtotal.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Admin fee row */}
                {totalStarts > 0 && (
                  <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-zinc-300 text-xs font-medium block">Biaya Admin</span>
                      <span className="text-zinc-500 text-[10px]">{totalStarts} start × Rp 10.000</span>
                    </div>
                    <span className="text-zinc-300 text-xs font-bold">Rp {totalAdminFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              {/* Total & status */}
              <div className="mt-6 pt-5 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-white">Rp {Number(selectedPayment.amount).toLocaleString('id-ID')}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest ${
                  selectedPayment.status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                  selectedPayment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                  'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {selectedPayment.status === 'paid' ? 'LUNAS' : selectedPayment.status.toUpperCase()}
                </div>
              </div>

              {selectedPayment.status === 'pending' && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  {/* Cancel payment */}
                  <button
                    disabled={isCancellingPayment}
                    onClick={async () => {
                      if (!confirm('Yakin ingin membatalkan pembayaran ini? Kelas yang terkait akan dikembalikan ke status pending (belum bayar).')) return;
                      setIsCancellingPayment(true);
                      try {
                        const { data: { session } } = await supabase.auth.getSession();
                        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/xendit-refund`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session?.access_token}`
                          },
                          body: JSON.stringify({ payment_id: selectedPayment.id })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Gagal membatalkan pembayaran');
                        setPaymentDetailsModalOpen(false);
                        setSelectedPayment(null);
                        await loadData();
                      } catch (err: any) {
                        alert('Error: ' + err.message);
                      } finally {
                        setIsCancellingPayment(false);
                      }
                    }}
                    className="flex-1 border border-zinc-700 hover:border-red-500/50 hover:bg-red-500/10 disabled:opacity-50 text-zinc-400 hover:text-red-400 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isCancellingPayment ? 'Membatalkan...' : 'Batalkan Pembayaran'}
                  </button>

                  {/* Continue payment */}
                  <button
                    disabled={isCancellingPayment}
                    onClick={() => {
                      setCurrentQrisData({
                        qr_string: selectedPayment.qr_string,
                        amount: selectedPayment.amount,
                        payment_request_id: selectedPayment.xendit_payment_request_id
                      });
                      setCurrentQrisRegistrations(selectedPayment.rider_class_registrations || []);
                      setPaymentDetailsModalOpen(false);
                      setQrisModalOpen(true);
                    }}
                    className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <QrCode size={18} />
                    Lanjutkan Pembayaran
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
