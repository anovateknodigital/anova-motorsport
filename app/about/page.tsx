import Image from "next/image";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Mail, ChevronRight, Trophy, Flag, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* 1. Header Navigation */}
      <header className="w-full bg-zinc-950/80 backdrop-blur-md text-white border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="leading-tight shrink-0 flex items-center gap-4 hover:opacity-80 transition-opacity">
            <Image 
              src="/anova-motorsport-logo.png"
              alt="Anova Motorsport Logo"
              width={160}
              height={50}
              className="h-8 md:h-10 w-auto object-contain"
              priority
            />
            <span className="hidden md:flex text-zinc-500 font-bold items-center text-sm uppercase tracking-widest gap-2">
              <ChevronRight size={16} /> Tentang Kami
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-anova-red transition-colors font-medium text-sm uppercase tracking-wider">Kembali ke Beranda</Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero About Page */}
      <section className="relative w-full py-24 md:py-32 flex items-center justify-center border-b border-zinc-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1625930545875-b6b0089df67d?q=80&w=2000&auto=format&fit=crop"
            alt="Motoprix Starting Line Action"
            fill
            className="object-cover opacity-30 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="font-teko text-7xl md:text-9xl font-bold uppercase italic leading-[0.9] text-white drop-shadow-lg mb-6 tracking-wide">
            Our <span className="text-anova-red">Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Dari komunitas balap lokal menjadi promotor olahraga otomotif tingkat nasional. Dedikasi kami membawa atmosfer balap profesional ke seluruh pelosok Riau dan Indonesia.
          </p>
        </div>
      </section>

      {/* 3. Founder Profile Section */}
      <section className="w-full py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Column */}
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
              <Image 
                src="/founder.jpeg"
                alt="Ramli Anova - Founder Anova Motorsport"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 lg:hidden">
                <span className="text-anova-red font-bold uppercase tracking-widest text-xs mb-2 block">Founder & Chairman</span>
                <h3 className="font-teko text-5xl font-bold italic leading-none text-white">RAMLI ANOVA</h3>
              </div>
            </div>

            {/* Text Content Column */}
            <div className="space-y-8">
              <div className="hidden lg:block">
                <span className="inline-block px-3 py-1 rounded border border-anova-red/30 bg-anova-red/10 text-anova-red text-xs font-bold tracking-widest uppercase mb-4">
                  The Visionary
                </span>
                <h2 className="font-teko text-7xl font-bold italic leading-none text-white drop-shadow-lg">
                  RAMLI ANOVA
                </h2>
                <h3 className="text-xl text-zinc-400 font-medium uppercase tracking-widest mt-2">Founder Anova Motorsport</h3>
              </div>

              <div className="space-y-6 text-zinc-300 leading-relaxed text-lg">
                <p>
                  Berawal dari kecintaannya terhadap kecepatan dan mesin, Bapak Ramli Anova mendirikan <strong className="text-white">Anova Motorsport</strong> dengan satu visi sederhana: menyediakan wadah yang profesional, aman, dan berstandar nasional bagi para pembalap muda berbakat di tanah air, khususnya di tanah kelahiran beliau, Riau.
                </p>
                <p>
                  Di bawah arahannya, manajemen Anova Motorsport yang awalnya sekadar penyuka hobi otomotif kini bertransformasi menjadi salah satu penyokong terbesar kemajuan sirkuit dan event balap profesional berstrata nasional bersama Ikatan Motor Indonesia (IMI).
                </p>
                <blockquote className="border-l-4 border-anova-red pl-6 py-2 my-8 text-white italic font-medium text-xl bg-zinc-900/40 rounded-r-lg">
                  "Sirkuit bukan hanya jalan aspal untuk ajang pembuktian mesin tercepat. Ia adalah sekolah perjuangan di mana disiplin, mental pantang menyerah, dan jiwa sportivitas diuji."
                </blockquote>
              </div>

              {/* Contact Card */}
              <div className="inline-flex items-center gap-4 bg-black border border-zinc-800 rounded-full px-6 py-3 hover:bg-zinc-900 transition-colors">
                <div className="w-10 h-10 bg-anova-red/10 rounded-full flex items-center justify-center text-anova-red shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Direct Email</p>
                  <a href="mailto:anova@anovamotorsport.com" className="text-white font-medium hover:text-anova-red transition-colors">anova@anovamotorsport.com</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Core Values Summary */}
      <section className="w-full bg-anova-red py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-black/20 p-8 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm border border-white/10">
              <Trophy size={48} className="text-white mb-6 opacity-90" />
              <h4 className="text-2xl font-bold text-white mb-3 tracking-wide">Profesionalisme</h4>
              <p className="text-white/80 leading-relaxed">Penyelenggaraan berstandar ketat, transparansi regulasi, dan sistem kompetisi yang adil bagi setiap tim balap.</p>
            </div>
            <div className="bg-black/20 p-8 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm border border-white/10">
              <Flag size={48} className="text-white mb-6 opacity-90" />
              <h4 className="text-2xl font-bold text-white mb-3 tracking-wide">Semangat Olahraga</h4>
              <p className="text-white/80 leading-relaxed">Menghapus balap liar melalui wadah resmi. Membentuk mental bertanding yang memegang teguh nilai fair-play.</p>
            </div>
            <div className="bg-black/20 p-8 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm border border-white/10">
              <Users size={48} className="text-white mb-6 opacity-90" />
              <h4 className="text-2xl font-bold text-white mb-3 tracking-wide">Pemberdayaan Lokal</h4>
              <p className="text-white/80 leading-relaxed">Melibatkan ekonomi masyarakat sekitar sirkuit dan membuka potensi pariwisata otomotif sport di Kabupaten Kampar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer (Simple variant) */}
      <footer className="w-full bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center">
          <Image 
            src="/anova-motorsport-logo.png"
            alt="Anova Motorsport Logo"
            width={150}
            height={40}
            className="h-10 md:h-12 w-auto object-contain mb-6"
          />
          <div className="flex items-center gap-6 text-zinc-500 mb-8">
            <a href="#" className="hover:text-white transition-colors"><Instagram size={24} /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter size={24} /></a>
            <a href="#" className="hover:text-white transition-colors"><Youtube size={24} /></a>
          </div>
          <p className="text-zinc-600 text-sm font-medium">
            © 2026 Anova Motorsport. Powered by ANOVA TEKNO DIGITAL
          </p>
        </div>
      </footer>
    </div>
  );
}
