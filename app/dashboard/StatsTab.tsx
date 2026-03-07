"use client";

import { Users, CreditCard, Activity, TrendingUp, Trophy, CalendarDays, ArrowUpRight } from "lucide-react";

export function StatsTab() {
  // Dummy data
  const kpiData = [
    { label: "Total Peserta", value: "482", trend: "+12.5%", isPositive: true, icon: Users },
    { label: "Pendapatan Tiket & Reg", value: "Rp 128.5 Jt", trend: "+24.1%", isPositive: true, icon: CreditCard },
    { label: "Kelas Terdaftar", value: "18", trend: "Tetap", isPositive: true, icon: Trophy },
    { label: "Event Aktif", value: "2", trend: "+1", isPositive: true, icon: CalendarDays },
  ];

  const popularClasses = [
    { name: "Underbone 150cc", count: 86, percentage: 85 },
    { name: "Matic 130cc Std", count: 72, percentage: 70 },
    { name: "Sport 150cc 2T", count: 64, percentage: 60 },
    { name: "Bracket 9 Detik", count: 58, percentage: 55 },
    { name: "Bebek 4T 130cc", count: 41, percentage: 40 },
  ];

  const recentTransactions = [
    { id: "TRX-091", user: "Bintang N.", amount: "Rp 350.000", status: "Sukses", date: "Hari Ini, 14:30" },
    { id: "TRX-090", user: "Andi W.", amount: "Rp 350.000", status: "Sukses", date: "Hari Ini, 11:15" },
    { id: "TRX-089", user: "Budi T.", amount: "Rp 700.000", status: "Sukses", date: "Kemarin, 09:20" },
    { id: "TRX-088", user: "Yoga R.", amount: "Rp 350.000", status: "Pending", date: "Kemarin, 16:45" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="font-teko text-3xl md:text-4xl font-bold text-white uppercase italic">
          Statistik Dashboard
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Ringkasan analitik pendaftaran peserta, transaksi, dan popularitas kelas event.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-br from-white to-transparent w-32 h-32 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Icon size={20} className="text-[#D32F2F]" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {kpi.trend} <TrendingUp size={12} />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white font-teko tracking-wide">{kpi.value}</h3>
                <p className="text-zinc-500 text-sm font-medium">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Classes Bar Chart */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-[#D32F2F]" />
              Kelas Terpopuler
            </h2>
            <select className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs rounded-md px-2 py-1 outline-none">
              <option>Bulan Ini</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          <div className="space-y-5">
            {popularClasses.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-zinc-300 font-semibold">{item.name}</span>
                  <span className="text-zinc-500 font-mono">{item.count} Peserta</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800/50">
                  <div 
                    className="bg-gradient-to-r from-[#D32F2F] to-orange-500 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl flex flex-col shadow-xl">
          <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard size={18} className="text-[#D32F2F]" />
              Transaksi Terbaru
            </h2>
            <button className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
              Lihat Semua <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-[300px] space-y-4">
            {recentTransactions.map((trx, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${trx.status === 'Sukses' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {trx.user.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{trx.user}</h4>
                    <p className="text-xs text-zinc-500">{trx.id} • {trx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white mb-0.5">{trx.amount}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${trx.status === 'Sukses' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {trx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
