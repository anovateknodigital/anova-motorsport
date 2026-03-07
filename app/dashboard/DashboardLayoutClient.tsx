"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Trophy,
  Newspaper,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

interface DashboardLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Calendar, label: "Events", href: "/dashboard/events" },
  { icon: Users, label: "Peserta", href: "/dashboard/participants" },
  { icon: Trophy, label: "Race Results", href: "/dashboard/results" },
  { icon: Newspaper, label: "News & Updates", href: "/dashboard/news" },
  { icon: BarChart3, label: "Statistik", href: "/dashboard/stats" },
];

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
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
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

export default function DashboardLayoutClient({ user, children }: DashboardLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
          isLoading={isLoggingOut}
        />
      )}

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
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/60 shrink-0">
          <Link href="/dashboard" className="inline-block" onClick={() => setSidebarOpen(false)}>
            <Image
              src="/anova-motorsport-logo.png"
              alt="Anova Motorsport"
              width={120}
              height={38}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-3 mb-2">
              Menu Utama
            </p>
            {navItems.map(({ icon: Icon, label, href }) => {
              const isActive = href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname?.startsWith(href);
                
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5
                    transition-all duration-150 text-left
                    ${
                      isActive
                        ? "bg-[#D32F2F]/15 text-[#D32F2F]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                    }
                  `}
                >
                  <Icon size={16} className="shrink-0" />
                  {label}
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-[#D32F2F]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="px-3 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-3 mb-2">
              Pengaturan
            </p>
            <Link 
              href="/dashboard/settings"
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname?.startsWith("/dashboard/settings")
                  ? "bg-[#D32F2F]/15 text-[#D32F2F]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Settings size={16} />
              Pengaturan
            </Link>

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all mt-0.5"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </nav>

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
            <button className="relative w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>

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

            <button
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
          {children}
        </main>
      </div>
    </div>
  );
}
