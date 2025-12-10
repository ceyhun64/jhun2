"use client";

import React, { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  MessageCircle,
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
const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="white"
  >
    <title>WhatsApp</title>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Phone,
  Whatsapp: WhatsappIcon, // ✅ SVG’yi özel bileşen olarak ekledik
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
    <footer className="relative overflow-hidden bg-linear-to-b from-black via-zinc-950 to-black text-white font-sans border-t border-zinc-800/50">
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
              text=".jhun{ }"
            />
            <p className="text-gray-400 mt-3 text-sm md:text-base max-w-sm leading-relaxed">
              {dict.slogan}
            </p>

            {/* Social Icons Desktop */}
            <div className="hidden md:flex gap-4 mt-6">
              {dict.social.map((item: any, i: number) => {
                const Icon = SOCIAL_ICONS[item.name] || Phone;
                return (
                  <motion.a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, rotate: 3 }}
                    className="p-3 rounded-full bg-zinc-800/60 ..."
                    aria-label={item.name} // ✅ aria-label eklendi
                  >
                    <Icon className="h-5 w-5 text-white hover:text-amber-400 transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="md:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {dict.sections.map((section: any, idx: number) => (
              <div key={idx} className=" pb-3 md:border-none md:pb-0">
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
          {dict.social.map((item: any, i: number) => {
            const Icon = SOCIAL_ICONS[item.name] || Phone;
            return (
              <motion.a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="p-3 rounded-full bg-zinc-800/60 backdrop-blur-md border border-zinc-700 hover:border-amber-400/70 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                aria-label={item.name} // ✅ aria-label eklendi
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
