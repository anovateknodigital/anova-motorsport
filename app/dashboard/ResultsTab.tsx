"use client";

import { useState } from "react";
import { Search, Trophy, Plus, Edit, Trash2, Upload, FileText } from "lucide-react";

export function ResultsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("semua");

  // Dummy data sementara menunggu API
  const results = [
    { 
      id: "R001",
      event: "ANOVA DRAG BIKE",
      kelas: "Bracket 9 Detik",
      status: "Published",
      date: "17 Apr 2026",
      winners: [
        { posisi: 1, nama: "Reza V.", tim: "Anova Drag TEAM", time: "09.012" },
        { posisi: 2, nama: "Budi T.", tim: "Riau Star", time: "09.105" },
        { posisi: 3, nama: "Andi Wijaya", tim: "Privater", time: "09.215" },
      ],
      pdf_url: "#"
    },
    { 
      id: "R002",
      event: "KEJURNAS ANOVA MOTOPRIX",
      kelas: "Underbone 150cc",
      status: "Draft",
      date: "31 Mei 2026",
      winners: [
        { posisi: 1, nama: "Bintang N.", tim: "Anova RT MTR", time: "12:45.012" },
        { posisi: 2, nama: "Kiki R.", tim: "Riau Star Racing", time: "12:46.101" },
      ],
      pdf_url: ""
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-teko text-3xl md:text-4xl font-bold text-white uppercase italic flex items-center gap-3">
             Manajemen Hasil Balap
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Input juara, catat waktu putaran, dan unggah dokumen PDF hasil balapan resmi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
            <Upload size={16} />
            Import CSV
          </button>
          <button className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
            <Plus size={16} />
            Input Hasil Baru
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800/60 bg-zinc-950/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex p-1 bg-zinc-900 rounded-lg">
            {["semua", "published", "draft"].map((tab) => (
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

          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Cari event atau kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D32F2F] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950 border-b border-zinc-800/80 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold">Event & Kelas</th>
                <th className="px-6 py-4 font-bold">Top 3 Pemenang</th>
                <th className="px-6 py-4 font-bold text-center">Lampiran</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-white font-bold leading-none mb-1">{r.event}</p>
                    <p className="text-xs text-[#D32F2F] font-semibold uppercase tracking-widest">{r.kelas}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {r.winners.map((w, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className={`font-bold w-4 text-center ${w.posisi === 1 ? 'text-amber-400' : w.posisi === 2 ? 'text-zinc-300' : 'text-amber-700'}`}>P{w.posisi}</span>
                          <span className="text-white font-medium truncate max-w-[100px]">{w.nama}</span>
                          <span className="text-zinc-500 truncate max-w-[100px] hidden sm:inline-block">({w.tim})</span>
                          <span className="text-zinc-500 font-mono ml-auto">{w.time}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {r.pdf_url ? (
                      <button className="text-[#D32F2F] hover:text-white transition-colors" title="Lihat PDF">
                        <FileText size={20} className="mx-auto" />
                      </button>
                    ) : (
                      <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${r.status === "Published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Edit Hasil">
                         <Edit size={16} />
                       </button>
                       <button className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Hapus Hasil">
                         <Trash2 size={16} />
                       </button>
                    </div>
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
