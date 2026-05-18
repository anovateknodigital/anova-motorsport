'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, X, XCircle, AlertCircle, QrCode, PlusCircle, Bike, Minus, Plus } from 'lucide-react';
import { registerRiderClass, updateRiderTechDetails } from '../rider/actions';
import Image from 'next/image';

interface Rider {
  id: string;
  name: string;
  reg_number: string | null;
  city: string;
  team_name: string;
  kis_number: string | null;
  kta_number: string | null;
  id_number: string | null;
  rider_class_registrations?: Array<{
    id: string;
    category: string;
    payment_status: string;
    start_number: string | null;
    motorcycle_brand: string | null;
    frame_number: string | null;
    engine_number: string | null;
    race_classes?: {
      id: number;
      class_name: string;
      class_category: string;
      event_id: number;
      registration_fee: number;
    };
  }>;
  rider_payments?: Array<{
    id: string;
    status: string;
    amount: number;
    qr_string: string;
    expires_at: string;
  }>;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  riderName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  riderName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={22} className="text-red-400" />
        </div>

        <h3 className="font-teko text-2xl font-bold text-white text-center uppercase italic mb-1">
          Hapus Pembalap?
        </h3>
        <p className="text-zinc-400 text-sm text-center mb-2">
          Pembalap yang akan dihapus:
        </p>
        <p className="text-white font-semibold text-center mb-6">
          {riderName}
        </p>
        <p className="text-zinc-500 text-xs text-center mb-6">
          Semua data kelas dan registrasi pembalap ini akan dihapus permanen.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-bold transition-all"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  riderName,
  isLoading
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  riderName: string;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
          <XCircle size={22} className="text-orange-400" />
        </div>

