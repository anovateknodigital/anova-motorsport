"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Komponen Reveal internal untuk NewsSection (seperti pada VideoSection)
function RevealBox({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" | "scale" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case "up": return "translateY(40px)";
      case "left": return "translateX(-40px)";
      case "right": return "translateX(40px)";
      case "scale": return "scale(0.95)";
      default: return "translateY(40px)";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getTransform(),
        transition: `all 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export default function NewsSection() {
  const [recentNews, setRecentNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(3);
      
      if (data) setRecentNews(data);
    };
    fetchNews();
  }, []);

  return (
    <section id="news" className="w-full bg-black/50 border-t border-zinc-900 overflow-hidden relative py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <RevealBox>
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-white flex items-center gap-3">
              News &amp; Updates
            </h3>
            <Link href="/news" className="text-anova-red hover:text-white text-sm font-bold uppercase tracking-wider transition-colors hidden sm:block">
              Lihat Semua Berita &rarr;
            </Link>
          </div>
        </RevealBox>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentNews.map((news, idx) => (
            <RevealBox key={news.id} delay={idx * 100}>
              <Link
                href={`/news/${news.slug}`}
                className="group cursor-pointer block"
              >
                <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden mb-4 relative">
                  <Image
                    src={news.image_url || "https://images.unsplash.com/photo-1625930617993-481e41cc7fda?q=80&w=1200&auto=format&fit=crop"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-105"
                    style={{ transform: "translateZ(0) scale(1.01)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest z-10 shadow-lg">
                    {news.category || "Berita"}
                  </div>
                </div>
                
                <div className="text-anova-red text-xs font-bold uppercase tracking-wider mb-2">
                  {formatDate(news.published_at)}
                </div>
                
                <h4 className="text-lg font-bold text-white group-hover:text-anova-red transition-colors leading-tight line-clamp-2">
                  {news.title}
                </h4>
              </Link>
            </RevealBox>
          ))}
        </div>

        <RevealBox delay={300}>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/news" className="inline-block border border-zinc-800 hover:bg-zinc-800 text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors w-full">
              Lihat Semua Berita
            </Link>
          </div>
        </RevealBox>
      </div>
    </section>
  );
}
