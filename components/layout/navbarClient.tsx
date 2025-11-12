"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import LanguageSwitcher from "./languageSwitcher";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";

type NavbarClientProps = {
  dict: {
    projects: string;
    about: string;
    contact: string;
  };
};

export default function NavbarClient({ dict }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const params = useParams();
  const pathname = usePathname(); // mevcut path

  const locale = params.locale || "tr";

  const links = [
    { name: dict.projects, href: "projects" },
    { name: dict.about, href: "about" },
    { name: dict.contact, href: "contact" },
  ];

  // Scroll efekti — küçülen navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed top-0 w-full z-[999] transition-all duration-500
        ${
          scrolled
            ? "py-3 bg-black/70 backdrop-blur-xl shadow-lg border-b border-white/10"
            : "py-5 bg-transparent"
        }
      `}
    >
      <div className="flex items-center justify-between px-5 sm:px-10">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-1">
          <GradientText
            className="text-2xl font-bold font-mono tracking-tighter"
            text=".jhun{}"
          />
        </Link>

        {/* Desktop Menü */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              {links.map((link, i) => {
                const isActive = pathname === `/${locale}/${link.href}`;
                return (
                  <NavigationMenuItem key={i}>
                    <Link href={`/${locale}/${link.href}`}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          variant="ghost"
                          className={`
                    px-4 py-2 font-medium transition-all duration-300
                    bg-transparent
                    ${
                      isActive
                        ? "text-orange-500"
                        : "text-white hover:text-white"
                    }
                    hover:bg-amber-600/90
                  `}
                        >
                          {link.name}
                        </Button>
                      </motion.div>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Sağ Taraf */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="https://github.com/ceyhun64" target="_blank">
            <motion.div whileHover={{ scale: 1.2 }}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-white hover:text-purple-400"
              >
                <Github className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>

          <Link
            href="https://linkedin.com/in/ceyhun-türkmen-14882a26a"
            target="_blank"
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-white hover:text-blue-400"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>

          <LanguageSwitcher />

          {/* Mobil Menü Butonu */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 🌙 Mobile Menü (Full-screen modal tarzı) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {/* 🔹 Kapat Butonu */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 text-gray-300 hover:text-amber-400 transition-all"
            >
              <X className="h-7 w-7" />
            </button>

            {/* Menü Linkleri */}
            {links.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/${locale}/${link.href}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-white text-xl tracking-wide hover:text-amber-400"
                    >
                      {link.name}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            ))}

            {/* Sosyal ikonlar */}
            <div className="flex gap-5 mt-8">
              <Link href="https://github.com/ceyhun64" target="_blank">
                <Github className="h-7 w-7 text-gray-300 hover:text-purple-400 transition-colors" />
              </Link>
              <Link
                href="https://linkedin.com/in/ceyhun-türkmen-14882a26a"
                target="_blank"
              >
                <Linkedin className="h-7 w-7 text-gray-300 hover:text-blue-400 transition-colors" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
