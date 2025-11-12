"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentLocale = pathname.startsWith("/en") ? "en" : "tr";

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "tr" ? "en" : "tr";
    const newPath = pathname.replace(/^\/(en|tr)/, `/${nextLocale}`);
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <>
      {/* Masaüstü versiyonu */}
      <motion.div
        layout
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="hidden sm:flex relative items-center gap-1 backdrop-blur-md bg-gray-900/40 
                   rounded-full p-[6px] border border-gray-700/40 shadow-inner"
      >
        {/* 💎 Animated gradient background */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className={`absolute top-[4px] bottom-[4px] w-[calc(50%-4px)] rounded-full 
            bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-[0_0_10px_rgba(255,193,7,0.5)]
            ${currentLocale === "tr" ? "left-[4px]" : "left-[calc(50%+2px)]"}`}
        />

        {/* 🇹🇷 TR */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleLanguage()}
          className={`relative z-10 px-3 py-1 text-[11px] sm:text-[13px] font-semibold tracking-wide
            rounded-full transition-all duration-300
            ${
              currentLocale === "tr"
                ? "text-black"
                : "text-gray-300 hover:text-black"
            }`}
        >
          TR
        </Button>

        {/* 🇬🇧 EN */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleLanguage()}
          className={`relative z-10 px-3 py-1 text-[11px] sm:text-[13px] font-semibold tracking-wide
            rounded-full transition-all duration-300
            ${
              currentLocale === "en"
                ? "text-black"
                : "text-gray-300 hover:text-black"
            }`}
        >
          EN
        </Button>

        {/* 🌀 Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-400/10 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* 📱 Mobil versiyonu (tek tuş, toggle ile değişir) */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex sm:hidden"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="px-2 py-[3px] text-[12px] font-semibold text-amber-400 
                     bg-gray-900/40 rounded-full border border-gray-700/40
                     hover:bg-amber-500 hover:text-black transition-all"
        >
          {currentLocale.toUpperCase()}
        </Button>
      </motion.div>
    </>
  );
}
