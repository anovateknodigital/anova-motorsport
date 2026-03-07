"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import CountUp from "react-countup";
import {
  Instagram, Twitter, Youtube, MapPin,
  Calendar, Clock, ShieldCheck, Timer, FileText, Menu, X,
} from "lucide-react";
import VideoSection from "@/app/components/VideoSection";
import NewsSection from "@/app/components/NewsSection";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/lib/supabase/client";

// ── Race Start Intro ─────────────────────────────────────────────
function RaceIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0); // 0 = loading, 1-3 = lights, 4 = GO, 5 = dismiss

  // Simpan onDone di ref agar effect tidak pernah di-re-run akibat referensi callback berubah
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  useEffect(() => {
    // Jalankan sequence sekali saja — tidak bergantung pada prop apapun
    const t0 = setTimeout(() => setPhase(1), 350);
    const t1 = setTimeout(() => setPhase(2), 750);
    const t2 = setTimeout(() => setPhase(3), 1150);
    const t3 = setTimeout(() => setPhase(4), 1650); // GO!
    const t4 = setTimeout(() => setPhase(5), 2200); // sweep up
    const t5 = setTimeout(() => {
      onDoneRef.current();
    }, 2850);
    return () => [t0, t1, t2, t3, t4, t5].forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- empty: timers tidak pernah dibatalkan oleh re-render parent

  return (
    <div
      className="fixed inset-0 z-[999] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
      style={{
        transform: phase >= 5 ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      {/* Speed lines */}
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${5 + i * 7}%`,
            height: "1px",
            background: `linear-gradient(to right, transparent, rgba(211,47,47,${0.08 + (i % 4) * 0.06}), transparent)`,
            animation: `speedLine ${0.9 + (i % 3) * 0.4}s ease-in-out ${i * 0.06}s infinite`,
          }}
        />
      ))}

      {/* Diagonal red accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent 40%, rgba(211,47,47,0.04) 50%, transparent 60%)",
        }}
      />

      {/* Brand Text */}
      <div
        className="relative mb-10 text-center"
        style={{
          transition: "opacity 0.5s ease, transform 0.5s ease",
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 0 ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <p className="font-teko text-6xl md:text-7xl font-bold uppercase italic text-white tracking-tight leading-none"
          style={{ textShadow: "0 0 40px rgba(211,47,47,0.4)" }}
        >
          ANOVA
        </p>
        <div className="flex items-center gap-3 justify-center mt-1">
          <div className="h-[2px] w-8 bg-[#D32F2F]" />
          <p className="font-teko text-2xl md:text-3xl font-bold uppercase tracking-[0.35em] text-[#D32F2F]">
            MOTORSPORT
          </p>
          <div className="h-[2px] w-8 bg-[#D32F2F]" />
        </div>
      </div>

      {/* F1 Race lights */}
      <div className="flex gap-6">
        {[1, 2, 3].map((light) => {
          const isOn = phase >= light;
          return (
            <div key={light} className="flex flex-col items-center gap-3">
              {/* Light housing */}
              <div className="w-4 h-12 rounded bg-zinc-800 flex flex-col justify-around px-0.5 py-1">
                <div className="h-1.5 w-full rounded-sm bg-zinc-700" />
                <div className="h-1.5 w-full rounded-sm bg-zinc-700" />
              </div>
              {/* Light bulb */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `2px solid ${isOn ? "#D32F2F" : "#3f3f46"}`,
                  background: isOn ? "#D32F2F" : "transparent",
                  boxShadow: isOn
                    ? "0 0 14px #D32F2F, 0 0 36px rgba(211,47,47,0.5)"
                    : "none",
                  transition: "all 0.18s ease",
                  animation: isOn ? "lightPop 0.3s ease" : "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* GO! */}
      <div
        style={{
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <p
          className="font-teko text-5xl font-bold text-[#D32F2F] uppercase mt-8 tracking-[0.3em]"
          style={{ animation: phase >= 4 ? "goFlash 0.35s ease 4" : "none" }}
        >
          GO!
        </p>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dragRaceTimeLeft, setDragRaceTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [motoprixTimeLeft, setMotoprixTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showIntro, setShowIntro] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [settings, setSettings] = useState<any>(null);

  // Fetch settings
  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase.from('site_settings').select('*').single();
      if (data) {
        setSettings(data);
      }
    }
    loadSettings();
  }, []);

  // Countdown timers
  useEffect(() => {
    const dragTargetDate = new Date("2026-04-17T08:00:00+07:00").getTime();
    const motoprixTargetDate = new Date("2026-05-30T08:00:00+07:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const dragDiff = dragTargetDate - now;
      if (dragDiff > 0) {
        setDragRaceTimeLeft({
          days: Math.floor(dragDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((dragDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((dragDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((dragDiff % (1000 * 60)) / 1000),
        });
      }
      const motoDiff = motoprixTargetDate - now;
      if (motoDiff > 0) {
        setMotoprixTimeLeft({
          days: Math.floor(motoDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((motoDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((motoDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((motoDiff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Intro selalu tampil setiap halaman dikunjungi
  useEffect(() => {
    setShowIntro(true);
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress((window.scrollY / total) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver — scroll reveal
  useEffect(() => {
    if (!pageReady) return;
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
  }, [pageReady]);

  // useCallback agar referensi stabil — tidak memicu re-run effect di RaceIntro
  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
    setPageReady(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Race Start Intro — fullscreen, di atas segalanya */}
      {showIntro && <RaceIntro onDone={handleIntroDone} />}

      {/* Saat intro masih berjalan: tampilkan layar hitam penuh agar konten tidak bocor */}
      {!pageReady && !showIntro && (
        <div className="fixed inset-0 bg-zinc-950 z-[998]" />
      )}

      {/* Scroll Progress Bar — selalu ada agar tidak merusak layout */}
      {pageReady && (
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-zinc-900/80 z-[100] pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-[#D32F2F] via-[#ff5252] to-[#D32F2F]"
            style={{
              width: `${scrollProgress}%`,
              transition: "width 60ms linear",
              boxShadow: scrollProgress > 2 ? "0 0 8px rgba(211,47,47,0.7)" : "none",
            }}
          />
        </div>
      )}

      {/* ── Konten Utama: hanya dirender setelah intro selesai ── */}
      {pageReady && (
        <div
          className="w-full flex flex-col items-center"
          style={{ animation: "fadeInPage 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >

      <Header />

      {/* 2. Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1613246273006-7f7476e693d9?q=80&w=2670&auto=format&fit=crop"
            alt="Motoprix Action"
            fill
            className="object-cover scale-105"
            style={{ animation: "heroZoom 12s ease-in-out infinite alternate" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Diagonal speed stripe */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(211,47,47,0.06) 50%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-white">
          <div className="max-w-2xl">
            {/* Animated red badge */}
            <div
              data-reveal="left"
              className="inline-flex items-center gap-2 bg-[#D32F2F]/20 border border-[#D32F2F]/40 text-[#D32F2F] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] animate-pulse" />
              Penyelenggara Resmi IMI
            </div>

            <h2
              data-reveal="left"
              data-delay="1"
              className="font-teko text-5xl md:text-8xl font-bold uppercase italic leading-[0.9] text-white drop-shadow-lg mb-6"
            >
              Garis Finish Adalah
              <br />
              Awal Perjuangan
            </h2>

            <p
              data-reveal="left"
              data-delay="2"
              className="text-lg md:text-xl text-zinc-200 mb-10 max-w-xl leading-relaxed"
            >
              Penyelenggara event balap resmi di bawah naungan IMI. Bergabunglah dengan ratusan pembalap lainnya.
            </p>

            <div data-reveal="left" data-delay="3" className="flex flex-col sm:flex-row gap-4">
              <button className="bg-anova-red hover:bg-anova-red-hover text-white px-8 py-3.5 rounded font-bold uppercase tracking-wider text-sm transition-all text-center shadow-red-500/20 shadow-xl hover:scale-105 active:scale-95">
                Daftar Event Sekarang
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded font-bold uppercase tracking-wider text-sm transition-all text-center hover:scale-105 active:scale-95">
                Lihat Hasil Balap Terakhir
              </button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent" />
      </section>

      {/* 3. Quick Stats */}
      <div className="w-full bg-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-wrap justify-between gap-8 text-center sm:text-left">
          {[
            { end: 50, suffix: "+", label: "Event Terlaksana" },
            { end: 1000, suffix: "+", label: "Pembalap Terdaftar", separator: "," },
            { end: 20, suffix: "+", label: "Kategori Kelas" },
            { end: 10, suffix: "", label: "Tahun Pengalaman" },
          ].map(({ end, suffix, label, separator }, i) => (
            <div
              key={label}
              data-reveal
              data-delay={String(i + 1)}
              className="flex flex-col flex-1 min-w-[150px] items-center"
            >
              <span className="font-teko text-5xl font-bold text-white mb-1">
                <CountUp end={end} suffix={suffix} enableScrollSpy scrollSpyOnce separator={separator ?? ""} />
              </span>
              <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-20 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">

        {/* LEFT COLUMN */}
        <div className="space-y-20">

          {/* 4. Upcoming Events */}
          <section id="events" className="scroll-mt-32">
            <h3
              data-reveal="left"
              className="text-2xl font-bold text-white mb-8 flex items-center gap-3"
            >
              Upcoming Events
              <span className="h-[2px] w-12 bg-anova-red block" />
            </h3>

            <div className="space-y-10">
              {/* Event 1: Drag Race */}
              <div
                data-reveal
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl hover:border-[#D32F2F]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(211,47,47,0.08)]"
              >
                <div className="relative w-full group">
                  <div className="relative h-60 w-full bg-black overflow-hidden rounded-t-xl">
                    <Image
                      src="https://cdn.medcom.id/dynamic/content/2025/07/13/1768639/X7pS9VTW2A.jpg?w=800"
                      alt="ANOVA DRAG BIKE"
                      fill
                      className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-105"
                      style={{ transform: "translateZ(0) scale(1.01)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                  <div className="absolute top-4 right-4 bg-anova-red text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider z-10 shadow-lg">
                    Drag Race
                  </div>
                </div>

                <div className="p-8">
                  <h4 className="text-2xl font-bold text-white mb-4 uppercase">ANOVA DRAG BIKE / DRAG RACE</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-zinc-300">
                    <div className="flex items-center gap-3"><Calendar className="text-anova-red shrink-0" size={20} /><span>17 - 18 April 2026</span></div>
                    <div className="flex items-center gap-3"><Clock className="text-anova-red shrink-0" size={20} /><span>08:00 - 17:00 WIB</span></div>
                    <div className="flex items-start gap-3 sm:col-span-2"><MapPin className="text-anova-red shrink-0 mt-0.5" size={20} /><span>Jalan Lingkar Depan Sport Centre Bangkinang, Kab Kampar, Riau</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-8 bg-black/50 p-4 rounded-lg border border-zinc-800 text-center shadow-inner">
                    {[
                      { val: dragRaceTimeLeft.days, label: "Hari" },
                      { val: dragRaceTimeLeft.hours, label: "Jam" },
                      { val: dragRaceTimeLeft.minutes, label: "Menit" },
                      { val: dragRaceTimeLeft.seconds, label: "Detik", red: true },
                    ].map(({ val, label, red }) => (
                      <div key={label} className="flex flex-col">
                        <span className={`font-teko text-5xl leading-none font-bold mb-1 ${red ? "text-anova-red" : "text-white"}`}>{val}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 bg-anova-red hover:bg-anova-red-hover text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-95 text-center block"
                    >
                      Daftar Online
                    </a>
                    <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-95 text-center">Detail &amp; Regulasi</button>
                  </div>
                </div>
              </div>

              {/* Event 2: Motoprix */}
              <div
                data-reveal
                data-delay="1"
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm hover:border-[#D32F2F]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(211,47,47,0.08)]"
              >
                <div className="relative w-full group mb-5">
                  <div className="relative h-60 w-full bg-black overflow-hidden rounded-t-xl">
                    <Image
                      src="https://d34vm3j4h7f97z.cloudfront.net/original/4X/8/7/9/8798a3766550f77660de63c571a51c829cbefd5c.jpeg"
                      alt="KEJURNAS ANOVA MOTOPRIX"
                      fill
                      className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-105"
                      style={{ transform: "translateZ(0) scale(1.01)" }}
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 z-20 pointer-events-none opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500">
                    <Image
                      src="/bangkinang-sirkuit.png"
                      alt="Sirkuit Bangkinang"
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-anova-red text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider z-10 shadow-lg">Motoprix</div>
                </div>

                <div className="p-8">
                  <h4 className="text-2xl font-bold text-white mb-4 uppercase">KEJURNAS ANOVA MOTOPRIX</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-zinc-300">
                    <div className="flex items-center gap-3"><Calendar className="text-anova-red shrink-0" size={20} /><span>30 - 31 Mei 2026</span></div>
                    <div className="flex items-center gap-3"><Clock className="text-anova-red shrink-0" size={20} /><span>08:00 - 17:00 WIB</span></div>
                    <div className="flex items-start gap-3 sm:col-span-2"><MapPin className="text-anova-red shrink-0 mt-0.5" size={20} /><span>Sirkuit Permanent Sport Centre Bangkinang, Kampar</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-8 bg-black/50 p-4 rounded-lg border border-zinc-800 text-center shadow-inner">
                    {[
                      { val: motoprixTimeLeft.days, label: "Hari" },
                      { val: motoprixTimeLeft.hours, label: "Jam" },
                      { val: motoprixTimeLeft.minutes, label: "Menit" },
                      { val: motoprixTimeLeft.seconds, label: "Detik", red: true },
                    ].map(({ val, label, red }) => (
                      <div key={label} className="flex flex-col">
                        <span className={`font-teko text-5xl leading-none font-bold mb-1 ${red ? "text-anova-red" : "text-white"}`}>{val}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 bg-anova-red hover:bg-anova-red-hover text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-95 text-center block"
                    >
                      Daftar Online
                    </a>
                    <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-95 text-center">Detail &amp; Regulasi</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Why Join Us? */}
          <section>
            <h3 data-reveal="left" className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              Why Join Us?
            </h3>
            <div className="space-y-6">
              {[
                { icon: Timer, title: "Sistem Timing Akurat", desc: "Menggunakan sensor transponder standar nasional untuk presisi hingga persekian detik." },
                { icon: ShieldCheck, title: "Regulasi IMI Resmi", desc: "Event resmi, aman, dan perolehan poin diakui untuk kejuaraan tingkat nasional." },
                { icon: FileText, title: "Scrutineering Ketat", desc: "Sistem pemeriksaan ketat yang menjamin kompetisi yang adil bagi semua peserta dari berbagai kelas." },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  data-reveal="left"
                  data-delay={String(i + 1)}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-anova-red group-hover:bg-[#D32F2F]/10 group-hover:border-[#D32F2F]/30 transition-all">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{title}</h4>
                    <p className="text-zinc-400 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-20">

          {/* 5. Race Results */}
          <section id="results">
            <h3 data-reveal="right" className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              Latest Race Results
            </h3>
            <div className="flex flex-col gap-5">
              
              {/* Card 1: Bintang */}
              <div data-reveal="scale" className="relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-between p-6 pr-0 group hover:border-anova-red/50 transition-colors shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-900 to-transparent z-0" />
                
                {/* Info Text */}
                <div className="relative z-10 flex flex-col w-2/3 pr-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-anova-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">P1</span>
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Motoprix • Underbone 150cc</span>
                  </div>
                  <h4 className="text-3xl font-teko font-bold uppercase text-white leading-none mb-1 group-hover:text-anova-red transition-colors">Bintang N.</h4>
                  <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Anova RT MTR</p>
                  <p className="text-xs text-zinc-400 font-bold font-mono">12:45.012<span className="text-anova-red text-[10px] ml-1">SEC</span></p>
                </div>

                {/* Big Angled Photo */}
                <div className="relative z-10 h-32 w-1/3 min-w-[120px] rounded-l-[40px] overflow-hidden -mr-2 bg-black border-l-4 border-anova-red drop-shadow-2xl translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                  <Image 
                    src="https://asset.kompas.com/crops/_WPT6_jc87U-nz1_jNlkjTcx2Dg=/0x0:1599x1066/750x500/data/photo/2024/11/17/673a0716d9b2b.jpeg" 
                    alt="Bintang N." 
                    fill 
                    className="object-cover object-top scale-110 group-hover:scale-125 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-anova-red/30 to-transparent mix-blend-overlay" />
                </div>
              </div>

              {/* Card 2: Reza */}
              <div data-reveal="scale" data-delay="1" className="relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-between p-6 pr-0 group hover:border-anova-red/50 transition-colors shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-900 to-transparent z-0" />
                
                {/* Info Text */}
                <div className="relative z-10 flex flex-col w-2/3 pr-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#FFD700] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">WR</span>
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Drag Race • Bracket 9D</span>
                  </div>
                  <h4 className="text-3xl font-teko font-bold uppercase text-white leading-none mb-1 group-hover:text-anova-red transition-colors">Reza V.</h4>
                  <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Anova Drag TEAM</p>
                  <p className="text-xs text-zinc-400 font-bold font-mono">09.012<span className="text-anova-red text-[10px] ml-1">SEC</span></p>
                </div>

                {/* Big Angled Photo */}
                <div className="relative z-10 h-32 w-1/3 min-w-[120px] rounded-l-[40px] overflow-hidden -mr-2 bg-black border-l-4 border-anova-red drop-shadow-2xl translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                  <Image 
                    src="https://cdn.grid.id/crop/0x0:0x0/700x465/photo/2020/09/28/4272447586.jpg" 
                    alt="Reza V." 
                    fill 
                    className="object-cover object-center scale-110 group-hover:scale-125 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-anova-red/30 to-transparent mix-blend-overlay" />
                </div>
              </div>

              <div data-reveal="left" className="mt-4 text-center">
                <Link href="/results" className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-all hover:scale-105">
                  Seluruh Hasil Balap
                </Link>
              </div>

            </div>
          </section>

          {/* 7. Gallery */}
          <section id="gallery">
            <h3 data-reveal="right" className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              Media Gallery
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div data-reveal="scale" className="relative h-48 rounded-lg overflow-hidden col-span-2 group">
                <Image src="https://images.unsplash.com/photo-1625930617993-481e41cc7fda?q=80&w=800&auto=format&fit=crop" alt="Paddock" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div data-reveal data-delay="1" className="relative h-32 rounded-lg overflow-hidden group">
                <Image src="https://images.unsplash.com/photo-1625930601622-031b9099d4f6?q=80&w=600&auto=format&fit=crop" alt="Motor" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div data-reveal data-delay="2" className="relative h-32 rounded-lg overflow-hidden group">
                <Image src="https://images.unsplash.com/photo-1625930545875-b6b0089df67d?q=80&w=600&auto=format&fit=crop" alt="Action" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <VideoSection />

      <NewsSection />

      {/* Partners */}
      <section data-reveal className="w-full bg-white py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h4 className="text-center text-sm font-bold text-zinc-400 uppercase tracking-widest mb-10">Official Partners</h4>
        </div>

        <div className="relative w-full flex overflow-hidden">
          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Marquee Loop Wrapper */}
          <div className="flex flex-nowrap transition-all duration-500">
            {/* Duplikasi (banyak array) DIBUTUHKAN murni karena batasan CSS/HTML. 
                Tanpa duplikat, elemen akan menghilang di kiri dan ada ruang kosong sebelum muncul lagi di kanan.
                Terutama di layar lebar (desktop), butuh lebih dari 2 set agar tidak terputus kosong di ujung kanan. */}
            {[1, 2, 3, 4].map((listIndex) => (
              <div
                key={listIndex}
                className="flex flex-nowrap items-center gap-12 md:gap-24 shrink-0 px-6 md:px-12 custom-marquee"
                aria-hidden={listIndex > 1 ? "true" : "false"}
              >
                <Image src="/logo-kny-sponsor.png" alt="KNY Sponsor" width={100} height={40} className="h-8 md:h-12 w-auto object-contain shrink-0" />
                <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T135844.401.jpg" alt="Sponsor 1" width={100} height={40} className="h-8 md:h-12 w-auto object-contain shrink-0" />
                <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140333.818.jpg" alt="Sponsor 2" width={100} height={40} className="h-8 md:h-12 w-auto object-contain shrink-0" />
                <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140310.536.jpg" alt="Sponsor 3" width={100} height={40} className="h-8 md:h-12 w-auto object-contain shrink-0" />
                <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140050.224.jpg" alt="Sponsor 4" width={100} height={40} className="h-8 md:h-12 w-auto object-contain shrink-0" />
                <Image src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140239.381.jpg" alt="Sponsor 5" width={100} height={40} className="h-8 md:h-12 w-auto object-contain shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Hero zoom keyframe */}
      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.12); }
        }
      `}</style>
        </div>
      )}
    </div>
  );
}
