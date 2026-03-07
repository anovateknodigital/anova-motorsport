"use client";

import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Camera, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1625930617993-481e41cc7fda?q=80&w=1200&auto=format&fit=crop",
    title: "Paddock Preparation",
    type: "photo",
    span: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    id: 2,
    url: "https://cdn.medcom.id/dynamic/content/2025/07/13/1768639/X7pS9VTW2A.jpg?w=800",
    title: "Night Drag Race",
    type: "photo",
    span: "col-span-1",
  },
  {
    id: 3,
    url: "https://d34vm3j4h7f97z.cloudfront.net/original/4X/8/7/9/8798a3766550f77660de63c571a51c829cbefd5c.jpeg",
    title: "Kejurnas Motoprix Action",
    type: "photo",
    span: "col-span-1",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1613246273006-7f7476e693d9?q=80&w=1200&auto=format&fit=crop",
    title: "Starting Line",
    type: "photo",
    span: "col-span-1 md:col-span-2 row-span-1",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1625930601622-031b9099d4f6?q=80&w=800&auto=format&fit=crop",
    title: "Rider Concentration",
    type: "photo",
    span: "col-span-1",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1625930545875-b6b0089df67d?q=80&w=800&auto=format&fit=crop",
    title: "High Speed Cornering",
    type: "photo",
    span: "col-span-1",
  },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // IntersectionObserver — scroll reveal
  useEffect(() => {
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
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white">
        
        {/* Page Header */}
        <section className="relative py-20 overflow-hidden border-b border-zinc-900">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1625930617993-481e41cc7fda?q=80&w=1600&auto=format&fit=crop"
              alt="Gallery Header Background"
              fill
              className="object-cover opacity-30 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-zinc-900/80 border border-zinc-800 rounded-full mb-6 relative">
              <Camera className="text-anova-red" size={28} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-anova-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D32F2F]"></span>
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-teko font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-[#D32F2F] mb-6">
              Media Gallery
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Jelajahi momen-momen epik dan adrenalin tinggi dari lensa kamera kami di berbagai ajang balap resmi Anova Motorsport.
            </p>
          </div>
        </section>

        {/* Gallery Grid Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
              {galleryImages.map((item, index) => (
                <div
                  key={item.id}
                  data-reveal="scale"
                  data-delay={index % 3 + 1}
                  className={`relative group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-anova-red/50 transition-colors duration-500 cursor-pointer ${item.span}`}
                  onClick={() => setSelectedImage(item.url)}
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-105"
                    style={{ transform: "translateZ(0) scale(1.01)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h3>
                    <div className="flex items-center gap-2 text-anova-red text-sm font-medium uppercase tracking-widest">
                      {item.type === 'video' ? <Play size={14} /> : <Camera size={14} />}
                      <span>{item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />

      {/* Lightbox / Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ animation: "fadeInPage 0.3s ease-out both" }}
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white hover:text-anova-red transition-colors bg-black/50 p-2 rounded-full cursor-pointer z-[10000]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={32} />
          </button>
          
          <div 
            className="relative w-full max-w-6xl aspect-video sm:aspect-auto sm:h-[85vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Preview"
              fill
              className="object-contain"
              quality={100}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
