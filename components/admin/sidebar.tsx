"use client";

import React, { useState } from "react";
import { Package, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";
import { GradientText } from "../ui/shadcn-io/gradient-text";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

export default function AdminSidebar(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    {
      id: "projects",
      label: "Projeler",
      icon: Package, // Paket simgesi, projeler listesi için uygun
      href: "/admin/projects",
    },
    {
      id: "technologies",
      label: "Teknolojiler",
      icon: Package, // Paket simgesi, projeler listesi için uygun
      href: "/admin/technologies",
    },
  ];

  const active =
    menuItems.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    )?.id || "";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin");
  };

  const AdminInfo = (
    <div className="flex flex-col gap-1 p-4 border-t border-gray-900">
      <span className="font-semibold text-white">Ceyhun TÜRKMEN</span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition"
      >
        <LogOut size={15} /> <span>Çıkış</span>
      </button>
    </div>
  );

  const DesktopSidebar = (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-black shadow-lg flex flex-col justify-between border-r border-gray-900">
      <div>
        <div className="px-6 py-6 border-b border-gray-900 flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono">
              <GradientText text=".jhun{}" />
            </span>
          </Link>
        </div>

        <nav className="flex flex-col mt-4 px-3">
          {menuItems.map(({ id, label, icon: Icon, href }) => {
            const isActive = active === id;
            return (
              <Link
                key={id}
                href={href}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-amber-600/20 text-amber-600 shadow-inner"
                    : "text-white hover:text-amber-500 hover:bg-amber-100/10"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"
                  />
                )}
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-amber-500"
                      : "text-gray-400 group-hover:text-amber-500"
                  }`}
                />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {AdminInfo}
    </aside>
  );

  const MobileSidebar = (
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-amber-500 text-black hover:bg-amber-400 md:hidden"
      >
        <Menu />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md md:hidden shadow-lg"
          >
            <div className="flex justify-between items-center px-6 py-6 border-b border-gray-700">
              <Link
                href="/admin/dashboard"
                className="text-xl font-bold text-white"
                onClick={() => setIsOpen(false)}
              >
                NowArt<span className="text-amber-500">Admin</span>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-white"
              >
                <X />
              </Button>
            </div>

            <nav className="flex flex-col mt-6 px-3 space-y-2">
              {menuItems.map(({ id, label, icon: Icon, href }) => {
                const isActive = active === id;
                return (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-amber-600/20 text-amber-600 shadow-inner"
                        : "text-white hover:text-amber-500 hover:bg-amber-100/10"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTabMobile"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"
                      />
                    )}
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-amber-500"
                          : "text-gray-400 group-hover:text-amber-500"
                      }`}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-6 bg-gray-700" />
            {AdminInfo}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <div className="hidden md:block">{DesktopSidebar}</div>
      <div className="block md:hidden">{MobileSidebar}</div>
    </>
  );
}
