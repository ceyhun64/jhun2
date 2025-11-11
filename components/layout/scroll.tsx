"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTopButton(): React.JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = (): void => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Sayfanın üstüne çık"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.12, y: -6 }} // 🔹 yukarı doğru çıkış efekti
          whileTap={{ scale: 0.92, y: 2 }} // 🔹 tıklarken hafif aşağı bastırma efekti
          className="fixed bottom-6 right-6 z-50 p-[1px] rounded-full 
             bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500
             shadow-[0_0_8px_rgba(100,180,255,0.15)] 
             hover:shadow-[0_0_28px_rgba(120,200,255,0.65)] 
             transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <div className="relative bg-[#0a0f1c] rounded-full p-3 flex items-center justify-center">
            {/* Parlayan iç halka efekti */}
            <motion.span
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-xl"
              animate={{
                opacity: [0.4, 0.9, 0.4],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Yukarı ok ikonu */}
            <ArrowUp className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(100,200,255,0.6)]" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
