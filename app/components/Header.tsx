"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Instagram, Twitter, Youtube, Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname() || "";

  // Helper function untuk menentukan apakah sebuah path saat ini sedang aktif
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    if (path.startsWith("/#")) {
      return false; // hash statis tidak men-trigger active header
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Race Results", href: "/results" },
    { name: "Gallery", href: "/gallery" },
    { name: "News", href: "/news" },
  ];

  return (
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
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link key={link.name} href={link.href} className={`relative group transition-colors ${active ? "text-anova-red font-bold" : "hover:text-anova-red"}`}>
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-anova-red transition-all duration-300 origin-left ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/events" className="bg-anova-red hover:bg-anova-red-hover text-white px-6 py-2.5 rounded font-bold uppercase tracking-wide text-sm transition-all hover:scale-105 active:scale-95">
            Daftar Event Sekarang
          </Link>
        </div>

        <button
          className="md:hidden text-zinc-900 border-none bg-transparent"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full h-[calc(100vh-80px)] bg-white z-40 md:hidden flex flex-col px-6 py-8 overflow-y-auto shadow-xl">
          <nav className="flex flex-col gap-6 text-xl font-bold border-b border-zinc-100 pb-8 mb-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors ${active ? "text-anova-red" : "hover:text-anova-red"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col gap-6 mt-auto">
            <Link 
              href="/events" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-anova-red hover:bg-anova-red-hover flex items-center justify-center text-white px-6 py-4 rounded font-bold uppercase tracking-wide text-sm transition-colors w-full"
            >
              Daftar Event Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

