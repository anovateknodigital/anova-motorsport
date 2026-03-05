"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Trophy,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  Clock,
  MapPin,
  ChevronRight,
  Flag,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface DashboardClientProps {
  user: User;
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview", active: true },
  { icon: Calendar, label: "Events", id: "events" },
  { icon: Users, label: "Peserta", id: "participants" },
  { icon: Trophy, label: "Race Results", id: "results" },
  { icon: FileText, label: "Dokumen", id: "docs" },
  { icon: BarChart3, label: "Statistik", id: "stats" },
];

const upcomingEvents = [
  {
    name: "ANOVA DRAG BIKE / DRAG RACE",
    type: "Drag Race",
    date: "17 - 18 April 2026",
    location: "Bangkinang, Kampar",
    registered: 142,
    capacity: 200,
    status: "open",
  },
  {
    name: "KEJURNAS ANOVA MOTOPRIX",
    type: "Motoprix",
    date: "30 - 31 Mei 2026",
    location: "Sirkuit Bangkinang",
    registered: 87,
    capacity: 150,
    status: "open",
  },
];

const recentRegistrations = [
  { name: "Bintang Nugraha", team: "Anova RT", class: "Underbone 150cc", time: "2 jam lalu" },
  { name: "Reza Valentino", team: "Team Kampar", class: "Drag Bracket 9s", time: "4 jam lalu" },
  { name: "Dimas Pratama", team: "Riau Speed", class: "Motoprix Senior", time: "6 jam lalu" },
  { name: "Agus Salim", team: "Bangkinang RC", class: "Underbone 155cc", time: "1 hari lalu" },
];

