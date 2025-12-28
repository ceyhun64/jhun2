"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SocialSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = "+905541496377";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`;

  const socialIcons = [
    {
      name: "Github",
      link: "https://github.com/ceyhunturkmen",
      src: "/socialMedia/github.png",
      color: "#181717",
      colorDark: "#f5f5f5", // Dark modda açık renk
      ariaLabel: "Github profiline git",
    },
    {
      name: "Linkedin",
      link: "https://www.linkedin.com/in/ceyhunturkmen/",
      src: "/socialMedia/linkedin.png",
      color: "#0A66C2",
      colorDark: "#0A66C2",
      ariaLabel: "Linkedin profiline git",
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/ceyhunturkmenn/",
      src: "/socialMedia/instagram.png",
      color: "#E1306C",
      colorDark: "#E1306C",
      ariaLabel: "Instagram sayfasına git",
    },
    {
      name: "WhatsApp",
      link: whatsappLink,
      src: "/socialMedia/whatsapp.png",
      color: "#25D366",
      colorDark: "#25D366",
      ariaLabel: "WhatsApp üzerinden mesaj gönder",
    },
    {
      name: "Telefon",
      link: `tel:${whatsappNumber}`,
      src: "/socialMedia/phone.png",
      color: "#FF7F00",
      colorDark: "#FF7F00",
      ariaLabel: "Telefon numarasını ara",
    },
  ];

  return (
    <div className="fixed left-5 bottom-6 z-50 flex flex-col items-center">
      {/* Sosyal ikonlar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {socialIcons.map((icon, index) => (
              <motion.a
                key={icon.name}
                href={icon.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.ariaLabel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{
                  scale: 1.08,
                  y: -2,
                }}
                whileTap={{ scale: 0.96 }}
                style={{
                  backgroundColor: icon.color,
                  boxShadow: `0 4px 12px ${icon.color}40`,
                }}
                className="relative rounded-full backdrop-blur-sm border border-white/20 dark:border-white/10 p-2 
                           hover:shadow-2xl transition-shadow duration-300
                           dark:bg-opacity-90"
              >
                {/* Parlama efekti */}
                <motion.span
                  className="absolute inset-0 rounded-full blur-[2px] opacity-15 dark:opacity-20"
                  style={{ backgroundColor: icon.color }}
                  animate={{
                    opacity: [0.15, 0.25, 0.15],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative rounded-full flex items-center justify-center">
                  <img
                    src={icon.src}
                    alt=""
                    className="w-7 h-7 object-contain brightness-0 invert"
                  />
                  <span className="sr-only">{icon.ariaLabel}</span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? "Sosyal sidebar'ı kapat" : "Sosyal sidebar'ı aç"}
        className="relative bg-white/80 dark:bg-slate-900/80 
                   text-zinc-700 dark:text-white 
                   p-3 rounded-full backdrop-blur-md 
                   border border-zinc-200 dark:border-white/10 
                   hover:shadow-lg dark:hover:shadow-[0_0_6px_rgba(56,189,248,0.3)] 
                   hover:bg-zinc-100 dark:hover:bg-slate-800 
                   shadow-md dark:shadow-none
                   transition-all duration-500"
      >
        <motion.span
          className="absolute inset-0 rounded-full 
                     bg-gradient-to-tr from-zinc-200/10 via-zinc-300/10 to-transparent 
                     dark:from-cyan-400/5 dark:via-blue-600/5 dark:to-transparent 
                     blur-[2px]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="relative flex items-center justify-center z-10"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Plus size={20} />
        </motion.div>
      </motion.button>
    </div>
  );
}
