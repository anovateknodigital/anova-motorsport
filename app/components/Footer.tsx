"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Instagram, Twitter, Youtube } from "lucide-react";

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
            <a href="#" className="hover:text-white hover:scale-110 transition-all"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white hover:scale-110 transition-all"><Twitter size={20} /></a>
            <a href="#" className="hover:text-white hover:scale-110 transition-all"><Youtube size={20} /></a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Sekretariat</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">Cafe Tuah Sungai Jantan, Jl. A. Yani<br />Bangkinang, Kampar<br />Riau, 28411</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Person</h4>
            <p className="text-zinc-400 text-sm leading-relaxed mb-2"><span className="block text-zinc-500 text-xs">Pendaftaran (WA)</span>+62 819-7340-0100</p>
            <p className="text-zinc-400 text-sm leading-relaxed"><span className="block text-zinc-500 text-xs">Darurat Event</span>+62 812 9988 7766</p>
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
