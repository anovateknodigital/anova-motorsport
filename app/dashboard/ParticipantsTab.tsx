"use client";

import { useState } from "react";
import { Search, Loader2, Download, Printer, Filter, X } from "lucide-react";

export function ParticipantsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("semua");

  // Dummy data sementara menunggu API
  const participants = [
    { 
      id: "P001", 
      name: "Bintang N.", 
      team: "Anova RT", 
      kelas: "Underbone 150cc", 
      status: "Verified", 
      date: "14 Apr 2026",
      event: "ANOVA DRAG BIKE"
    },
    { 
      id: "P002", 
      name: "Andi Wijaya", 
      team: "Privater", 
      kelas: "Bracket 9 Detik", 
      status: "Pending", 
      date: "15 Apr 2026",
      event: "ANOVA DRAG BIKE"
    },
    { 
      id: "P003", 
      name: "Kiki R.", 
      team: "Riau Star Racing", 
      kelas: "Matic 130cc Std", 
      status: "Verified", 
      date: "10 Apr 2026",
      event: "ANOVA DRAG BIKE"
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-teko text-3xl md:text-4xl font-bold text-white uppercase italic">
            Manajemen Peserta
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Kelola data pendaftaran peserta, verifikasi administrasi, dan cetak dokumen peserta.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
            <Printer size={16} />
            Cetak ID Card
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
            <Download size={16} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800/60 bg-zinc-950/50 flex flex-col sm:flex-row justify-between gap-4">
          {/* Tabs Filter */}
          <div className="flex p-1 bg-zinc-900 rounded-lg">
            {["semua", "verified", "pending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                  ${activeTab === tab 
                    ? "bg-[#D32F2F] text-white shadow-md" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"}
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Cari nama, tim, atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D32F2F] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950 border-b border-zinc-800/80 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold">ID Reg</th>
                <th className="px-6 py-4 font-bold">Data Pembalap</th>
                <th className="px-6 py-4 font-bold">Event & Kelas</th>
                <th className="px-6 py-4 font-bold mt-1 text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-zinc-300">
                    {p.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-bold leading-none mb-1">{p.name}</p>
                    <p className="text-xs text-zinc-500">{p.team}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-300 leading-none mb-1">{p.event}</p>
                    <p className="text-xs text-zinc-500">{p.kelas}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${p.status === "Verified" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-semibold text-[#D32F2F] hover:text-white bg-[#D32F2F]/10 hover:bg-[#D32F2F] px-3 py-1.5 rounded transition-all">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
