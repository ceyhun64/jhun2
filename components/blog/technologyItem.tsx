"use client";

import { motion } from "framer-motion";
import { Code } from "lucide-react";
import React from "react";
// next/image'ı import ediyoruz, çünkü ikonlar SVG dosya yolu olarak geliyor.
import Image from "next/image";

// 🔹 TypeScript tipi tanımla
// NOT: icon tipi artık hem React Bileşeni hem de string (dosya yolu) olabilir.
export type Technology = {
  _id: string;
  name: string;
  // icon: string | React.ElementType, API'dan string geleceği için
  // bu bileşenin bu dizeyi Image component'i ile işlemesi gerekir.
  icon: string; // API'dan gelen veri yapısına göre sadece string yaptık
  type: string;
  yoe: number;
  color?: string;
};

// 🔹 Bileşen tanımı
export const TechnologyItem = ({ tech }: { tech: Technology }) => {
  const TechIcon = tech.icon; // Bu değer artık bir SVG dosya yoludur (string).

  // TechIcon'ın bir dize (dosya yolu) olup olmadığını kontrol ediyoruz.
  const isSvgPath = typeof TechIcon === "string" && TechIcon.endsWith(".svg");
  // API'dan sadece string geleceği için isSvgPath her zaman true olacaktır,
  // yine de güvenli olması açısından kontrolü tutabiliriz.

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:bg-white/10"
      whileHover={{ x: 5, scale: 1.01 }}
    >
      <div className="flex items-center space-x-4">
        {/* İkon Bölümü */}
        <div className="p-2 rounded-full bg-white/10 relative w-10 h-10 flex items-center justify-center">
          {isSvgPath ? (
            // DÜZELTME: API'dan gelen dosya yolunu (string) Image bileşeni ile göster
            <Image
              src={TechIcon}
              alt={tech.name}
              width={24}
              height={24}
              className="object-contain"
              style={
                tech.color
                  ? {
                      // Eğer renk #000000 veya #0B0D0E ise #FFFFFF yap
                      filter: `drop-shadow(0 0 8px ${
                        ["#000000", "#0b0d0e"].includes(
                          tech.color.toLowerCase()
                        )
                          ? "#FFFFFF"
                          : tech.color
                      }) drop-shadow(0 0 4px ${
                        ["#000000", "#0b0d0e"].includes(
                          tech.color.toLowerCase()
                        )
                          ? "#FFFFFF"
                          : tech.color
                      })`,
                    }
                  : {}
              }
            />
          ) : (
            // Fallback (Yedek): Eğer dize değilse (beklenmeyen durum), varsayılan Lucide ikonu göster
            <Code className="w-6 h-6" style={{ color: tech.color || "#fff" }} />
          )}
        </div>

        {/* İsim ve Tip Bölümü */}
        <div>
          <p className="text-lg font-semibold text-white">{tech.name}</p>
          <p className="text-sm text-gray-400 uppercase">{tech.type}</p>
        </div>
      </div>

      {/* Deneyim Yılı */}
      <span className="px-3 py-1 bg-white/10 text-white text-sm font-bold rounded-full">
        {tech.yoe} YOE
      </span>
    </motion.div>
  );
};