// ── Logout Confirmation Modal ──────────────────────────────────────
function LogoutModal({
  onConfirm,
  onCancel,
  isLoading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>

        <h3 className="font-teko text-2xl font-bold text-white text-center uppercase italic mb-1">
          Keluar dari Dashboard?
        </h3>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Anda akan keluar dari sesi admin. Pastikan semua perubahan sudah disimpan.
        </p>

        <div className="flex gap-3">
          <button
            id="btn-cancel-logout"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            id="btn-confirm-logout"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogOut size={14} />
            )}
            {isLoading ? "Keluar..." : "Ya, Keluar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCancelLogout = () => {
    if (!isLoggingOut) setShowLogoutModal(false);
  };

  const avatarUrl = user.user_metadata?.avatar_url;
  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
  const email = user.email || "";

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans">
      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
          isLoading={isLoggingOut}
        />
      )}

      {/* ── Sidebar Overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800/60
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/60 shrink-0">
          <div className="bg-white rounded-lg px-2.5 py-1 inline-block">
            <Image
              src="/anova-motorsport-logo.png"
              alt="Anova Motorsport"
              width={120}
              height={38}
              className="h-7 w-auto object-contain"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-3 mb-2">
              Menu Utama
            </p>
            {navItems.map(({ icon: Icon, label, id }) => (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => {
                  setActiveNav(id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5
                  transition-all duration-150 text-left
                  ${
                    activeNav === id
                      ? "bg-[#D32F2F]/15 text-[#D32F2F] border border-[#D32F2F]/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }
                `}
              >
                <Icon size={16} className="shrink-0" />
                {label}
                {activeNav === id && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </button>
            ))}
          </div>

          <div className="px-3 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-3 mb-2">
              Pengaturan
            </p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all">
              <Settings size={16} />
              Pengaturan
            </button>

            {/* ── Sidebar Logout Button ── */}
            <button
              id="btn-logout-sidebar"
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all mt-0.5"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-zinc-800/60 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-900">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[#D32F2F]/20 border border-zinc-700">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D32F2F] font-bold text-sm">
                  {displayName[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                {displayName}
              </p>
              <p className="text-zinc-500 text-[10px] truncate">{email}</p>
            </div>
            <button
              id="btn-logout-icon"
              onClick={handleLogoutClick}
              title="Keluar"
              className="text-zinc-500 hover:text-red-400 transition-colors shrink-0 p-1 rounded-md hover:bg-red-500/10"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-zinc-800/60 px-4 md:px-6 flex items-center gap-4 bg-zinc-950/80 backdrop-blur-sm shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Cari event, peserta..."
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg pl-9 pr-4 py-2 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#D32F2F]/20 border border-zinc-800 shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D32F2F] font-bold text-sm">
                  {displayName[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* ── Topbar Logout Button (desktop) ── */}
            <button
              id="btn-logout-topbar"
              onClick={handleLogoutClick}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 text-sm font-medium transition-all"
            >
              <LogOut size={15} />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
          style={{
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/black-linen.png")',
          }}
        >
          {/* Page header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-teko text-3xl md:text-4xl font-bold text-white uppercase italic">
                Dashboard Overview
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Selamat datang kembali,{" "}
                <span className="text-zinc-300">{displayName}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock size={12} />
                Kamis, 6 Maret 2026
              </span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Event Aktif",
                value: "2",
                sub: "+1 dari bulan lalu",
                icon: Calendar,
                color: "text-[#D32F2F]",
                bg: "bg-[#D32F2F]/10",
              },
              {
                label: "Total Peserta",
                value: "229",
                sub: "Dari 2 event aktif",
                icon: Users,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                label: "Pendaftaran Baru",
                value: "18",
                sub: "Dalam 7 hari terakhir",
                icon: TrendingUp,
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
              },
              {
                label: "Event Selesai",
                value: "50+",
                sub: "Total terlaksana",
                icon: Trophy,
                color: "text-amber-400",
                bg: "bg-amber-400/10",
              },
            ].map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-4 md:p-5"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}
                >
                  <Icon size={18} className={color} />
                </div>
                <p className="text-zinc-500 text-xs font-medium mb-1">
                  {label}
                </p>
                <p className={`font-teko text-3xl font-bold ${color}`}>
                  {value}
                </p>
                <p className="text-zinc-600 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* Two column grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            {/* Left: Upcoming Events */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <Flag size={16} className="text-[#D32F2F]" />
                  Event Mendatang
                </h2>
                <button className="text-[#D32F2F] text-xs font-semibold hover:underline">
                  Lihat Semua
                </button>
              </div>

              {upcomingEvents.map((event) => {
                const progress = Math.round(
                  (event.registered / event.capacity) * 100
                );
                return (
                  <div
                    key={event.name}
                    className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            {event.type}
                          </span>
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Buka
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-sm">
                          {event.name}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-zinc-600" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-zinc-600" />
                        {event.location}
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-500">Kuota Terisi</span>
                        <span className="text-zinc-300 font-semibold">
                          {event.registered} / {event.capacity}
                          <span className="text-zinc-600 font-normal ml-1">
                            ({progress}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D32F2F] to-[#ff5252] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Recent Registrations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <Zap size={16} className="text-[#D32F2F]" />
                  Pendaftaran Terbaru
                </h2>
                <button className="text-[#D32F2F] text-xs font-semibold hover:underline">
                  Lihat Semua
                </button>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl overflow-hidden">
                {recentRegistrations.map((reg, i) => (
                  <div
                    key={reg.name}
                    className={`flex items-center gap-3 px-4 py-3.5 ${
                      i < recentRegistrations.length - 1
                        ? "border-b border-zinc-800/60"
                        : ""
                    } hover:bg-zinc-800/30 transition-colors`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D32F2F]/30 to-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <span className="text-[#D32F2F] font-bold text-sm">
                        {reg.name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-200 text-sm font-semibold truncate">
                        {reg.name}
                      </p>
                      <p className="text-zinc-500 text-xs truncate">
                        {reg.team} · {reg.class}
                      </p>
                    </div>
                    <span className="text-zinc-600 text-[10px] shrink-0">
                      {reg.time}
                    </span>
                  </div>
                ))}

                <div className="px-4 py-3 text-center border-t border-zinc-800/60">
                  <button className="text-[#D32F2F] text-xs font-semibold hover:underline">
                    Lihat semua pendaftaran →
                  </button>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-4">
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-3">
                  Aksi Cepat
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Tambah Event", icon: Calendar },
                    { label: "Tambah Peserta", icon: Users },
                    { label: "Input Hasil", icon: Trophy },
                    { label: "Export Data", icon: FileText },
                  ].map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-3 py-2.5 rounded-lg transition-all"
                    >
                      <Icon size={13} className="text-[#D32F2F]" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* ── Mobile Logout Button ── */}
                <button
                  id="btn-logout-mobile"
                  onClick={handleLogoutClick}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-400 text-xs font-semibold px-3 py-2.5 rounded-lg transition-all sm:hidden"
                >
                  <LogOut size={13} />
                  Keluar dari Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
