import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { logoutAction } from '../actions';
import { Users, PlusCircle, LogOut, UserCircle, ArrowLeft } from 'lucide-react';
import RiderList from './RiderList';

export const metadata = {
  title: 'Dashboard Manager | Anova Motorsport',
  description: 'Dashboard manager untuk mengelola pembalap',
};

export default async function ManagerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/register');
  }

  // Get manager profile
  const { data: manager } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If no profile exists, redirect to registration
  if (!manager) {
    redirect('/register/new');
  }

  // Get active events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('start_date', { ascending: true });

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="w-full bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="inline-block">
                <Image
                  src="/anova-motorsport-logo.png"
                  alt="Anova Motorsport"
                  width={150}
                  height={45}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <h1 className="font-teko text-2xl font-bold uppercase italic text-white">
                  MANAGER DASHBOARD
                </h1>
                <p className="text-zinc-500 text-xs">Kelola pendaftaran event balap</p>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 bg-zinc-800 hover:bg-red-500/10 hover:border-red-500/30 border border-zinc-700 text-zinc-400 hover:text-red-400 px-4 py-2 rounded-lg transition-all text-sm font-medium"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Manager Info Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20 flex items-center justify-center shrink-0">
                <UserCircle size={32} className="text-[#D32F2F]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{manager.full_name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500">Team/Club:</span>
                    <p className="text-white font-semibold">{manager.team_name}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">WhatsApp:</span>
                    <p className="text-white font-semibold">{manager.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Event Aktif (Selection View) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20 flex items-center justify-center">
                <PlusCircle size={20} className="text-[#D32F2F]" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase italic font-teko tracking-wider">Pilih Event untuk Dikelola</h2>
            </div>
            
            {events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link 
                    key={event.id} 
                    href={`/register/dashboard/events/${event.id}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-[#D32F2F]/50 transition-all flex flex-col"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={event.image_url || '/event-placeholder.jpg'}
                        alt={event.title}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight uppercase italic font-teko tracking-tight">
                        {event.title}
                      </h3>
                      <div className="space-y-1 text-xs text-zinc-500">
                        <p>{event.location}</p>
                        <p>
                          {new Date(event.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                          {!event.end_date && new Date(event.start_date).toLocaleDateString('id-ID', { year: 'numeric' })}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Klik untuk mengelola</span>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[#D32F2F] group-hover:text-white transition-all">
                          <PlusCircle size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900/30 border border-zinc-800 border-dashed rounded-2xl p-12 text-center">
                <p className="text-zinc-500 italic">Tidak ada event aktif saat ini.</p>
              </div>
            )}
          </div>
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
  );
}
