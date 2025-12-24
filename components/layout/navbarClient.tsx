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
import { useParams, usePathname } from "next/navigation";
import ThemeToggle from "./themeToggle";

type NavbarClientProps = {
  dict: {
    projects: string;
    about: string;
    contact: string;
    blogs: string;
  };
};

export default function NavbarClient({ dict }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const params = useParams();
  const pathname = usePathname();

  const locale = params.locale || "tr";

  const links = [
    { name: dict.projects, href: "projects" },
    { name: dict.about, href: "about" },
    { name: dict.contact, href: "contact" },
    { name: dict.blogs, href: "blog" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.nav
      className={`fixed top-0 w-full z-[999] transition-all duration-500
    ${
      scrolled
        ? "py-3 bg-white/80 dark:bg-black/70 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-white/10"
        : "py-5 bg-transparent"
    }
  `}
    >
      <div className="flex items-center justify-between px-5 sm:px-10">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-1"
          aria-label={locale === "en" ? "Homepage" : "Anasayfa"}
          title={locale === "en" ? "Homepage" : "Anasayfa"}
        >
          <GradientText
            className="text-2xl font-bold font-mono tracking-tighter"
            text=".jhun{ }"
          />
        </Link>

        {/* Desktop Menü */}
        <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 h-full items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-8">
              {links.map((link, i) => {
                const isActive = pathname === `/${locale}/${link.href}`;
                return (
                  <NavigationMenuItem key={i}>
                    <Link
                      href={`/${locale}/${link.href}`}
                      aria-label={`${link.name} sayfasına git`}
                      title={`${link.name}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          variant="ghost"
                          className={`px-4 py-2 font-medium transition-all duration-300 bg-transparent ${
                            isActive
                              ? "text-orange-500 dark:text-orange-400"
                              : "text-gray-800 dark:text-white hover:text-gray-900 dark:hover:text-white"
                          } hover:bg-amber-100 dark:hover:bg-amber-600/90`}
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
        <div className="flex items-center gap-0.5 md:gap-4">
          <Link
            href="https://github.com/ceyhun64"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profilini aç"
            title="GitHub"
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-gray-700 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </Link>

          <Link
            href="https://linkedin.com/in/ceyhun-türkmen-14882a26a"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profilini aç"
            title="LinkedIn"
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </Link>

          <ThemeToggle />
          <LanguageSwitcher />

          {/* Mobil Menü Butonu */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 dark:text-white"
              aria-label={mobileOpen ? "Mobil menüyü kapat" : "Mobil menüyü aç"}
              title={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menü */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-white/95 dark:bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden h-screen overflow-y-auto"
            aria-label="Mobil menü"
          >
            {/* Kapat Butonu */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
              aria-label="Menüyü kapat"
              title="Menüyü kapat"
            >
              <X className="h-7 w-7" aria-hidden="true" />
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
                  aria-label={`${link.name} sayfasına git`}
                  title={link.name}
                >
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-gray-800 dark:text-white text-xl tracking-wide hover:text-amber-600 dark:hover:text-amber-400"
                    >
                      {link.name}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            ))}

            {/* Sosyal ikonlar */}
            <div className="flex gap-5 mt-8">
              <Link
                href="https://github.com/ceyhun64"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profilini aç"
                title="GitHub"
              >
                <Github
                  className="h-7 w-7 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="https://linkedin.com/in/ceyhun-türkmen-14882a26a"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profilini aç"
                title="LinkedIn"
              >
                <Linkedin
                  className="h-7 w-7 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}