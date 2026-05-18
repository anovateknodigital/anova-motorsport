'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LogIn, UserPlus, Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

// Force dynamic rendering for pages with useSearchParams
export const dynamic = 'force-dynamic';

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


function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function EventDetails({ event }: { event: EventData }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm mb-8">
      <div className="relative w-full">
        <div className="relative h-60 w-full bg-black">
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
        <h3 className="text-2xl font-bold text-white mb-4 uppercase">{event.title}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-zinc-300 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="text-anova-red shrink-0" size={18} />
            <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-anova-red shrink-0" size={18} />
            <span>{event.time_info}</span>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin className="text-anova-red shrink-0 mt-0.5" size={18} />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-zinc-400 text-sm">{event.description}</p>
      </div>
    </div>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('event');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      if (!eventSlug) {
        setIsLoading(false);
        return;
      }

      // Cek database
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('slug', eventSlug)
          .single();

        if (data) {
          setSelectedEvent(data as EventData);
        }
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [eventSlug]);

  return (
    <div className="w-full max-w-4xl">
      {/* Event Details (if selected) */}
      {isLoading ? (
        <div className="mb-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl h-96 animate-pulse" />
      ) : selectedEvent ? (
        <>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft size={16} />
            Kembali
          </Link>
          <EventDetails event={selectedEvent} />
        </>
      ) : null}

      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="h-[2px] w-8 bg-[#D32F2F]" />
          <span className="text-[#D32F2F] text-xs font-bold uppercase tracking-widest">
            Manager Registration
          </span>
          <div className="h-[2px] w-8 bg-[#D32F2F]" />
        </div>
        <h1 className="font-teko text-5xl md:text-7xl font-bold uppercase italic text-white leading-none mb-4">
          MANAGER PORTAL
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          {selectedEvent 
            ? `Daftar atau login sebagai manager untuk mendaftarkan pembalap ke event ${selectedEvent.title}`
            : 'Daftar atau login sebagai manager untuk mendaftarkan pembalap ke event Anova Motorsport'
          }
        </p>
      </div>

      {/* Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Login Card */}
        <Link
          href={`/register/login${eventSlug ? `?event=${eventSlug}` : ''}`}
          className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-[#D32F2F]/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(211,47,47,0.15)] hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LogIn size={32} className="text-[#D32F2F]" />
            </div>

            <h2 className="font-teko text-3xl font-bold uppercase italic text-white mb-3">
              SUDAH TERDAFTAR
            </h2>

            <p className="text-zinc-400 text-sm mb-6">
              Login menggunakan nomor WhatsApp yang sudah terdaftar
            </p>

            <div className="flex items-center gap-2 text-[#D32F2F] font-semibold text-sm group-hover:gap-3 transition-all">
              Login Sekarang
              <span className="text-lg">→</span>
            </div>
          </div>
        </Link>

        {/* Register Card */}
        <Link
          href={`/register/new${eventSlug ? `?event=${eventSlug}` : ''}`}
          className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-[#D32F2F]/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(211,47,47,0.15)] hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UserPlus size={32} className="text-[#D32F2F]" />
            </div>

            <h2 className="font-teko text-3xl font-bold uppercase italic text-white mb-3">
              BELUM TERDAFTAR
            </h2>

            <p className="text-zinc-400 text-sm mb-6">
              Daftar sebagai manager team baru
            </p>

            <div className="flex items-center gap-2 text-[#D32F2F] font-semibold text-sm group-hover:gap-3 transition-all">
              Daftar Sekarang
              <span className="text-lg">→</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <div className="w-full bg-zinc-950 border-b border-zinc-800 py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3">
                <Image
                  src="/anova-motorsport-logo.png"
                  alt="Anova Motorsport"
                  width={150}
                  height={45}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Suspense fallback={
            <div className="w-full max-w-4xl">
              <div className="mb-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl h-96 animate-pulse" />
              <div className="text-center mb-16">
                <div className="h-8 bg-zinc-800 rounded w-48 mx-auto mb-4 animate-pulse" />
                <div className="h-16 bg-zinc-800 rounded w-96 max-w-2xl mx-auto animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />
                <div className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />
              </div>
            </div>
          }>
            <RegisterContent />
          </Suspense>
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
