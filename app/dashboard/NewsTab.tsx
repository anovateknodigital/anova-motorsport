"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  ExternalLink,
  Loader2,
  X,
  Save,
  Newspaper,
  User,
  Clock,
} from "lucide-react";

function formatDate(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toDateTimeLocal(isoString: string | null) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function NewsTab() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Berita",
    author: "Admin",
    read_time: "3 Menit",
    published_at: "",
    image_url: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching news:", error);
    } else {
      setNews(data || []);
    }
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (showDeleteModal === null) return;
    setSaving(true);
    const { error } = await supabase.from("news").delete().eq("id", showDeleteModal);
    if (error) {
      console.error("Error deleting news:", error);
      alert("Gagal menghapus berita.");
    } else {
      setNews((prev) => prev.filter((n) => n.id !== showDeleteModal));
      setShowDeleteModal(null);
    }
    setSaving(false);
  };
  
  const handleEditClick = (item: any) => {
    setEditNewsId(item.id);
    setFormData({
      title: item.title || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      category: item.category || "Berita",
      author: item.author || "Admin",
      read_time: item.read_time || "3 Menit",
      published_at: toDateTimeLocal(item.published_at),
      image_url: item.image_url || "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setEditNewsId(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Berita",
      author: "Admin",
      read_time: "3 Menit",
      published_at: toDateTimeLocal(new Date().toISOString()),
      image_url: "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Auto-generate slug from title
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    let imageUrl = "";

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("events") // Reusing events bucket for simplicity or we can create news bucket
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from("events").getPublicUrl(fileName).data.publicUrl;
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Gagal mengunggah gambar. Pastikan format file sesuai.");
      setSaving(false);
      return;
    }

    const payload: any = {
      ...formData,
      slug,
      published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString(),
    };
    if (imageUrl) payload.image_url = imageUrl;

    let request;
    if (editNewsId) {
      request = supabase.from("news").update(payload).eq("id", editNewsId).select();
    } else {
      request = supabase.from("news").insert([payload]).select();
    }

    const { data, error } = await request;

    if (error) {
      console.error("Error saving news:", error);
      alert("Gagal menyimpan berita.");
    } else if (data) {
      if (editNewsId) {
        setNews(prev => prev.map(n => n.id === editNewsId ? data[0] : n));
      } else {
        setNews(prev => [data[0], ...prev]);
      }
      setShowModal(false);
      setImageFile(null);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-teko text-3xl md:text-4xl font-bold text-white uppercase italic">
            Management News & Updates
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Kelola artikel, berita, panduan teknis, dan regulasi balap.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
            <Filter size={16} className="text-zinc-500" />
            Filter
          </button>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg transition-all"
          >
            <Plus size={16} />
            Buat Artikel Baru
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Cari judul berita..."
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg pl-10 pr-4 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-zinc-600 appearance-none min-w-[140px]">
            <option>Semua Kategori</option>
            <option>Berita</option>
            <option>Panduan</option>
            <option>Regulasi</option>
            <option>Teknis</option>
          </select>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#D32F2F] animate-spin" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800/60 rounded-xl border-dashed">
          <p className="text-zinc-500">Belum ada berita yang dipublikasikan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="group relative bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 rounded-xl overflow-hidden transition-all flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden shrink-0">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title || "News Image"}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-600 font-medium">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 left-3 flex gap-2 z-20">
                  <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                    {item.category || "Berita"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                  <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#D32F2F]" /> {formatDate(item.published_at)}</span>
                  <span className="flex items-center gap-1.5"><User size={13} className="text-[#D32F2F]" /> {item.author}</span>
                </div>
                
                <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-sm text-zinc-400 mb-6 line-clamp-3 leading-relaxed flex-1">
                  {item.excerpt}
                </p>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/60 pt-4 mt-auto">
                  <button 
                    onClick={() => handleEditClick(item)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs font-semibold"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <a 
                    href={`/news/${item.slug}`}
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors text-xs font-semibold"
                  >
                    <ExternalLink size={14} />
                    Lihat
                  </a>
                  <button 
                    onClick={() => setShowDeleteModal(item.id)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-semibold"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE/EDIT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
              <h2 className="font-teko text-2xl font-bold text-white uppercase italic">
                {editNewsId ? "Edit Artikel" : "Buat Artikel Baru"}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-zinc-800/60 pb-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Judul Artikel *</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul artikel"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Kategori</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors appearance-none"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Panduan">Panduan</option>
                    <option value="Regulasi">Regulasi</option>
                    <option value="Teknis">Teknis</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tanggal Publikasi</label>
                  <input 
                    type="datetime-local" 
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Penulis</label>
                  <input 
                    type="text" 
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Contoh: Tim Redaksi"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Waktu Baca</label>
                  <input 
                    type="text" 
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleInputChange}
                    placeholder="Contoh: 3 Menit"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ringkasan / Excerpt</label>
                <textarea 
                  name="excerpt"
                  required
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Ringkasan singkat yang muncul di card depan..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Konten Utama (Terima Tag HTML)</label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="<p>Tulis artikel lengkap di sini...</p>"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors resize-none font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gambar Cover</label>
                {(imageFile || formData.image_url) && (
                  <div className="relative w-full max-w-sm h-48 mb-3 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 group">
                    <Image 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                      alt="Thumbnail Preview" 
                      fill 
                      className="object-cover"
                    />
                    {imageFile && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); setImageFile(null); }}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#D32F2F] transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#D32F2F] file:text-white hover:file:bg-[#B71C1C] cursor-pointer"
                />
                {editNewsId && !imageFile && formData.image_url && <p className="text-[10px] text-zinc-500 mt-1">Kosongkan jika tidak ingin mengubah gambar</p>}
              </div>

            </div>

            <div className="border-t border-zinc-800 p-6 flex justify-end gap-3 shrink-0 bg-zinc-950/80 rounded-b-2xl">
              <button 
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveNews}
                disabled={saving || !formData.title || !formData.excerpt}
                className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Menyimpan..." : "Simpan Berita"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {showDeleteModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(null)} />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-teko text-2xl font-bold text-white uppercase italic text-center mb-2">Hapus Berita?</h3>
            <p className="text-zinc-400 text-sm text-center mb-6">
              Artikel yang sudah dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