        <h3 className="font-teko text-2xl font-bold text-white text-center uppercase italic mb-1">
          Batalkan Pendaftaran?
        </h3>
        <p className="text-zinc-400 text-sm text-center mb-2">
          Membatalkan pendaftaran untuk:
        </p>
        <p className="text-white font-semibold text-center mb-6">
          {riderName}
        </p>
        <p className="text-zinc-500 text-xs text-center mb-6">
          Jika pembayaran sudah dilakukan, dana akan dikembalikan (refund) via Xendit ke rekening asal.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all disabled:opacity-50"
          >
            Tutup
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? 'Memproses...' : 'Ya, Batalkan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function QrisModal({
  isOpen,
  onClose,
  qrisData,
  registrations
}: {
  isOpen: boolean;
  onClose: () => void;
  qrisData: {qr_string: string, amount: number, payment_request_id?: string} | null;
  registrations?: any[];
}) {
  if (!isOpen || !qrisData) return null;

  const regs = registrations || [];
  const totalStarts = regs.length;
  const ADMIN_FEE = 10000;

  // Group by rider
  const riderMap = new Map<string, { name: string; regs: any[] }>();
  regs.forEach((reg: any) => {
    const riderId = reg.riders?.id || reg.riders?.name || 'unknown';
    const riderName = reg.riders?.name || 'Unknown';
    if (!riderMap.has(riderId)) riderMap.set(riderId, { name: riderName, regs: [] });
    riderMap.get(riderId)!.regs.push(reg);
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[95vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D32F2F]" />

        <h2 className="text-2xl font-bold text-white mb-1 font-teko uppercase italic mt-2">Selesaikan Pembayaran</h2>
        <p className="text-zinc-400 text-sm mb-5">Scan QR Code menggunakan aplikasi mobile banking atau e-wallet.</p>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">

          {/* Transaction breakdown */}
          {regs.length > 0 && (
            <div className="space-y-2">
              {Array.from(riderMap.entries()).map(([riderId, rider]) => {
                const riderSubtotal = rider.regs.reduce((acc: number, reg: any) =>
                  acc + Number(reg.registration_fee || reg.race_classes?.registration_fee || 0), 0);

                // Group by class
                const classMap = new Map<string, { className: string; feePerStart: number; count: number; startNumbers: string[] }>();
                rider.regs.forEach((reg: any) => {
                  const key = reg.race_classes?.class_name || 'Unknown';
                  const fee = Number(reg.registration_fee || reg.race_classes?.registration_fee || 0);
                  if (!classMap.has(key)) classMap.set(key, { className: key, feePerStart: fee, count: 0, startNumbers: [] });
                  const entry = classMap.get(key)!;
                  entry.count += 1;
                  if (reg.start_number) entry.startNumbers.push(`#${reg.start_number}`);
                });

                return (
                  <div key={riderId} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden text-left">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/80 border-b border-zinc-700/50">
                      <span className="text-white font-bold text-sm">{rider.name}</span>
                      <span className="text-zinc-400 text-xs font-mono">{rider.regs.length} start</span>
                    </div>
                    <div className="divide-y divide-zinc-700/30">
                      {Array.from(classMap.values()).map((cls) => (
                        <div key={cls.className} className="px-4 py-2 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <span className="text-zinc-200 text-xs font-medium block truncate">{cls.className}</span>
                            {cls.startNumbers.length > 0 && (
                              <span className="text-[#D32F2F] text-[10px] font-mono">{cls.startNumbers.join(', ')}</span>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-zinc-300 text-xs font-medium">Rp {(cls.feePerStart * cls.count).toLocaleString('id-ID')}</div>
                            <div className="text-zinc-500 text-[10px]">{cls.count} start × Rp {cls.feePerStart.toLocaleString('id-ID')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 flex justify-between bg-zinc-900/50 border-t border-zinc-700/30">
                      <span className="text-zinc-500 text-[10px] uppercase tracking-widest">Subtotal</span>
                      <span className="text-white text-xs font-bold">Rp {riderSubtotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                );
              })}

              {/* Admin fee */}
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-left">
                <div>
                  <span className="text-zinc-300 text-xs font-medium block">Biaya Admin</span>
                  <span className="text-zinc-500 text-[10px]">{totalStarts} start × Rp 10.000</span>
                </div>
                <span className="text-zinc-300 text-xs font-bold">Rp {(totalStarts * ADMIN_FEE).toLocaleString('id-ID')}</span>
              </div>

              <div className="border-t border-zinc-800" />
            </div>
          )}

          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl mx-auto w-fit shadow-lg">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrisData.qr_string)}`}
              alt="QRIS Payment"
              width="220"
              height="220"
              className="mx-auto"
            />
          </div>

          {qrisData.payment_request_id && (
            <div className="text-center">
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Payment Request ID</p>
              <p className="text-zinc-300 text-xs font-mono bg-zinc-800/50 py-1 px-3 rounded-full border border-zinc-700/50 w-fit mx-auto">
                {qrisData.payment_request_id}
              </p>
            </div>
          )}

          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center">
            <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Pembayaran</p>
            <p className="text-3xl font-bold text-[#D32F2F]">Rp {qrisData.amount.toLocaleString('id-ID')}</p>
            <p className="text-zinc-500 text-[10px] mt-1 italic">*Sudah termasuk biaya admin (Rp 10.000 / start)</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-white text-black hover:bg-zinc-200 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shrink-0"
        >
          Tutup & Cek Status
        </button>
      </div>
    </div>
  );
}

interface RiderListProps {
  riders: Rider[];
  availableClasses?: any[];
  eventId?: number;
  onRefresh?: () => void;
}

export default function RiderList({ riders, availableClasses = [], eventId, onRefresh }: RiderListProps) {
  const router = useRouter();
  
  // States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState<Rider | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [riderToCancel, setRiderToCancel] = useState<Rider | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const [qrisModalOpen, setQrisModalOpen] = useState(false);
  const [currentQrisData, setCurrentQrisData] = useState<any>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState<string | null>(null);

  // Add Class state
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);
  const [selectedRiderForClass, setSelectedRiderForClass] = useState<Rider | null>(null);
  const [classEntries, setClassEntries] = useState<any[]>([]);
  const [isSubmittingClass, setIsSubmittingClass] = useState(false);

  // Edit Tech Modal state
  const [editTechModalOpen, setEditTechModalOpen] = useState(false);
  const [techEditData, setTechEditData] = useState<{
    riderId: string;
    classId: number;
    className: string;
    brand: string;
    frame: string;
    engine: string;
  } | null>(null);
  const [isSavingTech, setIsSavingTech] = useState(false);

  const supabase = createClient();

  const handleClassCountChange = (cls: any, delta: number) => {
    const currentCount = classEntries.filter(e => e.classId === cls.id).length;
    if (delta > 0) {
      // Find if we already have tech details for this class
      const existingTech = classEntries.find(e => e.classId === cls.id);
      const paidTech = selectedRiderForClass?.rider_class_registrations?.find(
        r => r.race_classes?.id === cls.id && r.payment_status === 'paid'
      );
      
      setClassEntries([...classEntries, {
        id: `entry_${Date.now()}_${Math.random()}`,
        classId: cls.id,
        className: cls.class_name,
        category: 'open',
        motorcycleBrand: existingTech?.motorcycleBrand || paidTech?.motorcycle_brand || '',
        frameNumber: existingTech?.frameNumber || paidTech?.frame_number || '',
        engineNumber: existingTech?.engineNumber || paidTech?.engine_number || '',
        startNumber: '',
        fee: Number(cls.registration_fee)
      }]);
    } else if (currentCount > 0) {
      const lastEntry = [...classEntries].reverse().find(e => e.classId === cls.id);
      setClassEntries(classEntries.filter(e => e.id !== lastEntry.id));
    }
  };

  const openAddClassModal = (rider: Rider) => {
    setSelectedRiderForClass(rider);
    // Pre-fill existing pending classes
    const pendingClasses = rider.rider_class_registrations
      ?.filter(r => r.payment_status === 'pending')
      .map(r => ({
        id: r.id,
        classId: r.race_classes?.id,
        className: r.race_classes?.class_name,
        category: r.category,
        motorcycleBrand: r.motorcycle_brand,
        frameNumber: r.frame_number,
        engineNumber: r.engine_number,
        startNumber: r.start_number,
        fee: Number(r.race_classes?.registration_fee || 0)
      })) || [];
    setClassEntries(pendingClasses);
    setAddClassModalOpen(true);
  };

  const updateClassTechDetails = (classId: string, field: string, value: string) => {
    setClassEntries(classEntries.map(e => e.classId === classId ? { ...e, [field]: value } : e));
  };

  const handleDeleteClick = (rider: Rider) => {
    setRiderToDelete(rider);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!riderToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('riders').delete().eq('id', riderToDelete.id);
      if (error) throw error;
      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Gagal menghapus pembalap: ' + error.message);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setRiderToDelete(null);
    }
  };

  const handleSaveTechDetails = async () => {
    if (!techEditData) return;
    setIsSavingTech(true);
    try {
      await updateRiderTechDetails(
        techEditData.riderId,
        techEditData.classId,
        {
          motorcycleBrand: techEditData.brand,
          frameNumber: techEditData.frame,
          engineNumber: techEditData.engine
        }
      );
      setEditTechModalOpen(false);
      setTechEditData(null);
      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
      alert('Detail kendaraan berhasil diperbarui!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingTech(false);
    }
  };

  const handleCancelClick = (rider: Rider) => {
    setRiderToCancel(rider);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!riderToCancel) return;
    
    // Temukan payment aktif
    const activePayment = riderToCancel.rider_payments?.find(p => p.status === 'pending' || p.status === 'paid');
    if (!activePayment) {
      alert('Tidak ada pembayaran yang bisa dibatalkan.');
      return;
    }

    setIsCancelling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/xendit-refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ payment_id: activePayment.id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membatalkan');
      
      alert(data.message || 'Pendaftaran berhasil dibatalkan.');
      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      console.error('Cancel error:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsCancelling(false);
      setCancelModalOpen(false);
      setRiderToCancel(null);
    }
  };

  const handlePayClick = async (rider: Rider, eventId: string) => {
    setIsGeneratingQr(rider.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/xendit-create-qris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ rider_id: rider.id, event_id: eventId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat QRIS');
      
      setCurrentQrisData(data);
      setQrisModalOpen(true);
    } catch (error: any) {
      console.error('QR error:', error);
      alert('Gagal menampilkan QRIS: ' + error.message);
    } finally {
      setIsGeneratingQr(null);
    }
  };

  if (riders.length === 0) return null;

  return (
    <>
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        riderName={riderToDelete?.name || ''}
      />

      <CancelConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => !isCancelling && setCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        riderName={riderToCancel?.name || ''}
        isLoading={isCancelling}
      />

      <QrisModal 
        isOpen={qrisModalOpen}
        onClose={() => {
          setQrisModalOpen(false);
          if (onRefresh) {
            onRefresh();
          } else {
            router.refresh();
          }
        }}
        qrisData={currentQrisData}
      />

      {/* Edit Tech Modal */}
      {editTechModalOpen && techEditData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="absolute inset-0" onClick={() => !isSavingTech && setEditTechModalOpen(false)} />
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => !isSavingTech && setEditTechModalOpen(false)}
              disabled={isSavingTech}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white disabled:opacity-50"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1 font-teko uppercase italic">Edit Kendaraan</h2>
              <p className="text-zinc-500 text-sm">Update detail motor untuk kelas <strong className="text-white">{techEditData.className}</strong></p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Merek Motor</label>
                <input
                  type="text"
                  value={techEditData.brand}
                  onChange={(e) => setTechEditData({ ...techEditData, brand: e.target.value })}
                  placeholder="Contoh: Honda"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">No. Rangka (4 Angka Terakhir)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={techEditData.frame}
                  onChange={(e) => setTechEditData({ ...techEditData, frame: e.target.value })}
                  placeholder="0000"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">No. Mesin (4 Angka Terakhir)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={techEditData.engine}
                  onChange={(e) => setTechEditData({ ...techEditData, engine: e.target.value })}
                  placeholder="0000"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                />
              </div>
            </div>

            <button
              onClick={handleSaveTechDetails}
              disabled={isSavingTech}
              className="w-full mt-6 bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
            >
              {isSavingTech ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {addClassModalOpen && selectedRiderForClass && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-2 md:p-4">
          <div className="absolute inset-0" onClick={() => setAddClassModalOpen(false)} />
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[95vh]">
            <button 
              onClick={() => setAddClassModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1 font-teko uppercase italic">Tambah Kelas Balap</h2>
              <p className="text-zinc-500 text-sm">Pilih kelas untuk <strong className="text-white">{selectedRiderForClass.name}</strong></p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
              {/* Main Classes Section */}
              {availableClasses.filter(c => c.class_category === 'main-class').length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[#D32F2F] text-xs font-bold uppercase tracking-widest border-l-2 border-[#D32F2F] pl-3">Kelas Utama</h3>
                  <div className="space-y-4">
                    {availableClasses.filter(c => c.class_category === 'main-class').map((cls) => {
                      const entries = classEntries.filter(e => e.classId === cls.id);
                      const count = entries.length;
                      
                      const paidCount = selectedRiderForClass?.rider_class_registrations?.filter(
                        r => r.race_classes?.id === cls.id && r.payment_status === 'paid'
                      ).length || 0;

                      return (
                        <div key={cls.id} className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold">{cls.class_name}</h4>
                                {paidCount > 0 && (
                                  <span className="text-green-500 bg-green-500/10 border border-green-500/20 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                                    {paidCount} Start Lunas
                                  </span>
                                )}
                              </div>
                              <p className="text-zinc-500 text-xs uppercase tracking-wider">Rp {Number(cls.registration_fee).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex items-center gap-4 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                              <button
                                onClick={() => handleClassCountChange(cls, -1)}
                                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-white font-bold min-w-[20px] text-center">{count}</span>
                              <button
                                onClick={() => handleClassCountChange(cls, 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#D32F2F] hover:text-[#D32F2F]/80 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          {count > 0 && (
                            <div className="mt-4 pt-4 border-t border-zinc-700/50 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Merek Motor</label>
                                  <input
                                    type="text"
                                    value={entries[0].motorcycleBrand}
                                    onChange={(e) => updateClassTechDetails(cls.id, 'motorcycleBrand', e.target.value)}
                                    placeholder="Contoh: Honda"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">No. Rangka (4 Angka Terakhir)</label>
                                  <input
                                    type="text"
                                    maxLength={4}
                                    value={entries[0].frameNumber}
                                    onChange={(e) => updateClassTechDetails(cls.id, 'frameNumber', e.target.value)}
                                    placeholder="0000"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">No. Mesin (4 Angka Terakhir)</label>
                                  <input
                                    type="text"
                                    maxLength={4}
                                    value={entries[0].engineNumber}
                                    onChange={(e) => updateClassTechDetails(cls.id, 'engineNumber', e.target.value)}
                                    placeholder="0000"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Supporting Classes Section */}
              {availableClasses.filter(c => c.class_category === 'supporting-class').length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest border-l-2 border-zinc-700 pl-3">Kelas Supporting</h3>
                  <div className="space-y-4">
                    {availableClasses.filter(c => c.class_category === 'supporting-class').map((cls) => {
                      const entries = classEntries.filter(e => e.classId === cls.id);
                      const count = entries.length;

                      const paidCount = selectedRiderForClass?.rider_class_registrations?.filter(
                        r => r.race_classes?.id === cls.id && r.payment_status === 'paid'
                      ).length || 0;

                      return (
                        <div key={cls.id} className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold">{cls.class_name}</h4>
                                {paidCount > 0 && (
                                  <span className="text-green-500 bg-green-500/10 border border-green-500/20 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                                    {paidCount} Start Lunas
                                  </span>
                                )}
                              </div>
                              <p className="text-zinc-500 text-xs uppercase tracking-wider">Rp {Number(cls.registration_fee).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex items-center gap-4 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                              <button
                                onClick={() => handleClassCountChange(cls, -1)}
                                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-white font-bold min-w-[20px] text-center">{count}</span>
                              <button
                                onClick={() => handleClassCountChange(cls, 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#D32F2F] hover:text-[#D32F2F]/80 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          {count > 0 && (
                            <div className="mt-4 pt-4 border-t border-zinc-700/50 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Merek Motor</label>
                                  <input
                                    type="text"
                                    value={entries[0].motorcycleBrand}
                                    onChange={(e) => updateClassTechDetails(cls.id, 'motorcycleBrand', e.target.value)}
                                    placeholder="Contoh: Honda"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">No. Rangka (4 Angka Terakhir)</label>
                                  <input
                                    type="text"
                                    maxLength={4}
                                    value={entries[0].frameNumber}
                                    onChange={(e) => updateClassTechDetails(cls.id, 'frameNumber', e.target.value)}
                                    placeholder="0000"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">No. Mesin (4 Angka Terakhir)</label>
                                  <input
                                    type="text"
                                    maxLength={4}
                                    value={entries[0].engineNumber}
                                    onChange={(e) => updateClassTechDetails(cls.id, 'engineNumber', e.target.value)}
                                    placeholder="0000"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D32F2F]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Total Biaya Pendaftaran</span>
                  <span className="text-zinc-400 text-[10px] italic">Termasuk kelas yang sudah didaftarkan (pending)</span>
                </div>
                <span className="text-2xl font-bold text-[#D32F2F]">
                  Rp {classEntries.reduce((sum, e) => sum + e.fee, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <button
                onClick={async () => {
                  setIsSubmittingClass(true);
                  try {
                    await registerRiderClass(
                      selectedRiderForClass.id,
                      eventId || 0,
                      classEntries.map(e => ({
                        classId: e.classId,
                        category: e.category,
                        motorcycleBrand: e.motorcycleBrand,
                        frameNumber: e.frameNumber,
                        engineNumber: e.engineNumber,
                        startNumber: e.startNumber,
                        registrationFee: e.fee
                      }))
                    );
                    setAddClassModalOpen(false);
                    setClassEntries([]);
                    if (onRefresh) {
                      onRefresh();
                    } else {
                      router.refresh();
                    }
                    alert('Kelas berhasil ditambahkan!');
                  } catch (err: any) {
                    alert(err.message);
                  } finally {
                    setIsSubmittingClass(false);
                  }
                }}
                disabled={isSubmittingClass}
                className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingClass ? 'Memproses...' : 'Daftarkan Kelas'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {riders.map((rider) => {
          // Status Pembayaran
          const payments = rider.rider_payments || [];
          const registrations = rider.rider_class_registrations || [];
          
          const hasPaid = registrations.some(r => r.payment_status === 'paid');
          const isAllPaid = registrations.length > 0 && registrations.every(r => r.payment_status === 'paid');
          const hasPending = registrations.some(r => r.payment_status === 'pending');
          const hasRefundPending = registrations.some(r => r.payment_status === 'refund_pending');
          const hasRefunded = registrations.some(r => r.payment_status === 'refunded');
          const hasCancelled = registrations.some(r => r.payment_status === 'cancelled');

          let badgeColor = 'bg-zinc-800 text-zinc-400';
          let badgeText = 'Belum Ada Transaksi';
          let canPay = false;
          let canCancel = false;

          if (isAllPaid) {
            badgeColor = 'bg-green-500/10 text-green-500 border border-green-500/20';
            badgeText = 'SUDAH LUNAS';
            canCancel = false;
          } else if (hasPending) {
            badgeColor = 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
            badgeText = 'MENUNGGU PEMBAYARAN';
            canPay = true;
            canCancel = !hasPaid;
          } else if (hasPaid) {
            badgeColor = 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
            badgeText = 'SEBAGIAN LUNAS';
            canCancel = false;
          } else if (hasRefundPending) {
            badgeColor = 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
            badgeText = 'PROSES REFUND';
          } else if (hasRefunded) {
            badgeColor = 'bg-red-500/10 text-red-500 border border-red-500/20';
            badgeText = 'DIKEMBALIKAN (REFUND)';
          } else if (hasCancelled) {
            badgeColor = 'bg-red-500/10 text-red-500 border border-red-500/20';
            badgeText = 'DIBATALKAN';
          }

          // Untuk dapat event_id saat fetch QRIS (kita ambil dari kelas pertama aja, karena semuanya 1 event di halaman ini)
          const eventId = rider.rider_class_registrations?.[0]?.race_classes?.event_id;

          return (
            <div
              key={rider.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex flex-col">
                      <h3 className="text-xl font-bold text-white">{rider.name}</h3>
                      {rider.reg_number && (
                        <span className="text-[#D32F2F] text-xs font-mono font-bold uppercase tracking-widest mt-1">
                          {rider.reg_number}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}>
                      {badgeText}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                    <div>
                      <span className="text-zinc-500 block text-xs">Kota</span>
                      <span className="text-zinc-300">{rider.city}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs">Team</span>
                      <span className="text-zinc-300">{rider.team_name}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs">KIS</span>
                      <span className="text-zinc-300 font-mono">{rider.kis_number || '-'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs">NIK</span>
                      <span className="text-zinc-300 font-mono">{rider.id_number || '-'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs">Total Start</span>
                      <span className="text-[#D32F2F] font-bold">{registrations.length} Start</span>
                    </div>
                  </div>
                </div>

                  {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAddClassModal(rider)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#D32F2F]/10 hover:bg-[#D32F2F]/20 text-[#D32F2F] rounded-lg transition-all text-xs font-bold uppercase tracking-wider border border-[#D32F2F]/20"
                  >
                    <PlusCircle size={14} />
                    Tambah Kelas
                  </button>
                  {canCancel && (
                    <button
                      onClick={() => handleCancelClick(rider)}
                      className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all"
                      title="Batalkan Pendaftaran"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  <Link
                    href={`/register/rider/edit/${rider.id}`}
                    className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </Link>
                  {!hasPaid && (
                    <button
                      onClick={() => handleDeleteClick(rider)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Class Registrations */}
              {rider.rider_class_registrations && rider.rider_class_registrations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <h4 className="text-sm font-semibold text-zinc-400 mb-3">Kelas Terdaftar:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(
                      rider.rider_class_registrations.reduce((acc: any, reg: any) => {
                        const key = reg.race_classes?.id;
                        if (!acc[key]) {
                          acc[key] = { 
                            ...reg, 
                            count: 0, 
                            startNumbers: [],
                            paymentStatuses: new Set()
                          };
                        }
                        acc[key].count += 1;
                        acc[key].paymentStatuses.add(reg.payment_status);
                        if (reg.start_number) acc[key].startNumbers.push(reg.start_number);
                        return acc;
                      }, {})
                    ).map((group: any) => {
                      const hasPending = group.paymentStatuses.has('pending');
                      const hasPaid = group.paymentStatuses.has('paid');
                      
                      let statusText = 'Pending';
                      let statusColor = 'text-yellow-400';
                      
                      if (hasPaid && !hasPending) {
                        statusText = 'Lunas';
                        statusColor = 'text-green-400';
                      } else if (hasPaid && hasPending) {
                        statusText = 'Sebagian Lunas';
                        statusColor = 'text-blue-400';
                      } else if (group.paymentStatuses.has('cancelled')) {
                        statusText = 'Dibatalkan';
                        statusColor = 'text-red-400';
                      } else if (group.paymentStatuses.has('refunded')) {
                        statusText = 'Refunded';
                        statusColor = 'text-red-400';
                      } else if (group.paymentStatuses.has('refund_pending')) {
                        statusText = 'Proses Refund';
                        statusColor = 'text-orange-400';
                      }

                      return (
                        <div
                          key={group.id}
                          onClick={() => openAddClassModal(rider)}
                          className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-xs w-full sm:w-auto min-w-[150px] cursor-pointer hover:border-[#D32F2F]/50 hover:bg-zinc-800 transition-all group relative"
                        >
                          <div className="text-white font-semibold mb-1 flex items-center justify-between gap-2 pr-8">
                            <div className="flex flex-col min-w-0">
                              <span className="truncate">{group.race_classes?.class_name}</span>
                              {group.startNumbers.length > 0 && (
                                <span className="text-[#D32F2F] text-sm font-mono font-bold mt-1">
                                  #{group.startNumbers.sort((a: any, b: any) => a.localeCompare(b, undefined, {numeric: true})).join(', #')}
                                </span>
                              )}
                            </div>
                            <span className="bg-[#D32F2F] text-white text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">
                              {group.count} Start
                            </span>
                          </div>
                          <div className="text-zinc-500 text-[10px] pr-8">
                            {group.motorcycle_brand || '-'} • {group.frame_number || '-'} • {group.engine_number || '-'} •{' '}
                            <span className={statusColor}>
                              {statusText}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTechEditData({
                                riderId: rider.id,
                                classId: group.race_classes.id,
                                className: group.race_classes.class_name,
                                brand: group.motorcycle_brand || '',
                                frame: group.frame_number || '',
                                engine: group.engine_number || ''
                              });
                              setEditTechModalOpen(true);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-800 border border-zinc-700 text-zinc-400 p-1.5 rounded-full transition-colors hover:text-white hover:border-[#D32F2F] shadow-lg"
                            title="Edit Detail Kendaraan"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
