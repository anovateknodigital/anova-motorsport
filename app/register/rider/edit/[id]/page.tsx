'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateRiderRegistration } from '../../actions';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Plus, Minus, X, AlertCircle, User, MapPin, Calendar,
  CreditCard, Bike, CheckCircle2, Clock, Loader2, Save,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ─── Types ────────────────────────────────────────────────────────
interface RiderData {
  id: string;
  name: string;
  city: string;
  province_id: string | null;
  regency_id: string | null;
  team_name: string;
  birth_place: string;
  birth_date: string;
  kis_number: string | null;
  kta_number: string | null;
  id_number: string | null;
}

// ─── Event card banner ────────────────────────────────────────────
function PageBanner() {
  return (
    <div className="w-full bg-zinc-900 border-b border-zinc-800 py-10 mb-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(211,47,47,0.12),transparent_70%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-[2px] w-8 bg-[#D32F2F] block" />
          <span className="text-[#D32F2F] text-xs font-bold uppercase tracking-widest">Edit Pembalap</span>
        </div>
        <h1 className="font-teko text-4xl md:text-5xl font-bold uppercase italic text-white leading-none">
          EDIT DATA<br />
          <span className="text-zinc-500">PEMBALAP</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-3">
          Perbarui informasi pembalap dan pilihan kelas pendaftaran.
        </p>
      </div>
    </div>
  );
}

