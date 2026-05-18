"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Plus, Pencil, Trash2, X, Check, Loader2,
  GripVertical, Eye, EyeOff, ExternalLink, Star,
  AlertTriangle, Image as ImageIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

type SponsorDraft = Omit<Sponsor, "id" | "created_at">;

const EMPTY_DRAFT: SponsorDraft = {
  name: "",
  logo_url: "",
  website_url: "",
  is_active: true,
  sort_order: 0,
};

// ─── Helper: Logo preview with fallback ──────────────────────────
function LogoPreview({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-800 rounded">
        <ImageIcon size={20} className="text-zinc-600" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      fill
      className="object-contain p-1"
      onError={() => setError(true)}
      unoptimized={src.startsWith("http")}
    />
  );
}

// ─── Modal Form ───────────────────────────────────────────────────
function SponsorFormModal({
  initial,
  onSave,
  onClose,
  isSaving,
}: {
  initial: SponsorDraft & { id?: string };
  onSave: (data: SponsorDraft & { id?: string }) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<SponsorDraft & { id?: string }>(initial);
  const [previewUrl, setPreviewUrl] = useState(initial.logo_url);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const set = (key: keyof SponsorDraft, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h3 className="font-teko text-xl font-bold text-white uppercase italic">
            {form.id ? "Edit Sponsor" : "Tambah Sponsor"}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Logo Preview */}
          <div className="flex justify-center">
            <div className="relative w-48 h-24 bg-white rounded-xl overflow-hidden border border-zinc-700 shadow-inner">
              <LogoPreview src={previewUrl} name={form.name} />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Nama Sponsor <span className="text-red-400">*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              placeholder="Contoh: Shell Advance"
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-4 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              URL Logo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.logo_url}
              onChange={(e) => {
                set("logo_url", e.target.value);
                setPreviewUrl(e.target.value);
              }}
              required
              placeholder="https://example.com/logo.png atau /logo-lokal.png"
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-4 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <p className="text-zinc-600 text-[11px] mt-1">
              Gunakan URL gambar eksternal atau path aset lokal (mis. /nama-logo.png)
            </p>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Website (opsional)
            </label>
            <input
              type="url"
              value={form.website_url ?? ""}
              onChange={(e) => set("website_url", e.target.value)}
              placeholder="https://sponsor.com"
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-4 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Sort Order + Active */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Urutan Tampil
              </label>
              <input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
            <div className="flex flex-col justify-end pb-0.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Status
              </label>
              <button
                type="button"
                onClick={() => set("is_active", !form.is_active)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                  form.is_active
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-zinc-800 border-zinc-700 text-zinc-500"
                }`}
              >
                {form.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                {form.is_active ? "Aktif" : "Nonaktif"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || !form.name || !form.logo_url}
              className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────
function DeleteModal({
  name,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <h3 className="font-teko text-2xl font-bold text-white text-center uppercase italic mb-1">
          Hapus Sponsor?
        </h3>
        <p className="text-zinc-400 text-sm text-center mb-6">
          <span className="text-zinc-200 font-semibold">&ldquo;{name}&rdquo;</span> akan dihapus
          permanen dan tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 ${
        type === "success"
          ? "bg-emerald-950 border-emerald-700 text-emerald-300"
          : "bg-red-950 border-red-700 text-red-300"
      }`}
    >
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
      {message}
    </div>
  );
}

