"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Cpu,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export default function AdminSidebar(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    {
      id: "projects",
      label: "Projeler",
      icon: LayoutGrid,
      href: "/admin/projects",
    },
    {
      id: "technologies",
      label: "Teknolojiler",
      icon: Cpu,
      href: "/admin/technologies",
    },
    {
      id: "blogs",
      label: "Blog Yazıları",
      icon: FileText,
      href: "/admin/blogs",
    },
  ];

  const active =
    menuItems.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    )?.id || "";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin");
  };

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1 px-3">
      {menuItems.map(({ id, label, icon: Icon, href, badge }) => {
        const isActive = active === id;
        return (
          <Link
            key={id}
            href={href}
            onClick={onClick}
            className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-white border border-violet-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-violet-400" : "group-hover:text-violet-400"}`}
            />
            <span className="text-sm font-medium tracking-wide">{label}</span>
            {badge !== undefined && (
              <span className="ml-auto bg-violet-600/80 text-white text-xs px-1.5 py-0.5 rounded-md font-mono">
                {badge}
              </span>
            )}
            {isActive && (
              <ChevronRight className="ml-auto w-3.5 h-3.5 text-violet-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  const BottomSection = () => (
    <div className="px-3 py-4 border-t border-white/5">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          C
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            Ceyhun Türkmen
          </p>
          <p className="text-xs text-zinc-500">Administrator</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 border border-transparent hover:border-red-500/20"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Çıkış Yap</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 w-64 h-screen flex-col bg-[#0a0a0f] border-r border-white/5 z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">{`{}`}</span>
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-tight font-mono">
                .jhun
              </span>
              <span className="block text-[10px] text-zinc-500 uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Status badge */}
        <div className="px-6 py-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-500">Sistem aktif</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <p className="px-7 mb-2 text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
            Yönetim
          </p>
          <NavItems />
        </div>

        <BottomSection />
      </aside>

      {/* Mobile trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-9 h-9 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white hover:bg-white/10 transition"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 w-72 h-screen bg-[#0a0a0f] border-r border-white/5 flex flex-col z-50 md:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
                    <span className="text-white font-bold text-sm font-mono">{`{}`}</span>
                  </div>
                  <span className="text-white font-bold text-sm font-mono">
                    .jhun admin
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-0">
                <p className="px-7 mb-2 text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
                  Yönetim
                </p>
                <NavItems onClick={() => setIsOpen(false)} />
              </div>

              <BottomSection />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
