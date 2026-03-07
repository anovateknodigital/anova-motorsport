import { createClient } from "@/lib/supabase/server";
import { Clock, Calendar, Users, TrendingUp, Trophy, Flag, MapPin, Zap, FileText } from "lucide-react";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";

  const upcomingEvents = [
    {
      name: "ANOVA DRAG BIKE / DRAG RACE",
      type: "Drag Race",
      date: "17 - 18 April 2026",
      location: "Bangkinang, Kampar",
      registered: 142,
      capacity: 200,
      status: "open",
    },
    {
      name: "KEJURNAS ANOVA MOTOPRIX",
      type: "Motoprix",
      date: "30 - 31 Mei 2026",
      location: "Sirkuit Bangkinang",
      registered: 87,
      capacity: 150,
      status: "open",
    },
  ];

  const recentRegistrations = [
    { name: "Bintang Nugraha", team: "Anova RT", class: "Underbone 150cc", time: "2 jam lalu" },
    { name: "Reza Valentino", team: "Team Kampar", class: "Drag Bracket 9s", time: "4 jam lalu" },
    { name: "Dimas Pratama", team: "Riau Speed", class: "Motoprix Senior", time: "6 jam lalu" },
    { name: "Agus Salim", team: "Bangkinang RC", class: "Underbone 155cc", time: "1 hari lalu" },
  ];

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-teko text-3xl md:text-4xl font-bold text-white uppercase italic">
            Dashboard Overview
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Selamat datang kembali,{" "}
            <span className="text-zinc-300">{displayName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock size={12} />
            Kamis, 6 Maret 2026
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Event Aktif",
            value: "2",
            sub: "+1 dari bulan lalu",
            icon: Calendar,
            color: "text-[#D32F2F]",
            bg: "bg-[#D32F2F]/10",
          },
          {
            label: "Total Peserta",
            value: "229",
            sub: "Dari 2 event aktif",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
          },
          {
            label: "Pendaftaran Baru",
            value: "18",
            sub: "Dalam 7 hari terakhir",
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
          },
          {
            label: "Event Selesai",
            value: "50+",
            sub: "Total terlaksana",
            icon: Trophy,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
          },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-4 md:p-5"
          >
            <div
              className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}
            >
              <Icon size={18} className={color} />
            </div>
            <p className="text-zinc-500 text-xs font-medium mb-1">
              {label}
            </p>
            <p className={`font-teko text-3xl font-bold ${color}`}>
              {value}
            </p>
            <p className="text-zinc-600 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Flag size={16} className="text-[#D32F2F]" />
              Event Mendatang
            </h2>
            <button className="text-[#D32F2F] text-xs font-semibold hover:underline">
              Lihat Semua
            </button>
          </div>

          {upcomingEvents.map((event) => {
            const progress = Math.round(
              (event.registered / event.capacity) * 100
            );
            return (
              <div
                key={event.name}
                className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {event.type}
                      </span>
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Buka
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm">
                      {event.name}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-zinc-600" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-zinc-600" />
                    {event.location}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-500">Kuota Terisi</span>
                    <span className="text-zinc-300 font-semibold">
                      {event.registered} / {event.capacity}
                      <span className="text-zinc-600 font-normal ml-1">
                        ({progress}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D32F2F] to-[#ff5252] rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Zap size={16} className="text-[#D32F2F]" />
              Pendaftaran Terbaru
            </h2>
            <button className="text-[#D32F2F] text-xs font-semibold hover:underline">
              Lihat Semua
            </button>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl overflow-hidden">
            {recentRegistrations.map((reg, i) => (
              <div
                key={reg.name}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  i < recentRegistrations.length - 1
                    ? "border-b border-zinc-800/60"
                    : ""
                } hover:bg-zinc-800/30 transition-colors`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D32F2F]/30 to-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <span className="text-[#D32F2F] font-bold text-sm">
                    {reg.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-200 text-sm font-semibold truncate">
                    {reg.name}
                  </p>
                  <p className="text-zinc-500 text-xs truncate">
                    {reg.team} · {reg.class}
                  </p>
                </div>
                <span className="text-zinc-600 text-[10px] shrink-0">
                  {reg.time}
                </span>
              </div>
            ))}

            <div className="px-4 py-3 text-center border-t border-zinc-800/60">
              <button className="text-[#D32F2F] text-xs font-semibold hover:underline">
                Lihat semua pendaftaran →
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-3">
              Aksi Cepat
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Tambah Event", icon: Calendar },
                { label: "Tambah Peserta", icon: Users },
                { label: "Input Hasil", icon: Trophy },
                { label: "Export Data", icon: FileText },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-3 py-2.5 rounded-lg transition-all"
                >
                  <Icon size={13} className="text-[#D32F2F]" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
