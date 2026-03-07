"use client";

import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Trophy, Timer, Flag, MapPin, Search } from "lucide-react";
import { useEffect } from "react";

// Mock data race results
const raceResults = [
  {
    id: 1,
    eventName: "Kejurnas Motoprix Seri 1",
    date: "10 Agustus 2025",
    location: "Sirkuit Bangkinang, Riau",
    imageUrl: "https://d34vm3j4h7f97z.cloudfront.net/original/4X/8/7/9/8798a3766550f77660de63c571a51c829cbefd5c.jpeg",
    classes: [
      {
        name: "Underbone 150cc",
        winners: [
          { pos: 1, driver: "Bintang N.", team: "Anova Racing Team", time: "12m 45.012s", points: 25, avatar: "https://asset.kompas.com/crops/_WPT6_jc87U-nz1_jNlkjTcx2Dg=/0x0:1599x1066/750x500/data/photo/2024/11/17/673a0716d9b2b.jpeg" },
          { pos: 2, driver: "Wahyu Nugroho", team: "Yamaha Racing", time: "+1.240s", points: 20 },
          { pos: 3, driver: "Galang Hendra", team: "Fast Tech", time: "+2.100s", points: 16 }
        ]
      },
      {
        name: "Bebek 4T 130cc",
        winners: [
          { pos: 1, driver: "Robby Sakera", team: "Garmos Racing", time: "11m 20.331s", points: 25 },
          { pos: 2, driver: "Fitriansyah Kete", team: "Anova Racing Team", time: "+0.800s", points: 20 },
          { pos: 3, driver: "Anggi Permana", team: "Honda Trijaya", time: "+1.554s", points: 16 }
        ]
      }
    ]
  },
  {
    id: 2,
    eventName: "Anova Drag Bike Championship",
    date: "15 April 2025",
    location: "Lanud Roesmin Nurjadin",
    imageUrl: "https://cdn.medcom.id/dynamic/content/2025/07/13/1768639/X7pS9VTW2A.jpg?w=800",
    classes: [
      {
        name: "Bracket 9 Detik",
        winners: [
          { pos: 1, driver: "Reza V.", team: "Anova Drag Team", time: "09.012s", points: 25, avatar: "https://cdn.grid.id/crop/0x0:0x0/700x465/photo/2020/09/28/4272447586.jpg" },
          { pos: 2, driver: "Eko Chodox", team: "Faster Chodox", time: "09.088s", points: 20 },
          { pos: 3, driver: "Alvan Cebong", team: "Boter RT", time: "09.120s", points: 16 }
        ]
      },
      {
        name: "FFA 250cc",
        winners: [
          { pos: 1, driver: "Fadil Muhammad", team: "Tech3 Riau", time: "06.845s", points: 25 },
          { pos: 2, driver: "Dwi Batank", team: "Anova Drag Team", time: "06.890s", points: 20 },
          { pos: 3, driver: "Hendrik K.", team: "SpeedTech", time: "06.911s", points: 16 }
        ]
      }
    ]
  }
];

export default function ResultsPage() {
  // IntersectionObserver — scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white">
        
        {/* Page Header */}
        <section className="relative py-20 overflow-hidden border-b border-zinc-900">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1625930601622-031b9099d4f6?q=80&w=1600&auto=format&fit=crop"
              alt="Results Header Background"
              fill
              className="object-cover opacity-20 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center pt-10">
            <div className="inline-flex items-center justify-center p-3 bg-zinc-900/80 border border-zinc-800 rounded-full mb-6 relative">
              <Trophy className="text-anova-red" size={28} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-anova-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D32F2F]"></span>
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-teko font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-[#D32F2F] mb-6">
              Official Race Results
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Arsip hasil kejuaraan balap resmi Anova Motorsport. Pantau catatan waktu dan poin pembalap andalan Anda.
            </p>
            
            <div className="mt-12 max-w-xl mx-auto relative">
              <input 
                type="text" 
                placeholder="Cari nama pembalap, event, atau kelas..." 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 pl-14 pr-6 text-white placeholder-zinc-500 focus:outline-none focus:border-anova-red transition-colors font-medium shadow-inner"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            </div>
          </div>
        </section>

        {/* Results List */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-20">
            {raceResults.map((event, index) => (
              <div key={event.id} className="relative" data-reveal="scale" data-delay={index % 2 + 1}>
                {/* Event Header */}
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8 border-b border-zinc-800 pb-6 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden relative shrink-0 border border-zinc-700 shadow-lg">
                      <Image src={event.imageUrl} alt={event.eventName} fill className="object-cover" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold uppercase tracking-wide text-white mb-2">{event.eventName}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-400">
                        <div className="flex items-center gap-1.5"><Flag size={16} className="text-anova-red"/> {event.date}</div>
                        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-anova-red"/> {event.location}</div>
                      </div>
                    </div>
                  </div>
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-all hover:scale-105 inline-flex items-center gap-2 self-start md:self-auto border border-zinc-700">
                    Unduh PDF
                  </button>
                </div>
                
                {/* Classes & Winners */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                  {event.classes.map((raceClass) => (
                    <div key={raceClass.name} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-anova-red uppercase tracking-wide">
                          {raceClass.name}
                        </h3>
                        <Timer className="text-zinc-600" size={24} />
                      </div>
                      
                      <div className="space-y-3">
                        {raceClass.winners.map((winner) => (
                          <div key={winner.pos} className={`flex items-center gap-4 p-4 rounded-xl border ${winner.pos === 1 ? 'bg-zinc-800/80 border-zinc-700' : 'bg-black/40 border-zinc-800/50 hover:bg-zinc-800/40'} transition-colors`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${winner.pos === 1 ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]' : winner.pos === 2 ? 'bg-[#C0C0C0] text-black' : 'bg-[#CD7F32] text-black'}`}>
                              {winner.pos}
                            </div>
                            
                            {/* Avatar (if any) */}
                            {winner.avatar ? (
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-zinc-700 shrink-0 hidden sm:block shadow-xl">
                                <Image src={winner.avatar} alt={winner.driver} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 shrink-0 hidden sm:flex items-center justify-center text-zinc-500 font-bold text-2xl">
                                {winner.driver.charAt(0)}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-base text-white truncate">{winner.driver}</div>
                              <div className="text-xs text-zinc-400 truncate uppercase mt-0.5">{winner.team}</div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className={`font-mono font-bold ${winner.pos === 1 ? 'text-anova-red text-base' : 'text-zinc-300 text-sm'}`}>{winner.time}</div>
                              <div className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">{winner.points} Pts</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
