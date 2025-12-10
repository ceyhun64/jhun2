//compon
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

// ElegantShape bileşenini güncelliyoruz: Gölgeyi beyaza çeviriyoruz.
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.15]",
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
            // 💡 Burası Güncellendi: Beyaz renkli, yumuşak bir dış gölge
            "shadow-[0_0_40px_rgba(255,255,255,0.3)]",
            // Ortadan yayılan daha güçlü bir ışıma (radial gradient)
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
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
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: 0.4 + i * 0.15,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full flex items-center justify-center overflow-hidden bg-black min-h-[80vh] md:min-h-screen",
        className
      )}
    >
      {/* 1. Daha Estetik Arka Plan: Daha az keskin, daha derin bir gradyan */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-900/10 via-purple-900/10 to-blue-900/10 blur-3xl pointer-events-none opacity-50" />

      {/* Elegant Shapes - Opaklık ve Yoğunluk Artırıldı (Gölge Beyaz) */}
      <div className="absolute inset-0 overflow-hidden opacity-100">
        <ElegantShape
          delay={0.3}
          width={650}
          height={150}
          rotate={8}
          gradient="from-cyan-400/30 via-sky-300/25 to-purple-900/20"
          className="left-[-10%] top-[10%]"
        />
        <ElegantShape
          delay={0.5}
          width={400}
          height={100}
          rotate={-20}
          gradient="from-purple-700/25 via-blue-800/20 to-cyan-300/20"
          className="right-[-5%] top-[50%]"
        />
        <ElegantShape
          delay={0.4}
          width={320}
          height={80}
          rotate={-12}
          gradient="from-blue-800/25 via-cyan-400/20"
          className="left-[5%] bottom-[15%]"
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
          delay={0.7}
          width={150}
          height={40}
          rotate={-35}
          gradient="from-purple-900/20 via-sky-300/15"
          className="left-[25%] top-[5%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        {/* Badge */}
        <motion.div className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-8 bg-white/5 backdrop-blur-sm shadow-[0_0_4px_rgba(0,255,255,0.2)] border border-white/10">
          <Circle className="h-2 w-2 fill-sky-400/80 text-sky-400" />
          <span className="text-xs text-white/80 tracking-wide font-medium">
            {dict.badge}
          </span>
        </motion.div>

        {/* Title: Daha parlak, daha derin ışıltılı başlık */}
        <motion.h1
          className="text-3xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter
    bg-clip-text text-transparent
    bg-linear-to-r from-cyan-300 via-white/95 to-blue-300
    drop-shadow-[0_0_12px_rgba(0,255,255,0.35)]
    transition-all duration-300"
        >
          <span>{dict.title1} </span>
          <br className="hidden md:block" />
          {/* İkinci kısım için daha sıcak ve derin bir ton deniyorum */}
          <span className="bg-clip-text 	text-transparent bg-linear-to-r from-blue-400 via-white to-sky-600">
            {dict.title2}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p className="text-sm md:text-xl mb-12 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4 text-white/60 drop-shadow-[0_0_4px_rgba(0,255,255,0.1)]">
          {dict.description}
        </motion.p>

        {/* CTA Button */}
        <motion.div className="inline-block relative overflow-visible">
          {/* 3. Hafif Sallanma Animasyonu (daha estetik) */}
          <motion.div
            animate={{ y: [0, -4, 0] }} // Daha az zıplama
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
                    // Daha belirgin ve canlı bir gradyan
                    bg-linear-to-r from-amber-400 via-orange-500 to-yellow-400
                    shadow-[0_0_15px_rgba(255,180,0,0.6)]
                    hover:shadow-[0_0_25px_rgba(255,200,50,0.8)]
                    // Arka ışıltıyı daha da yumuşatıyorum
                    after:absolute after:inset-0 after:rounded-full after:blur-2xl after:bg-linear-to-r after:from-yellow-400/15 after:via-orange-400/10 after:to-amber-300/10 after:pointer-events-none
                    transition-all duration-300 transform hover:scale-[1.03]"
              >
                <Sparkles className="w-5 h-5 mr-2 text-white/90" />
                {dict.ctaText}
              </MagneticButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Alttaki gölgeyi daha yumuşak ve derin yapıyorum */}
      <div className="absolute inset-0 bg-linear-to-t from-[#010101] via-transparent to-[#010101]/80 pointer-events-none" />
    </div>
  );
}
