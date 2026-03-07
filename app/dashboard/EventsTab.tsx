"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar,
  Clock,
  MapPin,
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
  FileText,
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

export function EventsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Motoprix",
    start_date: "",
    end_date: "",
    time_info: "",
    location: "",
    description: "",
    status: "upcoming",
    image_url: "",
    overlay_image: "",
    regulation_file_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [overlayImageFile, setOverlayImageFile] = useState<File | null>(null);
  const [regulationFile, setRegulationFile] = useState<File | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false });
    
    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (showDeleteModal === null) return;
    setSaving(true);
    const { error } = await supabase.from("events").delete().eq("id", showDeleteModal);
    if (error) {
      console.error("Error deleting event:", error);
      alert("Gagal menghapus event. Mungkin masih ada pendaftaran yang terkait dengan event ini.");
    } else {
      setEvents((prev) => prev.filter((e) => e.id !== showDeleteModal));
      setShowDeleteModal(null);
    }
    setSaving(false);
  };
  
  const handleEditClick = (event: any) => {
    setEditEventId(event.id);
    setFormData({
      title: event.title || "",
      category: event.category || "Motoprix",
      start_date: toDateTimeLocal(event.start_date),
      end_date: toDateTimeLocal(event.end_date),
      time_info: event.time_info || "",
      location: event.location || "",
      description: event.description || "",
      status: event.status || "upcoming",
      image_url: event.image_url || "",
      overlay_image: event.overlay_image || "",
      regulation_file_url: event.regulation_file_url || "",
    });
    setImageFile(null);
    setOverlayImageFile(null);
    setRegulationFile(null);
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setEditEventId(null);
    setFormData({
      title: "",
      category: "Motoprix",
      start_date: "",
      end_date: "",
      time_info: "",
      location: "",
      description: "",
      status: "upcoming",
      image_url: "",
      overlay_image: "",
      regulation_file_url: "",
    });
    setImageFile(null);
    setOverlayImageFile(null);
    setRegulationFile(null);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Auto-generate slug from title
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    let imageUrl = "";
    let overlayImageUrl = "";
    let regulationUrl = "";

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${slug}-banner-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("events")
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from("events").getPublicUrl(fileName).data.publicUrl;
      }
      
      if (overlayImageFile) {
        const fileExt = overlayImageFile.name.split('.').pop();
        const fileName = `${slug}-overlay-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("events")
          .upload(fileName, overlayImageFile);
          
        if (uploadError) throw uploadError;
        overlayImageUrl = supabase.storage.from("events").getPublicUrl(fileName).data.publicUrl;
      }
      
      if (regulationFile) {
        const fileExt = regulationFile.name.split('.').pop();
        const fileName = `${slug}-regulasi-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("events")
          .upload(fileName, regulationFile);
          
        if (uploadError) throw uploadError;
        regulationUrl = supabase.storage.from("events").getPublicUrl(fileName).data.publicUrl;
      }
    } catch (err) {
      console.error("Error uploading images:", err);
      alert("Gagal mengunggah gambar. Pastikan format file sesuai.");
      setSaving(false);
      return;
    }

    const payload: any = {
      ...formData,
      slug,
      // Map empty dates to null if needed or rely on required fields
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
    };
    if (imageUrl) payload.image_url = imageUrl;
    if (overlayImageUrl) payload.overlay_image = overlayImageUrl;
    if (regulationUrl) payload.regulation_file_url = regulationUrl;

    let request;
    if (editEventId) {
      request = supabase.from("events").update(payload).eq("id", editEventId).select();
    } else {
      request = supabase.from("events").insert([payload]).select();
    }

    const { data, error } = await request;

    if (error) {
      console.error("Error saving event:", error);
      alert("Gagal menyimpan event");
    } else if (data) {
      if (editEventId) {
        setEvents(prev => prev.map(e => e.id === editEventId ? data[0] : e));
      } else {
        setEvents(prev => [data[0], ...prev]);
      }
      setShowModal(false);
      // Reset form
      setFormData({
        title: "",
        category: "Motoprix",
        start_date: "",
        end_date: "",
        time_info: "",
        location: "",
        description: "",
        status: "upcoming",
        image_url: "",
        overlay_image: "",
        regulation_file_url: "",
      });
      setImageFile(null);
      setOverlayImageFile(null);
      setRegulationFile(null);
    }
    setSaving(false);
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-teko text-3xl md:text-4xl font-bold text-white uppercase italic">
            Manajemen Event
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Kelola jadwal balap dan pendaftaran peserta.
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
            Buat Event Baru
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
            placeholder="Cari nama event, lokasi..."
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg pl-10 pr-4 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-zinc-600 appearance-none min-w-[140px]">
            <option>Semua Kategori</option>
            <option>Motoprix</option>
            <option>Drag Race</option>
            <option>Grasstrack</option>
          </select>
          <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-zinc-600 appearance-none min-w-[140px]">
            <option>Semua Status</option>
            <option>Akan Datang</option>
            <option>Selesai</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#D32F2F] animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800/60 rounded-xl border-dashed">
          <p className="text-zinc-500">Belum ada data event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 rounded-xl overflow-hidden transition-all flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden shrink-0">
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title || "Event Image"}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-600 font-medium">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
                
                {event.overlay_image && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 z-10 pointer-events-none opacity-50 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500">
                    <Image
                      src={event.overlay_image}
                      alt="Sirkuit Overlay"
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                )}
                
                <div className="absolute top-3 left-3 flex gap-2 z-20">
                  <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                    {event.category || "Uncategorized"}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm border ${
                      event.status === "upcoming"
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {event.status === "upcoming" ? "Akan Datang" : "Selesai"}
                  </span>
                </div>
                
                <button className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-white text-lg mb-4 line-clamp-2 leading-tight">
                  {event.title}
                </h3>

                <div className="space-y-2.5 text-xs text-zinc-400 mb-6 flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#D32F2F] shrink-0" />
                    <span className="truncate">
                      {formatDate(event.start_date)} {event.end_date ? `- ${formatDate(event.end_date)}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#D32F2F] shrink-0" />
                    <span className="truncate">{event.time_info || "-"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[#D32F2F] shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">
                      {event.location || "-"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-zinc-800/60 pt-4 mt-auto">
                  <button 
                    onClick={() => handleEditClick(event)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-[11px] font-semibold"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors text-[11px] font-semibold">
                    <ExternalLink size={14} />
                    Live
                  </button>
                  {event.regulation_file_url ? (
                    <a 
                      href={event.regulation_file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors text-[11px] font-semibold"
                    >
                      <FileText size={14} />
                      Regulasi
                    </a>
                  ) : (
                    <button disabled className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-600 cursor-not-allowed text-[11px] font-semibold">
                      <FileText size={14} />
                      Regulasi
                    </button>
                  )}
                  <button 
                    onClick={() => setShowDeleteModal(event.id)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-[11px] font-semibold"
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

      {/* ── CREATE EVENT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
              <h2 className="font-teko text-2xl font-bold text-white uppercase italic">
                {editEventId ? "Edit Event" : "Buat Event Baru"}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Judul Event *</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Contoh: KEJURNAS ANOVA MOTOPRIX 2026"
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
                    <option value="Motoprix">Motoprix</option>
                    <option value="Drag Race">Drag Race</option>
                    <option value="Drag Bike">Drag Bike</option>
                    <option value="Grasstrack">Grasstrack</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors appearance-none"
                  >
                    <option value="upcoming">Akan Datang (Upcoming)</option>
                    <option value="past">Selesai (Past)</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Mulai Tanggal</label>
                  <input 
                    type="datetime-local" 
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sampai Tanggal</label>
                  <input 
                    type="datetime-local" 
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Waktu / Jam Info</label>
                  <input 
                    type="text" 
                    name="time_info"
                    value={formData.time_info}
                    onChange={handleInputChange}
                    placeholder="Contoh: 08:00 - 17:00 WIB"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lokasi Sirkuit</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Contoh: Sirkuit Permanent Sport Centre Bangkinang"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Deskripsi / Detail</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tuliskan deskripsi lengkap event ini..."
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gambar Banner</label>
                  {(imageFile || formData.image_url) && (
                    <div className="relative w-full h-36 mb-3 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 group">
                      <Image 
                        src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                        alt="Banner Preview" 
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
                  {editEventId && !imageFile && formData.image_url && <p className="text-[10px] text-zinc-500 mt-1">Kosongkan jika tidak ingin mengubah gambar</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gambar Overlay (Sirkuit)</label>
                  {(overlayImageFile || formData.overlay_image) && (
                    <div className="relative w-full h-36 mb-3 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 group flex items-center justify-center">
                      <div className="relative w-24 h-24">
                        <Image 
                          src={overlayImageFile ? URL.createObjectURL(overlayImageFile) : formData.overlay_image} 
                          alt="Overlay Preview" 
                          fill 
                          className="object-contain brightness-0 invert"
                        />
                      </div>
                      {overlayImageFile && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); setOverlayImageFile(null); }}
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
                    onChange={(e) => setOverlayImageFile(e.target.files?.[0] || null)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#D32F2F] transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#D32F2F] file:text-white hover:file:bg-[#B71C1C] cursor-pointer"
                  />
                  {editEventId && !overlayImageFile && formData.overlay_image && <p className="text-[10px] text-zinc-500 mt-1">Kosongkan jika tidak ingin mengubah gambar</p>}
                </div>

                <div className="space-y-1.5 sm:col-span-2 border-t border-zinc-800/60 pt-4 mt-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} />
                    File Regulasi / Detail Event (Opsional)
                  </label>
                  <div className="flex flex-col gap-2">
                    {formData.regulation_file_url && !regulationFile && (
                      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-3">
                        <FileText size={24} className="text-emerald-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">Regulasi Saat Ini Tersimpan</p>
                          <a href={formData.regulation_file_url} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-400 hover:underline">
                            Lihat File
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {regulationFile && (
                      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-3 group">
                        <FileText size={24} className="text-blue-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{regulationFile.name}</p>
                          <p className="text-[10px] text-zinc-500">Akan diunggah</p>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); setRegulationFile(null); }}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full p-1.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setRegulationFile(e.target.files?.[0] || null)}
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#D32F2F] transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Hanya menerima format file PDF/Word.</p>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-800 p-6 flex justify-end gap-3 shrink-0 bg-zinc-950/80 rounded-b-2xl">
              <button 
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveEvent}
                disabled={saving || !formData.title}
                className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Menyimpan..." : "Simpan Event"}
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
            <h3 className="font-teko text-2xl font-bold text-white uppercase italic text-center mb-2">Hapus Event?</h3>
            <p className="text-zinc-400 text-sm text-center mb-6">
              Data event yang sudah dihapus tidak dapat dikembalikan.
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
