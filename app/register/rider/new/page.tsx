'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { submitRiderRegistration } from '../actions';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Minus, X, AlertCircle, User, MapPin, Calendar, CreditCard, Bike, CheckCircle2, Clock, Loader2 } from 'lucide-react';

// Force dynamic rendering for pages with useSearchParams
export const dynamic = 'force-dynamic';

interface RaceClass {
  id: string;
  event_id: number;
  class_category: 'main-class' | 'supporting-class';
  class_name: string;
  registration_fee: number;
  is_active: boolean;
}

interface ClassEntry {
  id: string;
  classId: string;
  className: string;
  classCategory: string;
  category: string;
  motorcycleBrand: string;
  frameNumber: string;
  engineNumber: string;
  startNumber: string;
  fee: number;
}

interface EventData {
  id: number;
  title: string;
  slug: string;
  category: string;
  start_date: string;
  end_date: string;
  time_info: string;
  location: string;
  description: string;
  image_url: string;
  status: string;
}

// Removed HARDCODED_EVENTS to use database data

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function EventDetailsCard({ event }: { event: EventData }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm mb-8">
      <div className="relative w-full">
        <div className="relative h-48 w-full bg-black">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="absolute top-4 right-4 bg-anova-red text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider z-10 shadow-lg">
          {event.category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 uppercase">{event.title}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-300 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="text-anova-red shrink-0" size={16} />
            <span>
              {new Date(event.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              {!event.end_date && new Date(event.start_date).toLocaleDateString('id-ID', { year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-anova-red shrink-0" size={16} />
            <span>{event.time_info}</span>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin className="text-anova-red shrink-0 mt-0.5" size={16} />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterRiderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const eventSlug = searchParams.get('event');
  
  // Form state
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [city, setCity] = useState('');
  const [teamName, setTeamName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [kisNumber, setKisNumber] = useState('');
  const [ktaNumber, setKtaNumber] = useState('');
  
  // Event state
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Loading and submission
  const [isLoading, setIsLoading] = useState(true);
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

  // Load events and manager profile
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Load all upcoming events
        const { data: activeEvents } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'upcoming')
          .order('start_date', { ascending: true });

        if (activeEvents) {
          setEvents(activeEvents as EventData[]);
          
          // If slug exists in URL, auto-select it
          if (eventSlug) {
            const matchedEvent = activeEvents.find(e => e.slug === eventSlug);
            if (matchedEvent) {
              setSelectedEvent(matchedEvent as EventData);
            }
          }
        }

        // Get manager profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: manager } = await supabase
            .from('profiles')
            .select('team_name')
            .eq('id', user.id)
            .single();

          if (manager) {
            setTeamName(manager.team_name);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [supabase, eventSlug]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('city', city);
    formData.append('province_id', selectedProvinceId);
    formData.append('regency_id', selectedRegencyId);
    formData.append('team_name', teamName);
    formData.append('birth_place', birthPlace);
    formData.append('birth_date', birthDate);
    formData.append('id_number', idNumber);
    formData.append('kis_number', kisNumber);
    formData.append('kta_number', ktaNumber);
    formData.append('event_id', selectedEvent?.id.toString() || '');
    formData.append('classes', JSON.stringify([]));

    try {
      const result = await submitRiderRegistration(null, formData);
      if (result.success) {
        router.push(`/register/dashboard/events/${selectedEvent?.id}`);
      } else {
        setSubmitError(result.message);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D32F2F]/30 border-t-[#D32F2F] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <div className="w-full bg-zinc-950 border-b border-zinc-800 py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Link 
              href={selectedEvent ? `/register/dashboard/events/${selectedEvent.id}` : "/register/dashboard"} 
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Kembali ke Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="flex items-center gap-3 justify-center mb-4">
                <div className="h-[2px] w-8 bg-[#D32F2F]" />
                <span className="text-[#D32F2F] text-xs font-bold uppercase tracking-widest">
                  Registration Portal
                </span>
                <div className="h-[2px] w-8 bg-[#D32F2F]" />
              </div>
              <h1 className="font-teko text-4xl md:text-6xl font-bold uppercase italic text-white mb-2">
                DAFTARKAN PEMBALAP
              </h1>
              <p className="text-zinc-400 text-sm max-w-lg mx-auto">
                Silakan pilih event dan isi data pembalap untuk melakukan pendaftaran.
              </p>
            </div>

            {/* Event Selection */}
            {!eventSlug && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20 flex items-center justify-center">
                    <Calendar size={20} className="text-[#D32F2F]" />
                  </div>
                  <h2 className="text-xl font-bold text-white italic uppercase font-teko">Pilih Event Balap</h2>
                </div>

                {selectedEvent ? (
                  <EventDetailsCard event={selectedEvent} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.length > 0 ? (
                      events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className="text-left bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-anova-red/50 transition-all group"
                        >
                          <div className="relative h-40 w-full">
                            <Image
                              src={event.image_url || '/event-placeholder.jpg'}
                              alt={event.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                              <span className="bg-anova-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                                {event.category}
                              </span>
                              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 uppercase italic font-teko">
                                {event.title}
                              </h3>
                            </div>
                          </div>
                          <div className="p-4 flex items-center justify-between text-xs text-zinc-400">
                            <div className="flex items-center gap-2">
                              <MapPin size={12} className="text-anova-red" />
                              <span className="truncate max-w-[150px]">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={12} className="text-anova-red" />
                              <span>
                                {new Date(event.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl p-12 text-center">
                        <p className="text-zinc-500">Tidak ada event aktif saat ini.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Compact Event Info when redirected from Dashboard */}
            {eventSlug && selectedEvent && (
              <div className="mb-8 bg-zinc-900/80 border border-anova-red/30 rounded-2xl p-6 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-zinc-800">
                    <Image
                      src={selectedEvent.image_url || '/event-placeholder.jpg'}
                      alt={selectedEvent.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-anova-red uppercase tracking-widest">{selectedEvent.category}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        {new Date(selectedEvent.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        {selectedEvent.end_date && ` - ${new Date(selectedEvent.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white uppercase italic font-teko leading-none">{selectedEvent.title}</h2>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                      <MapPin size={10} className="text-anova-red" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            {selectedEvent ? (
              <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm space-y-8">
                {/* Error Message */}
                {submitError && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                )}

              {/* Section 1: Data Pembalap */}
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

                  {/* Team/Club */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Team/Club
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-400 px-4 py-3 rounded-lg cursor-not-allowed"
                      placeholder="Auto-filled"
                      readOnly
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
                      }}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                    >
                      <option value="">Pilih Provinsi</option>
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
                      disabled={!selectedProvinceId}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors disabled:opacity-50"
                    >
                      <option value="">Pilih Kabupaten/Kota</option>
                      {regencies.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    {/* Hidden input to store the name in 'city' column */}
                    <input type="hidden" name="city" value={city} />
                  </div>


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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan Pembalap'}
              </button>
              </form>
            ) : (
              <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="text-zinc-600 rotate-90" size={24} />
                </div>
                <h3 className="text-white font-bold mb-2 uppercase italic font-teko text-xl">Event Belum Dipilih</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                  Silakan pilih salah satu event balap aktif di atas untuk melanjutkan pengisian data pendaftaran.
                </p>
              </div>
            )}
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

export default function RegisterRiderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-anova-red animate-spin" />
      </div>
    }>
      <RegisterRiderContent />
    </Suspense>
  );
}
