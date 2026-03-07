"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  User as UserIcon, 
  Lock, 
  Settings2, 
  Camera, 
  Loader2, 
  Save, 
  Mail,
  ShieldCheck,
  Globe,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";

export function SettingsTab() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // App Settings State
  const [settingsId, setSettingsId] = useState("");
  const [siteName, setSiteName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [address, setAddress] = useState("");
  const [isSavingApp, setIsSavingApp] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{title: string, message: string, type: "success" | "error" | "info"}>({ title: "", message: "", type: "success" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "info" = "success") => {
    setModalConfig({ title, message, type });
    setModalOpen(true);
  };

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || "");
      }
      setLoading(false);
    }
    async function loadSettings() {
      const { data } = await supabase.from("site_settings").select("*").single();
      if (data) {
        setSettingsId(data.id);
        setSiteName(data.site_name || "");
        setContactEmail(data.contact_email || "");
        setWhatsapp(data.whatsapp || "");
        setInstagram(data.instagram_url || "");
        setTiktok(data.tiktok_url || "");
        setYoutube(data.youtube_url || "");
        setAddress(data.address || "");
      }
    }
    loadUser();
    loadSettings();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);

    try {
      let finalAvatarUrl = avatarUrl;
      
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("events") // Reusing public bucket for now
          .upload(fileName, avatarFile);
          
        if (uploadError) throw uploadError;
        finalAvatarUrl = supabase.storage.from("events").getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: finalAvatarUrl
        }
      });

      if (error) throw error;
      
      setAvatarUrl(finalAvatarUrl);
      setAvatarFile(null);
      showAlert("Sukses", "Profil berhasil diperbarui!", "success");
      // reload the page to apply changes to layout
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      console.error(err);
      showAlert("Gagal", err.message || "Gagal memperbarui profil.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showAlert("Peringatan", "Kata sandi tidak cocok!", "error");
      return;
    }
    if (newPassword.length < 6) {
      showAlert("Peringatan", "Kata sandi minimal 6 karakter.", "error");
      return;
    }
    
    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      showAlert("Gagal", error.message || "Gagal mengubah kata sandi.", "error");
    } else {
      showAlert("Sukses", "Kata sandi berhasil diubah!", "success");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsSavingPassword(false);
  };

  const handleUpdateAppSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingApp(true);
    const payload = {
        site_name: siteName,
        contact_email: contactEmail,
        whatsapp,
        instagram_url: instagram,
        tiktok_url: tiktok,
        youtube_url: youtube,
        address
    };
    
    let error;
    if (settingsId) {
        const res = await supabase.from("site_settings").update(payload).eq("id", settingsId);
        error = res.error;
    } else {
        const res = await supabase.from("site_settings").insert([payload]).select().single();
        if (res.data) setSettingsId(res.data.id);
        error = res.error;
    }
    
    if (error) {
      showAlert("Gagal", "Gagal menyimpan preferensi!", "error");
    } else {
      showAlert("Sukses", "Pengaturan aplikasi berhasil disimpan!", "success");
    }
    setIsSavingApp(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#D32F2F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-teko text-3xl md:text-4xl font-bold text-white uppercase italic">
          Pengaturan Sistem
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Kelola profil akun administrator dan pengaturan global aplikasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri - Profil & Security */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Profil Admin */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden shadow-xl">
            <div className="border-b border-zinc-800/60 p-5 flex items-center gap-3 bg-zinc-950/50">
              <UserIcon size={18} className="text-[#D32F2F]" />
              <h2 className="text-white font-bold tracking-wide">Profil Administrator</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-5 md:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Photo Upload Area */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex items-center justify-center relative shadow-inner">
                    {(avatarFile || avatarUrl) ? (
                      <Image 
                        src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl}
                        alt="Avatar Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-zinc-600">
                        {user?.email?.[0].toUpperCase() || "A"}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      <Camera size={20} className="text-white mb-1" />
                      <span className="text-[10px] text-white font-medium uppercase tracking-wider">Ubah</span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Ubah Foto Profil"
                  />
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                      Alamat Email (Login)
                    </label>
                    <div className="flex items-center gap-3 bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5">
                      <Mail size={16} className="text-zinc-500" />
                      <span className="text-zinc-300 text-sm font-medium">{user?.email}</span>
                      <span className="ml-auto bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                        Terverifikasi
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                      Nama Lengkap
                    </label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-zinc-100 hover:bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>

          {/* Card: Keamanan & Kata Sandi */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden shadow-xl">
            <div className="border-b border-zinc-800/60 p-5 flex items-center gap-3 bg-zinc-950/50">
              <ShieldCheck size={18} className="text-[#D32F2F]" />
              <h2 className="text-white font-bold tracking-wide">Keamanan &amp; Akun</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="p-5 md:p-6 space-y-5">
              <p className="text-xs text-zinc-400 mb-2">Perbarui kata sandi secara berkala untuk menjaga keamanan akun operasional Anda.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Kata Sandi Baru</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-10 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Ulangi Kata Sandi</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi kata sandi"
                      className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-10 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSavingPassword || !newPassword || !confirmPassword}
                  className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50 inline-flex"
                >
                  {isSavingPassword ? <Loader2 size={15} className="animate-spin" /> : null}
                  Perbarui Kata Sandi
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Kolom Kanan - App Settings */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden shadow-xl sticky top-6">
            <div className="border-b border-zinc-800/60 p-5 flex items-center gap-3 bg-zinc-950/50">
              <Globe size={18} className="text-[#D32F2F]" />
              <h2 className="text-white font-bold tracking-wide">Preferensi Website</h2>
            </div>
            
            <form onSubmit={handleUpdateAppSettings} className="p-5 md:p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Nama Platform</label>
                <input 
                  type="text" 
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Email Bantuan Publik</label>
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">WhatsApp</label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="628..."
                  className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Instagram Url</label>
                  <input 
                    type="text" 
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Tiktok Url</label>
                  <input 
                    type="text" 
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Youtube Url</label>
                <input 
                  type="text" 
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Alamat</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors resize-none mb-4"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Mode Tampilan</label>
                <select className="w-full bg-zinc-950 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D32F2F] transition-colors appearance-none">
                  <option>Force Dark Mode (Sirkuit Theme)</option>
                  <option disabled>Light Mode (Segera Hadir)</option>
                </select>
              </div>
              
              <div className="bg-[#D32F2F]/10 border border-[#D32F2F]/20 rounded-lg p-3 mt-4">
                <p className="text-[#D32F2F] text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                  <Settings2 size={12}/> Info Sistem
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Perubahan preferensi ini akan ter-cache di CDN dan mungkin membutuhkan waktu hingga 5 menit untuk tampil di seluruh pengguna.
                </p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSavingApp}
                  className="w-full bg-black hover:bg-zinc-950 border border-zinc-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingApp ? <Loader2 size={16} className="animate-spin" /> : "Simpan Preferensi"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Alert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col items-center text-center mt-2 mb-4">
              {modalConfig.type === "success" && <CheckCircle2 size={48} className="text-emerald-500 mb-4" />}
              {modalConfig.type === "error" && <AlertCircle size={48} className="text-[#D32F2F] mb-4" />}
              {modalConfig.type === "info" && <AlertCircle size={48} className="text-blue-500 mb-4" />}
              <h3 className="text-xl font-bold text-white mb-2">{modalConfig.title}</h3>
              <p className="text-sm text-zinc-400">{modalConfig.message}</p>
            </div>
            <button 
              onClick={() => setModalOpen(false)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
