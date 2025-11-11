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

  const changeLanguage = (value: "en" | "tr") => {
    if (value === currentLocale) return;
    const newPath = pathname.replace(/^\/(en|tr)/, `/${value}`);
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative flex items-center gap-1 backdrop-blur-md bg-gray-900/40 
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

      {/* 🇹🇷 TR Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => changeLanguage("tr")}
        className={`relative z-10 px-3 py-1 text-[11px] sm:text-[13px] font-semibold tracking-wide
          rounded-full transition-all duration-300
          ${
            currentLocale === "tr"
              ? "text-black"
              : "text-gray-300 hover:text-white"
          }`}
      >
        TR
      </Button>

      {/* 🇬🇧 EN Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => changeLanguage("en")}
        className={`relative z-10 px-3 py-1 text-[11px] sm:text-[13px] font-semibold tracking-wide
          rounded-full transition-all duration-300
          ${
            currentLocale === "en"
              ? "text-black"
              : "text-gray-300 hover:text-white"
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
  );
}
