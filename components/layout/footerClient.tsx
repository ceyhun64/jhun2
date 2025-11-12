"use client";

import React, { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Phone,
  ChevronDown,
} from "lucide-react";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModernFooterClientProps {
  dict: any;
}

const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Phone,
};

const ModernFooterClient: React.FC<ModernFooterClientProps> = ({ dict }) => {
  const [mounted, setMounted] = useState(false);
  const [openSections, setOpenSections] = useState<boolean[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    setOpenSections(dict.sections.map(() => false));
  }, [dict.sections]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black text-white font-sans border-t border-zinc-800/50">
      {/* Neon blur background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-5 md:px-10 py-16 md:py-24 z-10">
        <div className="flex flex-col md:flex-row justify-between gap-14 md:gap-24">
          {/* Left Side */}
          <div className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
            <GradientText
              className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight drop-shadow-[0_0_15px_rgba(255,200,100,0.25)]"
              text=".jhun{}"
            />
            <p className="text-gray-400 mt-3 text-sm md:text-base max-w-sm leading-relaxed">
              {dict.slogan}
            </p>

            {/* Social Icons Desktop */}
            <div className="hidden md:flex gap-4 mt-6">
              {dict.social.map((iconName: string, i: number) => {
                const Icon = SOCIAL_ICONS[iconName] || Phone;
                return (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.15, rotate: 3 }}
                    className="p-3 rounded-full bg-zinc-800/60 backdrop-blur-md border border-zinc-700 hover:border-amber-400/70 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white hover:text-amber-400 transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="md:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {dict.sections.map((section: any, idx: number) => (
              <div
                key={idx}
                className="border-b border-zinc-800 pb-3 md:border-none md:pb-0"
              >
                {/* Header */}
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex justify-between items-center md:justify-start text-white/90 md:text-amber-400/90 font-semibold text-lg md:mb-3 focus:outline-none"
                >
                  {section.title}
                  <ChevronDown
                    className={`ml-2 transition-transform duration-300 md:hidden ${
                      openSections[idx] ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Link List */}
                <AnimatePresence initial={false}>
                  {(isMobile ? openSections[idx] : true) && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-2 space-y-2 text-gray-400 text-sm md:text-base md:mt-0 md:block"
                    >
                      {section.links.map((link: any, i: number) => (
                        <li key={i}>
                          <Link
                            href={`/${dict.locale}${link.href}`}
                            className="group relative inline-block py-1 hover:text-amber-400 transition-colors"
                          >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Social Icons Mobile */}
        <div className="flex md:hidden flex-wrap justify-center gap-4 mt-8">
          {dict.social.map((iconName: string, i: number) => {
            const Icon = SOCIAL_ICONS[iconName] || Phone;
            return (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="p-3 rounded-full bg-zinc-800/60 backdrop-blur-md border border-zinc-700 hover:border-amber-400/70 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white hover:text-amber-400 transition-colors" />
              </motion.a>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-14 border-t border-zinc-800/70 pt-5 text-center text-sm sm:text-base text-gray-400 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <span>{dict.copyright}</span>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <span>{dict.developerPrefix}</span>
            <Link
              href="https://wa.me/905541496377"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GradientText
                gradient="linear-gradient(90deg, #f59e0b 0%, #facc15 50%, #f59e0b 100%)"
                className="text-white"
                text="Ceyhun Türkmen"
                neon
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooterClient;
