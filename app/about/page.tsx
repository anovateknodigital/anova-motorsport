import Image from "next/image";
import Link from "next/link";
import { Mail, Trophy, Flag, Users, IdCard } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function About() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-black text-white">

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

              {/* KTA IMI Badge - Tampil Global di Mobile & Desktop */}
              <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl hover:border-anova-red/50 transition-all hover:scale-[1.02] w-full md:max-w-max relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-anova-red/10 rounded-full blur-2xl group-hover:bg-anova-red/20 transition-colors pointer-events-none" />
                
                <div className="w-14 h-14 bg-black border border-anova-red/30 flex items-center justify-center text-anova-red rounded-lg shrink-0 relative z-10 shadow-[0_0_15px_rgba(211,47,47,0.15)]">
                  <IdCard size={28} />
                </div>
                
                <div className="relative z-10 flex flex-col pr-4">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Ikatan Motor Indonesia</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg text-zinc-300 font-medium">No. KTA:</span>
                    <span className="font-mono text-2xl font-bold text-white tracking-widest group-hover:text-anova-red transition-colors">1111585193</span>
                  </div>
                </div>
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

      </div>
      <Footer />
    </>
  );
}
