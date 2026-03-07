import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getNewsBySlug, getNewsList } from "@/lib/data/news";
import { Calendar, User, Clock, ArrowLeft, Tag } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const news = await getNewsBySlug(resolvedParams.slug);
  if (!news) return { title: "Not Found" };
  return {
    title: `${news.title} | Anova Motorsport`,
    description: news.excerpt,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const news = await getNewsBySlug(resolvedParams.slug);
  if (!news) notFound();

  // Cari berita lain untuk "Berita Lainnya" section
  const allNews = await getNewsList();
  const relatedNews = allNews.filter(n => n.id !== news.id).slice(0, 3);

  return (
    <>
      <Header />
      <article className="bg-black min-h-screen pt-12 pb-20">
      
      {/* ── Hero Image & Title ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mb-12">
        <Link 
          href="/news" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-sm font-semibold group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Berita
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest shadow-lg">
            {news.category || "Berita"}
          </span>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium tracking-wide">
            <Calendar size={14} /> {formatDate(news.published_at)}
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-white leading-[1.15] mb-6">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 border-b border-zinc-800 pb-6 mb-8">
          <div className="flex items-center gap-2"><User size={16} className="text-[#D32F2F]" /> Ditulis oleh <strong className="text-white">{news.author}</strong></div>
          <div className="flex items-center gap-2"><Clock size={16} className="text-[#D32F2F]" /> Waktu baca: <strong className="text-white">{news.read_time}</strong></div>
        </div>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-zinc-800 bg-zinc-900 shadow-2xl">
          <Image
            src={news.image_url || "https://images.unsplash.com/photo-1625930617993-481e41cc7fda?q=80&w=1200&auto=format&fit=crop"}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ── Konten Artikel ─────────────────────────────────────── */}
        <div 
          className="prose prose-invert prose-red max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
            prose-ul:text-zinc-300 prose-ul:mb-6 prose-li:my-1
            prose-ol:text-zinc-300 prose-ol:mb-6 prose-li:my-1
            prose-strong:text-white prose-strong:font-bold
            prose-a:text-[#D32F2F] prose-a:font-semibold hover:prose-a:text-white
            prose-blockquote:border-l-4 prose-blockquote:border-[#D32F2F] prose-blockquote:bg-zinc-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-zinc-200 prose-blockquote:italic
            prose-hr:border-zinc-800
          "
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
        
        {/* Tags / Kategori footer */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex items-center gap-3">
          <Tag size={18} className="text-zinc-500" />
          <span className="text-sm font-medium text-zinc-400">Tag:</span>
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-full cursor-pointer hover:bg-zinc-800 transition-colors">
            {news.category || "Berita"}
          </span>
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-full cursor-pointer hover:bg-zinc-800 transition-colors">
            Anova Motorsport
          </span>
        </div>
      </div>

      {/* ── Related News ─────────────────────────────────────── */}
      {relatedNews.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24 border-t border-zinc-900 pt-16">
          <h3 className="text-2xl font-bold text-white mb-8">Berita Lainnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((rel) => (
              <Link 
                key={rel.id} 
                href={`/news/${rel.slug}`}
                className="group flex flex-col bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800 rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:border-zinc-600"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <Image src={rel.image_url || "https://images.unsplash.com/photo-1625930617993-481e41cc7fda?q=80&w=1200&auto=format&fit=crop"} alt={rel.title} fill className="object-cover transition-transform duration-500 scale-[1.01] group-hover:scale-105" style={{ transform: "translateZ(0) scale(1.01)" }} />
                </div>
                <div className="p-5">
                  <div className="text-[#D32F2F] text-[10px] font-bold uppercase tracking-widest mb-2">{rel.category || "Berita"}</div>
                  <h4 className="text-white font-bold mb-2 group-hover:text-[#D32F2F] transition-colors line-clamp-2">{rel.title}</h4>
                  <div className="text-zinc-500 text-xs">{formatDate(rel.published_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
    <Footer />
    </>
  );
}
