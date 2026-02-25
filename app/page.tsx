"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";
import { 
  Instagram, Twitter, Youtube, MapPin, 
  Calendar, Clock, ShieldCheck, Timer, FileText, Menu, X, Play
} from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* 1. Header (Navigation & Branding) */}
      <header className="w-full bg-white text-zinc-900 border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="leading-tight shrink-0">
              <Image 
                src="/anova-motorsport-logo.png"
                alt="Anova Motorsport Logo"
                width={200}
                height={60}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </Link>
            <div className="h-10 md:h-12 w-10 md:w-12 relative flex-shrink-0">
              <Image 
                src="/imi-logo.webp"
                alt="IMI Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link href="/" className="text-anova-red relative font-bold">
              Home
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-anova-red" />
            </Link>
            <Link href="#events" className="hover:text-anova-red transition-colors">Events</Link>
            <Link href="#results" className="hover:text-anova-red transition-colors">Race Results</Link>
            <Link href="#gallery" className="hover:text-anova-red transition-colors">Gallery</Link>
            <Link href="#news" className="hover:text-anova-red transition-colors">News</Link>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <button className="bg-anova-red hover:bg-anova-red-hover text-white px-6 py-2.5 rounded font-bold uppercase tracking-wide text-sm transition-colors">
              Daftar Event Sekarang
            </button>
            <div className="flex items-center gap-4 text-zinc-600">
              <Link href="#" className="hover:text-anova-red transition-colors"><Instagram size={18} /></Link>
              <Link href="#" className="hover:text-anova-red transition-colors"><Twitter size={18} /></Link>
              <Link href="#" className="hover:text-anova-red transition-colors"><Youtube size={18} /></Link>
            </div>
          </div>

          <button 
            className="md:hidden text-zinc-900 border-none bg-transparent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full h-[calc(100vh-80px)] bg-white z-40 md:hidden flex flex-col px-6 py-8 overflow-y-auto shadow-xl">
            <nav className="flex flex-col gap-6 text-xl font-bold border-b border-zinc-100 pb-8 mb-8">
              <Link href="/" className="text-anova-red" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="#events" className="hover:text-anova-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Events
              </Link>
              <Link href="#results" className="hover:text-anova-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Race Results
              </Link>
              <Link href="#gallery" className="hover:text-anova-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Gallery
              </Link>
              <Link href="#news" className="hover:text-anova-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                News
              </Link>
            </nav>
            
            <div className="flex flex-col gap-6 mt-auto">
              <button className="bg-anova-red hover:bg-anova-red-hover text-white px-6 py-4 rounded font-bold uppercase tracking-wide text-sm transition-colors w-full">
                Daftar Event Sekarang
              </button>
              <div className="flex items-center justify-center gap-8 text-zinc-600">
                <Link href="#" className="hover:text-anova-red transition-colors"><Instagram size={24} /></Link>
                <Link href="#" className="hover:text-anova-red transition-colors"><Twitter size={24} /></Link>
                <Link href="#" className="hover:text-anova-red transition-colors"><Youtube size={24} /></Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1613246273006-7f7476e693d9?q=80&w=2670&auto=format&fit=crop"
            alt="Motoprix Action"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-white">
          <div className="max-w-2xl">
            <h2 className="font-teko text-5xl md:text-8xl font-bold uppercase italic leading-[0.9] text-white drop-shadow-lg mb-6">
              Garis Finish Adalah
              <br />
              Awal Perjuangan
            </h2>
            <p className="text-lg md:text-xl text-zinc-200 mb-10 max-w-xl leading-relaxed">
              Penyelenggara event balap resmi di bawah naungan IMI. Bergabunglah dengan ratusan pembalap lainnya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-anova-red hover:bg-anova-red-hover text-white px-8 py-3.5 rounded font-bold uppercase tracking-wider text-sm transition-colors text-center shadow-red-500/20 shadow-xl">
                Daftar Event Sekarang
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded font-bold uppercase tracking-wider text-sm transition-colors text-center">
                Lihat Hasil Balap Terakhir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Stats */}
      <div className="w-full bg-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-wrap justify-between gap-8 text-center sm:text-left">
          <div className="flex flex-col flex-1 min-w-[150px] items-center">
            <span className="font-teko text-5xl font-bold text-white mb-1">
              <CountUp end={50} suffix="+" enableScrollSpy scrollSpyOnce />
            </span>
            <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Event Terlaksana</span>
          </div>
          <div className="flex flex-col flex-1 min-w-[150px] items-center">
            <span className="font-teko text-5xl font-bold text-white mb-1">
              <CountUp end={1000} suffix="+" enableScrollSpy scrollSpyOnce separator="," />
            </span>
            <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Pembalap Terdaftar</span>
          </div>
          <div className="flex flex-col flex-1 min-w-[150px] items-center">
            <span className="font-teko text-5xl font-bold text-white mb-1">
              <CountUp end={20} suffix="+" enableScrollSpy scrollSpyOnce />
            </span>
            <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Kategori Kelas</span>
          </div>
          <div className="flex flex-col flex-1 min-w-[150px] items-center">
            <span className="font-teko text-5xl font-bold text-white mb-1">
              <CountUp end={10} enableScrollSpy scrollSpyOnce />
            </span>
            <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Tahun Pengalaman</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left & Right Columns */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-20 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
        
        {/* LEFT COLUMN */}
        <div className="space-y-20">
          
          {/* 4. Upcoming Events */}
          <section id="events" className="scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              Upcoming Events
              <span className="h-[2px] w-12 bg-anova-red block"></span>
            </h3>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="relative h-60 w-full group mb-5">
                <Image 
                  src="https://images.unsplash.com/photo-1625930580053-ec16379a183d?q=80&w=1000&auto=format&fit=crop"
                  alt="KEJURNAS ANOVA MOTOPRIX Background"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                
                {/* Track Overlay at Bottom Right */}
                <div className="absolute -bottom-16 right-4 w-48 h-48 z-20 pointer-events-none">
                  <Image 
                    src="/bangkinang-sirkuit.png"
                    alt="Sirkuit Bangkinang"
                    fill
                    className="object-contain brightness-0 invert opacity-80 md:opacity-50 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] md:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>

                <div className="absolute top-4 right-4 bg-anova-red text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider z-10">
                  Motoprix
                </div>
              </div>
              
              <div className="p-8">
                <h4 className="text-2xl font-bold text-white mb-4 uppercase">KEJURNAS ANOVA MOTOPRIX</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-zinc-300">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-anova-red shrink-0" size={20} />
                    <span>30-31 Mei 2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-anova-red shrink-0" size={20} />
                    <span>08:00 - 17:00 WIB</span>
                  </div>
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <MapPin className="text-anova-red shrink-0 mt-0.5" size={20} />
                    <span>Sirkuit Permanent Sport Centre Bangkinang, Kampar</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-anova-red hover:bg-anova-red-hover text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-colors text-center">
                    Daftar Online
                  </button>
                  <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-colors text-center">
                    Detail & Regulasi
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Features/Why Join Us? */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              Why Join Us?
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-anova-red">
                  <Timer size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Sistem Timing Akurat</h4>
                  <p className="text-zinc-400 text-sm">Menggunakan sensor transponder standar nasional untuk presisi hingga persekian detik.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-anova-red">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Regulasi IMI Resmi</h4>
                  <p className="text-zinc-400 text-sm">Event resmi, aman, dan perolehan poin diakui untuk kejuaraan tingkat nasional.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-anova-red">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Scrutineering Ketat</h4>
                  <p className="text-zinc-400 text-sm">Sistem pemeriksaan ketat yang menjamin kompetisi yang adil bagi semua peserta dari berbagai kelas.</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-20">
          
          {/* 5. Latest Race Results */}
          <section id="results">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              Latest Race Results
            </h3>
            <div className="bg-white rounded-xl overflow-hidden text-zinc-900">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 uppercase text-xs tracking-wider text-zinc-500 font-bold border-b border-zinc-200">
                    <th className="py-4 px-6">Kelas</th>
                    <th className="py-4 px-6 text-right">Pemenang / Waktu</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  <tr className="border-b border-zinc-100">
                    <td className="py-4 px-6">
                      <div className="font-bold">Motoprix</div>
                      <div className="text-xs text-zinc-500 font-normal">Underbone 150cc</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-bold">Bintang N.</div>
                      <div className="text-xs text-zinc-500 font-normal">Anova RT</div>
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <td className="py-4 px-6">
                      <div className="font-bold">Drag Race</div>
                      <div className="text-xs text-zinc-500 font-normal">Bracket 9 Detik</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-bold">Reza V.</div>
                      <div className="text-xs text-anova-red font-bold">09.012s</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="py-4 px-6 text-center">
                      <Link href="#results" className="text-anova-red hover:underline font-bold text-sm">
                        Lihat Semua Hasil
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. Media Gallery */}
          <section id="gallery">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              Media Gallery
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-lg overflow-hidden col-span-2">
                <Image src="https://images.unsplash.com/photo-1625930617993-481e41cc7fda?q=80&w=800&auto=format&fit=crop" alt="Paddock" fill className="object-cover" />
              </div>
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1625930601622-031b9099d4f6?q=80&w=600&auto=format&fit=crop" alt="Motor" fill className="object-cover" />
              </div>
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1625930545875-b6b0089df67d?q=80&w=600&auto=format&fit=crop" alt="Action" fill className="object-cover" />
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Video Highlights Section */}
      <section id="video" className="w-full bg-black py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                Latest Race Videos
              </h3>
              <p className="text-zinc-400 mt-2 max-w-xl">
                Tonton ulang highlight pertandingan dan full race dari seri balapan Anova Motorsport terakhir.
              </p>
            </div>
            <Link href="#" className="text-anova-red hover:text-white transition-colors font-bold text-sm uppercase flex items-center gap-2 border border-anova-red hover:border-white px-6 py-2 rounded-full">
              Kunjungi Channel YouTube <Youtube size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Video Highlight */}
            <div className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-video border border-zinc-800 bg-zinc-900">
              <Image 
                src="https://images.unsplash.com/photo-1625930545875-b6b0089df67d?q=80&w=1200&auto=format&fit=crop" 
                alt="Highlight Video" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center pb-12 md:pb-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-anova-red/90 text-white flex items-center justify-center md:ml-2 pl-1 group-hover:bg-anova-red group-hover:scale-110 transition-all shadow-[0_0_30px_rgba(211,47,47,0.5)]">
                  <Play className="text-white w-6 h-6 md:w-7 md:h-7" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                <div className="bg-anova-red text-white text-[10px] font-bold px-2 py-1 rounded inline-block uppercase tracking-wider mb-2 md:mb-3">
                  Full Race
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white leading-tight">FINAL MOTOPRIX UNDERBONE 150cc - ANOVA CHAMPIONSHIP</h4>
              </div>
            </div>

            {/* Smaller vids list */}
            <div className="flex flex-col gap-4">
              {[
                { title: "Highlight Drag Race Battle - Bracket 9 Detik", tag: "Highlight", img: "1625930617993-481e41cc7fda" },
                { title: "Onboard Camera: Lap Rekor Sirkuit oleh Bintang N.", tag: "Onboard", img: "1625930601622-031b9099d4f6" },
                { title: "Keseruan Paddock & Persiapan Rider Sebelum Start", tag: "Behind The Scene", img: "1625930641163-6c1734ecbd65" }
              ].map((vid, idx) => (
                <div key={idx} className="group cursor-pointer flex gap-4 bg-zinc-900/50 hover:bg-zinc-800 p-3 rounded-xl border border-zinc-800/50 transition-colors">
                  <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-black">
                    <Image 
                      src={`https://images.unsplash.com/photo-${vid.img}?q=80&w=400&auto=format&fit=crop`}
                      alt={vid.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center pl-0.5 group-hover:bg-anova-red transition-colors">
                        <Play className="text-white" size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center py-1">
                    <span className="text-anova-red text-[10px] font-bold uppercase tracking-wider mb-1">{vid.tag}</span>
                    <h5 className="font-bold text-zinc-200 group-hover:text-white line-clamp-2 leading-snug text-sm">{vid.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. News & Updates */}
      <section id="news" className="w-full bg-black/50 border-t border-zinc-900 overflow-hidden relative py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h3 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
            News & Updates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Panduan Scrutineering untuk Pemula di Kelas Drag 201m", date: "Maret 12, 2026" },
              { title: "Update Regulasi Ban untuk Motoprix Musim 2026", date: "Maret 05, 2026" },
              { title: "Highlight Event Anova Motorsport Bulan Lalu", date: "Februari 28, 2026" },
            ].map((news, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-zinc-800 rounded-lg overflow-hidden mb-4 relative">
                  <Image 
                    src={`https://images.unsplash.com/photo-${['1625930617993-481e41cc7fda','1625930601622-031b9099d4f6','1625930641163-6c1734ecbd65'][idx]}?q=80&w=600&auto=format&fit=crop`}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-anova-red text-xs font-bold uppercase tracking-wider mb-2">{news.date}</div>
                <h4 className="text-lg font-bold text-white group-hover:text-anova-red transition-colors leading-tight">
                  {news.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Official Partners */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h4 className="text-center text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">Official Partners</h4>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-100 grayscale-0 md:opacity-60 md:grayscale hover:grayscale-0 hover:opacity-100 transition-duration-300 transition-all">
            <Image src="/logo-kny-sponsor.png" alt="KNY Sponsor" width={100} height={40} className="h-12 w-auto object-contain" />
            <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T135844.401.jpg" alt="Sponsor 1" width={100} height={40} className="h-12 w-auto object-contain" />
            <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140333.818.jpg" alt="Sponsor 2" width={100} height={40} className="h-12 w-auto object-contain" />
            <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140310.536.jpg" alt="Sponsor 3" width={100} height={40} className="h-12 w-auto object-contain" />
            <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140050.224.jpg" alt="Sponsor 4" width={100} height={40} className="h-12 w-auto object-contain" />
            <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140239.381.jpg" alt="Sponsor 5" width={100} height={40} className="h-12 w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="w-full bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/anova-motorsport-logo.png"
                alt="Anova Motorsport Logo"
                width={200}
                height={60}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mb-6">
              Penyelenggara event balap resmi di bawah naungan IMI. Kami berdedikasi untuk memajukan olahraga otomotif Indonesia.
            </p>
            <div className="flex items-center gap-4 text-zinc-400">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Sekretariat</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Jl. A. Yani No. 129<br />
                Bangkinang, Kampar<br />
                Riau, 28411
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Person</h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-2">
                <span className="block text-zinc-500 text-xs">Pendaftaran (WA)</span>
                +62 819-7340-0100
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                <span className="block text-zinc-500 text-xs">Darurat Event</span>
                +62 812 9988 7766
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-zinc-900 text-center md:text-left flex flex-col md:flex-row items-center justify-between text-zinc-600 text-xs font-medium">
          <p>© 2026 Anova Motorsport. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Powered by ANOVA TEKNO DIGITAL</p>
        </div>
      </footer>
    </div>
  );
}