// ─── Main SponsorsTab ─────────────────────────────────────────────
export default function SponsorsTab() {
  const supabase = createClient();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState<null | (SponsorDraft & { id?: string })>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sponsor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  // Fetch all sponsors (including inactive for dashboard)
  async function fetchSponsors() {
    setLoading(true);
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      showToast("Gagal memuat data sponsor", "error");
    } else {
      setSponsors((data as Sponsor[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSponsors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save (create or update)
  async function handleSave(draft: SponsorDraft & { id?: string }) {
    setIsSaving(true);
    const payload: SponsorDraft = {
      name: draft.name.trim(),
      logo_url: draft.logo_url.trim(),
      website_url: draft.website_url?.trim() || null,
      is_active: draft.is_active,
      sort_order: draft.sort_order,
    };

    let error;
    if (draft.id) {
      ({ error } = await supabase.from("sponsors").update(payload).eq("id", draft.id));
    } else {
      ({ error } = await supabase.from("sponsors").insert(payload));
    }

    setIsSaving(false);
    if (error) {
      showToast("Gagal menyimpan sponsor: " + error.message, "error");
    } else {
      showToast(draft.id ? "Sponsor berhasil diperbarui!" : "Sponsor berhasil ditambahkan!", "success");
      setFormModal(null);
      fetchSponsors();
    }
  }

  // Delete
  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const { error } = await supabase.from("sponsors").delete().eq("id", deleteTarget.id);
    setIsDeleting(false);
    if (error) {
      showToast("Gagal menghapus sponsor: " + error.message, "error");
    } else {
      showToast("Sponsor berhasil dihapus", "success");
      setDeleteTarget(null);
      fetchSponsors();
    }
  }

  // Toggle active
  async function handleToggleActive(s: Sponsor) {
    const { error } = await supabase
      .from("sponsors")
      .update({ is_active: !s.is_active })
      .eq("id", s.id);
    if (error) {
      showToast("Gagal mengubah status", "error");
    } else {
      showToast(`Sponsor ${!s.is_active ? "diaktifkan" : "dinonaktifkan"}`, "success");
      setSponsors((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: !x.is_active } : x)));
    }
  }

  return (
    <>
      {toast && <Toast {...toast} />}
      {formModal && (
        <SponsorFormModal
          initial={formModal}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
          isSaving={isSaving}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-teko text-3xl font-bold text-white uppercase italic">
            Manajemen Sponsor
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Kelola logo sponsor yang tampil di halaman utama (marquee banner).
          </p>
        </div>
        <button
          onClick={() =>
            setFormModal({ ...EMPTY_DRAFT, sort_order: (sponsors.at(-1)?.sort_order ?? 0) + 1 })
          }
          className="flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0"
        >
          <Plus size={16} />
          Tambah Sponsor
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Sponsor", value: sponsors.length, color: "text-white" },
          { label: "Aktif", value: sponsors.filter((s) => s.is_active).length, color: "text-emerald-400" },
          { label: "Nonaktif", value: sponsors.filter((s) => !s.is_active).length, color: "text-zinc-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-4">
            <p className="text-zinc-500 text-xs font-medium mb-1">{label}</p>
            <p className={`font-teko text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Sponsor Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-zinc-600" />
        </div>
      ) : sponsors.length === 0 ? (
        <div className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center py-20 text-center gap-4">
          <Star size={36} className="text-zinc-700" />
          <div>
            <p className="text-zinc-400 font-semibold">Belum ada sponsor</p>
            <p className="text-zinc-600 text-sm mt-1">Klik tombol &ldquo;Tambah Sponsor&rdquo; untuk memulai.</p>
          </div>
          <button
            onClick={() => setFormModal({ ...EMPTY_DRAFT, sort_order: 1 })}
            className="flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <Plus size={16} />
            Tambah Sponsor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className={`group relative bg-zinc-900/80 border rounded-xl overflow-hidden flex flex-col transition-all duration-200 ${
                s.is_active
                  ? "border-zinc-800/60 hover:border-zinc-600"
                  : "border-zinc-800/30 opacity-60 hover:opacity-80"
              }`}
            >
              {/* Logo area */}
              <div className="relative bg-white h-32 w-full overflow-hidden rounded-t-xl">
                <LogoPreview src={s.logo_url} name={s.name} />
                {/* Status badge */}
                <span
                  className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    s.is_active
                      ? "bg-emerald-500/90 text-white"
                      : "bg-zinc-700 text-zinc-400"
                  }`}
                >
                  {s.is_active ? "Aktif" : "Nonaktif"}
                </span>
                {/* Sort order badge */}
                <span className="absolute top-2 right-2 bg-black/60 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <GripVertical size={10} />#{s.sort_order}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col gap-1">
                <p className="text-white font-bold text-sm truncate">{s.name}</p>
                {s.website_url ? (
                  <a
                    href={s.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 text-xs hover:text-[#D32F2F] flex items-center gap-1 truncate transition-colors"
                  >
                    <ExternalLink size={10} />
                    {s.website_url.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <p className="text-zinc-700 text-xs italic">Tidak ada website</p>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 border-t border-zinc-800/60 divide-x divide-zinc-800/60">
                <button
                  onClick={() => handleToggleActive(s)}
                  title={s.is_active ? "Nonaktifkan" : "Aktifkan"}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                >
                  {s.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                  {s.is_active ? "Nonaktif" : "Aktifkan"}
                </button>
                <button
                  onClick={() =>
                    setFormModal({
                      id: s.id,
                      name: s.name,
                      logo_url: s.logo_url,
                      website_url: s.website_url,
                      is_active: s.is_active,
                      sort_order: s.sort_order,
                    })
                  }
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(s)}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={13} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Preview hint ── */}
      {sponsors.length > 0 && (
        <div className="mt-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D32F2F]/10 flex items-center justify-center shrink-0 mt-0.5">
            <Star size={15} className="text-[#D32F2F]" />
          </div>
          <div>
            <p className="text-zinc-300 text-sm font-semibold">Info Tampilan</p>
            <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">
              Logo sponsor yang berstatus <span className="text-emerald-400 font-medium">Aktif</span> akan
              tampil secara otomatis di bagian <strong className="text-zinc-400">Official Partners</strong>{" "}
              halaman utama dalam bentuk marquee scrolling. Urutan ditentukan oleh nilai{" "}
              <strong className="text-zinc-400">Urutan Tampil</strong>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
