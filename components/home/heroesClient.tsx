"use client";

import { motion } from "framer-motion";
import { Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/shadcn-io/magnetic-button";
import Link from "next/link";
import { useMemo } from "react";

type ElegantShapeProps = {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
};

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white",
}: ElegantShapeProps) {
  const floatAnimation = useMemo(
    () => ({
      y: [0, 10, 0],
      opacity: [1, 1, 1],
    }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -80, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 1.8,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={floatAnimation}
        transition={{
          duration: 12 + Math.random() * 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            gradient,
            // Light: mavi tonlu, Dark: beyaz tonlu gölgeler
            "shadow-[0_0_40px_rgba(59,130,246,0.4)] dark:shadow-[0_0_40px_rgba(255,255,255,0.3)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.25),transparent_70%)]",
            "dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

type CloudShapeProps = {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
};

function CloudShape({
  className,
  delay = 0,
  width = 420,
  height = 150,
}: CloudShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.4,
        delay,
        ease: "easeOut",
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ x: [0, 25, 0] }}
        transition={{
          duration: 22 + Math.random() * 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        {/* ANA BULUT GÖVDESİ */}
        <div
          className="
            absolute inset-0 rounded-full
            bg-gradient-to-b from-white via-sky-100 to-blue-100
            border border-sky-300/50
            shadow-[0_25px_60px_rgba(59,130,246,0.25)]
            backdrop-blur-sm
          "
        />

        {/* SOL POFUDUK */}
        <div
          className="
            absolute -left-12 bottom-6
            w-1/2 h-2/3
            rounded-full
            bg-gradient-to-b from-white via-sky-100 to-blue-100
            border border-sky-300/40
            shadow-[0_20px_50px_rgba(59,130,246,0.2)]
          "
        />

        {/* ORTA POFUDUK */}
        <div
          className="
            absolute left-1/4 -top-6
            w-1/3 h-1/2
            rounded-full
            bg-gradient-to-b from-white via-sky-100 to-blue-100
            border border-sky-300/40
            shadow-[0_15px_40px_rgba(59,130,246,0.18)]
          "
        />

        {/* SAĞ POFUDUK */}
        <div
          className="
            absolute right-0 bottom-8
            w-1/3 h-1/2
            rounded-full
            bg-gradient-to-b from-white via-sky-100 to-blue-100
            border border-sky-300/40
            shadow-[0_15px_40px_rgba(59,130,246,0.18)]
          "
        />

        {/* SOFT OUTLINE GLOW */}
        <div
          className="
            absolute inset-0 rounded-full
            ring-1 ring-sky-200/40
            blur-sm
            pointer-events-none
          "
        />
      </motion.div>
    </motion.div>
  );
}

type HeroesClientProps = {
  dict: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    ctaText: string;
  };
  className?: string;
  locale: "tr" | "en";
};

export default function HeroesClient({
  dict,
  className,
  locale,
}: HeroesClientProps) {
  return (
    <div
      className={cn(
        "relative w-full flex mt-20 items-center justify-center overflow-hidden",
        // Light: Yumuşak pastel gradyan, Dark: Derin siyah
        "bg-gradient-to-b from-background via-blue-500/30 to-sky-500/30",
        "dark:bg-gradient-to-br dark:from-black dark:via-gray-950 dark:to-black",
        "min-h-[80vh] md:min-h-screen transition-colors duration-500",
        className
      )}
    >
      {/* Arka Plan Gradyanı - Her iki tema için optimize */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-100/30 to-cyan-100/40 dark:from-gray-900/20 dark:via-purple-900/15 dark:to-blue-900/20 blur-3xl pointer-events-none opacity-60 dark:opacity-50" />

      {/* Elegant Shapes - Tema bazlı renk geçişleri */}
      {/* BACKGROUND SHAPES */}
      <div className="absolute inset-0 overflow-hidden">
        {/* LIGHT THEME – SKY & CLOUDS */}
        <div className="block dark:hidden">
          <CloudShape
            delay={0.2}
            width={600}
            height={180}
            className="left-[-10%] top-[15%]"
          />
          <CloudShape
            delay={0.4}
            width={420}
            height={140}
            className="right-[-5%] top-[45%]"
          />
          <CloudShape
            delay={0.6}
            width={360}
            height={120}
            className="left-[10%] bottom-[20%]"
          />
      
        </div>

        {/* DARK THEME – GALAXY */}
        <div className="hidden dark:block">
          <ElegantShape
            delay={0.3}
            width={650}
            height={150}
            rotate={8}
            gradient="from-cyan-400/30 via-sky-400/25 to-purple-900/20"
            className="left-[-10%] top-[10%]"
          />
          <ElegantShape
            delay={0.5}
            width={400}
            height={100}
            rotate={-20}
            gradient="from-purple-700/25 via-blue-800/20 to-cyan-400/20"
            className="right-[-5%] top-[50%]"
          />
          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-cyan-400/20 via-purple-700/15"
            className="right-[15%] top-[25%]"
          />
          <ElegantShape
            delay={0.6}
            width={360}
            height={120}
            rotate={-20}
            gradient="from-cyan-400/20 via-purple-700/15"
            className="left-[10%] bottom-[20%]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        {/* Badge - İyileştirilmiş tema uyumu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 
            bg-black/5 dark:bg-white/5 
            backdrop-blur-md 
            shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/10
            border border-black/10 dark:border-white/10
            transition-all duration-300"
        >
          <Circle className="h-2 w-2 fill-blue-500 dark:fill-sky-400/80 text-blue-500 dark:text-sky-400 animate-pulse" />
          <span className="text-xs text-gray-800 dark:text-white/80 tracking-wide font-medium">
            {dict.badge}
          </span>
        </motion.div>

        {/* Title - Geliştirilmiş gradyan ve animasyon */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter
            bg-clip-text text-transparent
            bg-gradient-to-r from-cyan-300 via-black/95 to-blue-300
            dark:from-cyan-600 dark:via-white/95 dark:to-blue-600
            drop-shadow-[0_4px_12px_rgba(59,130,246,0.3)]
            dark:drop-shadow-[0_0_16px_rgba(0,255,255,0.4)]
            transition-all duration-500"
        >
          <span>{dict.title1} </span>
          <br className="hidden md:block" />
          <span
            className="bg-clip-text text-transparent 
            bg-gradient-to-r from-blue-500 via-black to-sky-300
            dark:from-blue-400 dark:via-white dark:to-sky-600"
          >
            {dict.title2}
          </span>
        </motion.h1>

        {/* Description - İyileştirilmiş okunabilirlik */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sm md:text-xl mb-12 leading-relaxed font-light tracking-wide 
            max-w-2xl mx-auto px-4 
            text-gray-700/80 dark:text-gray-300/80 
            drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(0,255,255,0.15)]
            transition-colors duration-300"
        >
          {dict.description}
        </motion.p>

        {/* CTA Button - Geliştirilmiş hover efektleri */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="inline-block relative overflow-visible"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <Link href={`/${locale}/contact`}>
              <MagneticButton
                className="relative px-8 py-4 text-white font-semibold text-lg rounded-full
                    bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500
                    dark:from-amber-400 dark:via-orange-500 dark:to-yellow-400
                    shadow-[0_4px_20px_rgba(251,146,60,0.5)]
                    dark:shadow-[0_4px_20px_rgba(255,180,0,0.6)]
                    hover:shadow-[0_8px_30px_rgba(251,146,60,0.7)]
                    dark:hover:shadow-[0_8px_30px_rgba(255,200,50,0.8)]
                    after:absolute after:inset-0 after:rounded-full after:blur-2xl 
                    after:bg-gradient-to-r 
                    after:from-yellow-400/20 after:via-orange-400/15 after:to-amber-300/15
                    dark:after:from-yellow-400/15 dark:after:via-orange-400/10 dark:after:to-amber-300/10
                    after:pointer-events-none
                    transition-all duration-300 transform hover:scale-105
                    border border-orange-400/20 dark:border-yellow-400/20"
              >
                {dict.ctaText}
              </MagneticButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Alt Gölge - İyileştirilmiş geçişler */}
      <div
        className="absolute inset-0 
        bg-gradient-to-t 
        from-slate-50 via-transparent to-slate-50/60
        dark:from-black dark:via-transparent dark:to-black/80 
        pointer-events-none transition-colors duration-500"
      />
    </div>
  );
}
