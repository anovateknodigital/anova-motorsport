import Image from "next/image";
import Link from "next/link";
import { getNewsList } from "@/lib/data/news";
import { Calendar, ChevronRight } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "News & Updates | Anova Motorsport",
  description: "Berita terbaru, update regulasi, dan informasi event seputar balapan Anova Motorsport.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsList() {
  const newsList = await getNewsList();

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen text-white pt-12 pb-20">
      {/* Header */}
      <div className="w-full bg-zinc-900 border-b border-zinc-800 py-12 mb-12 relative overflow-hidden">
        {/* Background glow red */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D32F2F]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="font-teko text-5xl md:text-7xl font-bold uppercase italic tracking-wider mb-4">News &amp; Updates</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Tetap up-to-date dengan pengumuman event terbaru, regulasi kompetisi, dan sorotan panas dari sirkuit Anova Motorsport.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <Link 
              key={news.id} 
              href={`/news/${news.slug}`}
              className="group flex flex-col bg-zinc-900/40 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(211,47,47,0.06)] hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-105"
                  style={{ transform: "translateZ(0) scale(1.01)" }}
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" /> */}
                <div className="absolute top-4 right-4 bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest z-10 shadow-lg">
                  {news.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3 font-medium uppercase tracking-wide">
                  <div className="flex items-center gap-1.5"><Calendar size={14} className="text-[#D32F2F]" />{formatDate(news.publishedAt)}</div>
                  <span>•</span>
                  <span>{news.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-[#D32F2F] transition-colors line-clamp-2">
                  {news.title}
                </h2>
                
                <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow">
                  {news.excerpt}
                </p>

                <div className="inline-flex mt-auto text-[#D32F2F] font-bold text-sm items-center gap-1 group-hover:gap-2 transition-all">
                  Baca Selengkapnya <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
