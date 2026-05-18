import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getUpcomingEvents, type EventItem } from "@/lib/data/events";

function formatDateRange(startIso: string, endIso: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const start = new Date(startIso).toLocaleDateString("id-ID", opts);
  const end = new Date(endIso).toLocaleDateString("id-ID", opts);
  return start === end ? start : `${start} – ${end}`;
}

function EventCard({ evt }: { evt: EventItem }) {
  return (
    <div
      data-reveal
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl hover:border-[#D32F2F]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(211,47,47,0.08)]"
    >
      {/* Thumbnail */}
      <div className="relative w-full group">
        <div className="relative h-60 w-full bg-black overflow-hidden rounded-t-xl">
          <Image
            src={evt.imageUrl || "https://images.unsplash.com/photo-1613246273006-7f7476e693d9?q=80&w=2670&auto=format&fit=crop"}
            alt={evt.title}
            fill
            className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-105"
            style={{ transform: "translateZ(0) scale(1.01)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-80 transition-opacity duration-300" />
        </div>

        {evt.overlayImage && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 z-20 pointer-events-none opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500">
            <Image
              src={evt.overlayImage}
              alt="Overlay"
              fill
              className="object-contain brightness-0 invert"
            />
          </div>
        )}

        <div className="absolute top-4 right-4 bg-anova-red text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider z-10 shadow-lg">
          {evt.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <h4 className="text-2xl font-bold text-white mb-4 uppercase">{evt.title}</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-zinc-300">
          <div className="flex items-center gap-3">
            <Calendar className="text-anova-red shrink-0" size={20} />
            <span>{formatDateRange(evt.startDate, evt.endDate)}</span>
          </div>
          {evt.timeInfo && (
            <div className="flex items-center gap-3">
              <Clock className="text-anova-red shrink-0" size={20} />
              <span>{evt.timeInfo}</span>
            </div>
          )}
          {evt.location && (
            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="text-anova-red shrink-0 mt-0.5" size={20} />
              <span>{evt.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/register?event=${evt.slug}`}
            className="flex-1 bg-anova-red hover:bg-anova-red-hover text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-95 text-center block"
          >
            Daftar Online
          </Link>
          {evt.regulationFileUrl ? (
            <a
              href={evt.regulationFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-95 text-center"
            >
              Detail &amp; Regulasi
            </a>
          ) : (
            <Link
              href={`/events`}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-95 text-center"
            >
              Detail &amp; Regulasi
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function UpcomingEventsSection() {
  const events = await getUpcomingEvents(2);

  if (events.length === 0) {
    return (
      <div className="py-10 border border-zinc-800 border-dashed rounded-xl text-center text-zinc-500">
        Belum ada event yang dijadwalkan dalam waktu dekat.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {events.map((evt) => (
        <EventCard key={evt.id} evt={evt} />
      ))}
    </div>
  );
}
