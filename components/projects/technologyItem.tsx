"use client";

import { motion } from "framer-motion";
import { Code } from "lucide-react";
import React from "react";
import Image from "next/image";

// 🔹 TypeScript tipi tanımla
export type Technology = {
  _id: string;
  name: string;
  icon: string; // SVG dosya yolu
  type: string;
  yoe: number;
  color?: string;
};

// 🔹 Bileşen tanımı - Light/Dark Theme Uyumlu
export const TechnologyItem = ({ tech }: { tech: Technology }) => {
  const TechIcon = tech.icon;
  const isSvgPath = typeof TechIcon === "string" && TechIcon.endsWith(".svg");

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-white/70 dark:bg-white/10 backdrop-blur-xs rounded-xl border border-gray-300 dark:border-white/10 shadow-lg transition-all duration-300 hover:bg-white/90 dark:hover:bg-white/15 hover:shadow-xl"
      whileHover={{ x: 5, scale: 1.01 }}
    >
      <div className="flex items-center space-x-4">
        {/* İkon Bölümü */}
        <div className="p-2 rounded-full bg-gray-200 dark:bg-white/10 relative w-10 h-10 flex items-center justify-center">
          {isSvgPath ? (
            <Image
              src={TechIcon}
              alt={tech.name}
              width={24}
              height={24}
              className="object-contain"
              style={
                tech.color
                  ? {
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
            <Code
              className="w-6 h-6 text-gray-700 dark:text-white"
              style={{ color: tech.color || undefined }}
            />
          )}
        </div>

        {/* İsim ve Tip Bölümü */}
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {tech.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 uppercase">
            {tech.type}
          </p>
        </div>
      </div>

      {/* Deneyim Yılı */}
      <span className="px-3 py-1 bg-gray-300 dark:bg-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-full">
        {tech.yoe} YOE
      </span>
    </motion.div>
  );
};
