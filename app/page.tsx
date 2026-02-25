import Image from "next/image";
import { Instagram, Twitter, Youtube } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="https://images.unsplash.com/photo-1613246273006-7f7476e693d9?q=80&w=2670&auto=format&fit=crop"
          alt="Motoprix Action"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000">
        {/* Logo */}
        <div>
          <Image 
            src="/anova-motorsport-logo.png"
            alt="Anova Motorsport Logo"
            width={300}
            height={90}
            className="w-auto h-16 md:h-24 object-contain mx-auto drop-shadow-lg"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-anova-red/50 bg-anova-red/10 text-anova-red text-xs font-bold tracking-widest uppercase mb-4">
            Situs Sedang Dalam Pengembangan
          </div>
          <h1 className="font-teko text-6xl md:text-8xl lg:text-9xl font-bold uppercase italic leading-[0.9] drop-shadow-2xl">
            Coming <span className="text-anova-red">Soon</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Penyelenggara event balap resmi di bawah naungan IMI. Kami sedang menyiapkan pengalaman digital terbaru untuk Anda. Bersiaplah melesat bersama kami!
          </p>
        </div>

        {/* Social Links */}
        <div className="pt-8 border-t border-zinc-800 w-full max-w-md mx-auto flex flex-col items-center gap-6">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Ikuti Update Kami</p>
          <div className="flex items-center gap-6">
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-anova-red hover:border-anova-red transition-all duration-300 shadow-xl">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-anova-red hover:border-anova-red transition-all duration-300 shadow-xl">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-anova-red hover:border-anova-red transition-all duration-300 shadow-xl">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-center text-zinc-600 text-xs font-medium w-full z-10">
        <p>© 2026 Anova Motorsport</p>
        <p className="mt-1">Powered by ANOVA TEKNO DIGITAL</p>
      </div>
    </div>
  );
}
