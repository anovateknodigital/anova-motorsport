import Image from "next/image";
import Link from "next/link";
import { getEventsList } from "@/lib/data/events";
import { Calendar, Clock, MapPin, ChevronRight, Trophy } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Events | Anova Motorsport",
  description: "Daftar agenda balap profesional Anova Motorsport dan Kejurnas Motoprix.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventsPage() {
  const events = await getEventsList();
  
  // Pisahkan antara upcoming dan past events
  const upcomingEvents = events.filter((e) => e.status === "upcoming").sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const pastEvents = events.filter((e) => e.status === "past").sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen text-white pt-12 pb-20">
        
        {/* Header Hero Section */}
        <div className="w-full bg-zinc-900 border-b border-zinc-800 py-16 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(211,47,47,0.15),transparent_70%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-8 bg-anova-red block" />
                <span className="text-anova-red text-xs font-bold uppercase tracking-widest">Jadwal Balap</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tight text-white leading-none">
                OUR EVENT<br /><span className="text-zinc-600">CALENDAR</span>
              </h1>
            </div>
            <p className="text-zinc-400 max-w-sm text-sm">
              Kami menyelenggarakan ajang balap profesional dengan standar tertinggi IMI dan menelurkan pembalap-pembalap bintang dari sirkuit Sumatera.
            </p>
          </div>
        </div>

        {/* ── UPCOMING EVENTS ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Calendar className="text-anova-red" />
            Agenda Berjalan
          </h2>
          {upcomingEvents.length === 0 ? (
            <div className="text-zinc-500 py-10 border border-zinc-800 border-dashed rounded-lg text-center">
              Belum ada event yang dijadwalkan dalam waktu dekat.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(211,47,47,0.1)] flex flex-col sm:flex-row h-auto sm:h-[320px]">
                  
                  {/* Thumbnail */}
                  <div className="w-full sm:w-[40%] relative aspect-video sm:aspect-auto overflow-hidden bg-black shrink-0">
                    <Image
                      src={evt.imageUrl}
                      alt={evt.title}
                      fill
                      className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-105"
                      style={{ transform: "translateZ(0) scale(1.01)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {evt.overlayImage && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 z-20 pointer-events-none opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500">
                        <Image
                          src={evt.overlayImage}
                          alt="Sirkuit Overlay"
                          fill
                          className="object-contain brightness-0 invert"
                        />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest z-10 shadow-lg">
                      {evt.category}
                    </div>
                  </div>
                  
                  {/* Detail */}
                  <div className="p-6 flex flex-col justify-center flex-1">
                    <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 group-hover:text-anova-red transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                    
                    <div className="space-y-3 text-sm text-zinc-300 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-anova-red opacity-80 shrink-0" />
                        <span>{formatDate(evt.startDate)} - {formatDate(evt.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-anova-red opacity-80 shrink-0" />
                        <span>{evt.timeInfo}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-anova-red opacity-80 shrink-0 mt-0.5" />
                        <span className="leading-snug line-clamp-2">{evt.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex flex-wrap gap-3">
                      <button className="flex-1 min-w-[120px] bg-anova-red hover:bg-anova-red-hover text-white py-2.5 px-4 rounded font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2">
                        Daftar
                        <ChevronRight size={14} />
                      </button>
                      <button className="flex-1 min-w-[120px] bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 px-4 rounded font-bold uppercase tracking-wider text-xs transition-colors border border-zinc-700">
                        Regulasi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── PAST EVENTS ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-zinc-300">
              <Trophy className="text-zinc-600" />
              Event Selesai
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((evt) => (
              <div key={evt.id} className="group bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden hover:bg-zinc-900 transition-colors flex flex-col h-full">
                <div className="relative aspect-video bg-black overflow-hidden pointer-events-none">
                  <Image
                    src={evt.imageUrl}
                    alt={evt.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 scale-[1.01] opacity-70 grayscale group-hover:grayscale-0"
                    style={{ transform: "translateZ(0) scale(1.01)" }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-3 left-3 bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                    Event Selesai
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-lg mb-2 group-hover:text-anova-red transition-colors line-clamp-2">{evt.title}</h4>
                  <div className="text-xs text-zinc-500 mb-4 font-mono">{formatDate(evt.startDate)}</div>
                  <p className="text-sm text-zinc-400 line-clamp-3 mb-6">{evt.description}</p>
                  
                  <button className="mt-auto w-full border border-zinc-800 hover:border-anova-red hover:text-anova-red text-zinc-400 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors">
                    Lihat Hasil Klasemen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
