"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Instagram, Youtube } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Icon Tiktok custom sederhana menggunakan SVG karena lucide-react versi tertentu mungkin tidak ada
const TiktokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [settings, setSettings] = useState<any>(null);

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

  return (
    <footer ref={footerRef} data-reveal className="w-full bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/anova-motorsport-logo.png"
              alt="Anova Motorsport Logo"
              width={200}
              height={60}
              className="h-10 md:h-12 w-auto object-contain"
              priority={false}
            />
          </Link>
          <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mb-6">
            Penyelenggara event balap resmi di bawah naungan IMI. Kami berdedikasi untuk memajukan olahraga otomotif Indonesia.
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <a href={settings?.instagram_url || "#"} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all"><Instagram size={20} /></a>
            <a href={settings?.tiktok_url || "#"} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all"><TiktokIcon size={20} /></a>
            <a href={settings?.youtube_url || "#"} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all"><Youtube size={20} /></a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Sekretariat</h4>
            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
              {settings?.address || "Cafe Tuah Sungai Jantan, Jl. A. Yani\nBangkinang, Kampar\nRiau, 28411"}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Person</h4>
            <p className="text-zinc-400 text-sm leading-relaxed mb-2"><span className="block text-zinc-500 text-xs">Pendaftaran (WA)</span>
              {settings?.whatsapp 
                ? <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">+{settings.whatsapp}</a> 
                : "+62 819-7340-0100"
              }
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed"><span className="block text-zinc-500 text-xs">Email</span>
              {settings?.contact_email ? <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">{settings.contact_email}</a> : "info@anovamotorsport.com"}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-zinc-900 text-center md:text-left flex flex-col md:flex-row items-center justify-between text-zinc-600 text-xs font-medium">
        <p>© 2026 Anova Motorsport. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Powered by ANOVA TEKNO DIGITAL</p>
      </div>
    </footer>
  );
}
