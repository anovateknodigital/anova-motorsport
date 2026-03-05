"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Youtube, Loader2, AlertCircle } from "lucide-react";
import type { VideoItem } from "@/app/api/youtube/playlist/route";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Komponen kecil yang animate-in saat masuk viewport
function RevealBox({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "right" | "scale";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initial: Record<string, string> = {
    up: "translateY(24px)",
    right: "translateX(24px)",
    scale: "scale(0.94)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initial[direction],
        transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function VideoSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/youtube/playlist")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setVideos(data.videos ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="video" className="w-full bg-black py-20 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <RevealBox className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h3 className="text-3xl font-bold text-white">Latest Race Videos</h3>
            <p className="text-zinc-400 mt-2 max-w-xl">
              Tonton ulang highlight pertandingan dan full race dari seri balapan
              Anova Motorsport.
            </p>
          </div>
          <Link
            href="https://www.youtube.com/playlist?list=PLWbWb0irUreOPsN__SwhiXs7mY89llEUj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D32F2F] hover:text-white transition-colors font-bold text-sm uppercase flex items-center gap-2 border border-[#D32F2F] hover:border-white px-6 py-2 rounded-full shrink-0"
          >
            Kunjungi Channel YouTube <Youtube size={16} />
          </Link>
        </RevealBox>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-zinc-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Memuat video...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-zinc-600">
            <AlertCircle size={20} className="text-red-700" />
            <span className="text-sm">Gagal memuat video. Coba lagi nanti.</span>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Featured — video pertama (terbaru) */}
            <RevealBox direction="scale">
              <Link
                href={videos[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-video border border-zinc-800 bg-zinc-900 block"
                style={{ willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                {/* Thumbnail */}
                {videos[0].thumbnail && (
                  <Image
                    src={videos[0].thumbnail}
                    alt={videos[0].title}
                    fill
                    className="object-cover transition-[filter,transform] duration-500 group-hover:brightness-110 group-hover:scale-[1.03]"
                    style={{ willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translateZ(0) scale(1)" }}
                    unoptimized
                  />
                )}

                {/* Gradient hanya di bawah untuk area teks */}
                <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

                {/* Play button — GPU layer sendiri, tidak shared dengan image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+24px)] md:-translate-y-1/2 pointer-events-none">
                  <div
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#D32F2F] flex items-center justify-center pl-1 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_40px_rgba(211,47,47,0.7)]"
                    style={{ willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translateZ(0)" }}
                  >
                    <Play className="text-white w-6 h-6 md:w-7 md:h-7" />
                  </div>
                </div>

                {/* Info teks di bawah */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 pointer-events-none">
                  <div className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded inline-block uppercase tracking-wider mb-2">
                    Terbaru
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2">
                    {videos[0].title}
                  </h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    {formatDate(videos[0].publishedAt)}
                  </p>
                </div>
              </Link>

            </RevealBox>

            {/* List — video 2–4 */}
            <div className="flex flex-col gap-4">
              {videos.slice(1, 4).map((vid, idx) => (
                <RevealBox key={vid.videoId} direction="right" delay={idx * 80}>
                  <Link
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 bg-zinc-900/50 hover:bg-zinc-800 p-3 rounded-xl border border-zinc-800/50 transition-all hover:border-zinc-700 hover:translate-x-1 cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                      {vid.thumbnail && (
                        <Image
                          src={vid.thumbnail}
                          alt={vid.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center pl-0.5 group-hover:bg-[#D32F2F] transition-colors">
                          <Play className="text-white" size={16} />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center py-1 min-w-0">
                      <span className="text-[#D32F2F] text-[10px] font-bold uppercase tracking-wider mb-1">
                        {formatDate(vid.publishedAt)}
                      </span>
                      <h5 className="font-bold text-zinc-200 group-hover:text-white line-clamp-2 leading-snug text-sm">
                        {vid.title}
                      </h5>
                    </div>
                  </Link>
                </RevealBox>
              ))}

              {/* Lihat semua */}
              {videos.length > 4 && (
                <RevealBox delay={280}>
                  <Link
                    href="https://www.youtube.com/playlist?list=PLWbWb0irUreOPsN__SwhiXs7mY89llEUj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[#D32F2F] hover:text-white text-sm font-semibold py-3 border border-zinc-800 hover:border-zinc-600 rounded-xl transition-all"
                  >
                    Lihat semua {videos.length} video →
                  </Link>
                </RevealBox>
              )}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && videos.length === 0 && (
          <p className="text-center text-zinc-600 py-20 text-sm">
            Tidak ada video ditemukan di playlist ini.
          </p>
        )}
      </div>
    </section>
  );
}