// ─── Main Edit Page ───────────────────────────────────────────────
export default function EditRiderPage() {
  const router = useRouter();
  const params = useParams();
  const riderId = params?.id as string;
  const supabase = createClient();

  // ── Rider fields ──
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [teamName, setTeamName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [kisNumber, setKisNumber] = useState('');
  const [ktaNumber, setKtaNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');


  // ── State ──
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Location data
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [regencies, setRegencies] = useState<{ id: string; name: string }[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedRegencyId, setSelectedRegencyId] = useState<string>('');

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('/api/location/provinces');
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch regencies when province changes
  useEffect(() => {
    if (!selectedProvinceId) {
      setRegencies([]);
      return;
    }
    const fetchRegencies = async () => {
      try {
        const res = await fetch(`/api/location/regencies/${selectedProvinceId}`);
        const data = await res.json();
        setRegencies(data);
      } catch (err) {
        console.error('Error fetching regencies:', err);
      }
    };
    fetchRegencies();
  }, [selectedProvinceId]);

  // ── Load rider data ──
  useEffect(() => {
    if (!riderId) return;

    async function loadData() {
      try {
        // Auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/register/login');
          return;
        }

        // Fetch rider
        const { data: rider, error } = await supabase
          .from('riders')
          .select(`
            id, name, city, province_id, regency_id, team_name, birth_place, birth_date, kis_number, kta_number, id_number
          `)
          .eq('id', riderId)
          .eq('manager_id', user.id)
          .single();

        if (error || !rider) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        const r = rider as unknown as RiderData;

        // Populate fields
        setName(r.name);
        setCity(r.city);
        setSelectedProvinceId(r.province_id || '');
        setSelectedRegencyId(r.regency_id || '');
        setTeamName(r.team_name);
        setBirthPlace(r.birth_place);
        setBirthDate(r.birth_date?.slice(0, 10) ?? '');
        setKisNumber(r.kis_number ?? '');
        setKtaNumber(r.kta_number ?? '');
        setIdNumber(r.id_number ?? '');


      } catch (err) {
        console.error('Load error:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riderId]);


  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('team_name', teamName);

    try {
      const result = await updateRiderRegistration(riderId, null, formData);
      if (result && !result.success) {
        setSubmitError(result.message || 'Gagal memperbarui data pembalap');
        setIsSubmitting(false);
      } else {
        setTimeout(() => {
          router.push('/register/dashboard');
        }, 100);
      }
    } catch (err: unknown) {
      const anyErr = err as Record<string, unknown>;
      const isRedirect =
        (anyErr?.digest as string)?.includes?.('NEXT_REDIRECT') ||
        (anyErr?.message as string)?.includes?.('NEXT_REDIRECT') ||
        (anyErr?.message as string)?.includes?.('redirect');
      
      const isExtensionError = 
        (anyErr?.message as string)?.includes?.('message channel closed') || 
        (anyErr?.message as string)?.includes?.('A listener indicated an asynchronous response');

      if (isRedirect || isExtensionError) return;

      setSubmitError('Terjadi kesalahan saat memproses pembaruan');
      setIsSubmitting(false);
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-[#D32F2F]" />
          <p className="text-zinc-400 text-sm">Memuat data pembalap...</p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (notFound) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-red-400" />
          </div>
          <h2 className="font-teko text-3xl font-bold text-white uppercase italic mb-2">
            Pembalap Tidak Ditemukan
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Data pembalap tidak ada atau Anda tidak memiliki akses untuk mengeditnya.
          </p>
          <Link
            href="/register/dashboard"
            className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-3 rounded-lg font-bold transition-all"
          >
            <ArrowLeft size={16} />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Back nav */}
      <div className="w-full bg-zinc-950 border-b border-zinc-800 py-4">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Link
            href="/register/dashboard"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>

      <div className="flex-1">
        <PageBanner />

        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
          <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm space-y-8">

            {/* Error */}
            {submitError && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{submitError}</p>
              </div>
            )}

            {/* ─ Section 1: Data Pembalap ─────────────────────── */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20 flex items-center justify-center">
                  <User size={20} className="text-[#D32F2F]" />
                </div>
                <h2 className="text-xl font-bold text-white">Data Pembalap</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Nama Pembalap <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                    placeholder="Nama lengkap pembalap"
                  />
                </div>

                {/* NIK */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    NIK (Nomor Induk Kependudukan) <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                    placeholder="16 digit NIK"
                    maxLength={16}
                  />
                </div>

                {/* Team (read-only) */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Team/Club
                  </label>
                  <input
                    type="text"
                    name="team_name"
                    value={teamName}
                    readOnly
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-400 px-4 py-3 rounded-lg cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>

                {/* Birth Place */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Tempat Lahir <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    name="birth_place"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                    placeholder="Tempat lahir"
                  />
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Tanggal Lahir <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>

                {/* Province Selection */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Provinsi <span className="text-[#D32F2F]">*</span>
                  </label>
                  <select
                    name="province_id"
                    value={selectedProvinceId}
                    onChange={(e) => {
                      setSelectedProvinceId(e.target.value);
                      setSelectedRegencyId('');
                      if (e.target.value !== '') {
                        setCity('');
                      }
                    }}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                  >
                    <option value="">
                      {city && !selectedProvinceId ? '(Pilih ulang Provinsi jika ingin mengubah Kota)' : 'Pilih Provinsi'}
                    </option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* City/Regency Selection */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Kabupaten/Kota <span className="text-[#D32F2F]">*</span>
                  </label>
                  <select
                    name="regency_id"
                    value={selectedRegencyId}
                    onChange={(e) => {
                      setSelectedRegencyId(e.target.value);
                      const selectedRegency = regencies.find(r => r.id === e.target.value);
                      if (selectedRegency) setCity(selectedRegency.name);
                    }}
                    required
                    disabled={!selectedProvinceId && !selectedRegencyId}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors disabled:opacity-50"
                  >
                    <option value="">Pilih Kabupaten/Kota</option>
                    {selectedRegencyId && (!regencies || !regencies.find((r) => r.id === selectedRegencyId)) && city && (
                      <option value={selectedRegencyId}>{city}</option>
                    )}
                    {regencies.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  <input type="hidden" name="city" value={city} />
                </div>

                {/* KIS */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    No. KIS (Kartu Izin Start)
                  </label>
                  <input
                    type="text"
                    name="kis_number"
                    value={kisNumber}
                    onChange={(e) => setKisNumber(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                    placeholder="Opsional"
                  />
                </div>

                {/* KTA */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    No. KTA (Kartu Tanda Anggota)
                  </label>
                  <input
                    type="text"
                    name="kta_number"
                    value={ktaNumber}
                    onChange={(e) => setKtaNumber(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                    placeholder="Opsional"
                  />
                </div>
              </div>
            </div>
            {/* ─ Actions ──────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/register/dashboard"
                className="flex-1 py-4 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-bold uppercase tracking-wider text-sm transition-all text-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 sm:flex-[2] bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-zinc-950 border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-zinc-500 text-sm">© 2026 Anova Motorsport. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
