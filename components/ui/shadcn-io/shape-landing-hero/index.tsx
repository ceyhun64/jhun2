"use client";

import { motion } from "framer-motion";
import { Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "../magnetic-button";
import { useTranslations } from "next-intl";

// --- ElegantShape Bileşeni ---
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
  gradient = "from-white/[0.08]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -120, rotate: rotate - 10 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, 4, -4, 0],
          opacity: [0.8, 1, 0.9, 1],
        }}
        transition={{
          duration: 18,
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
            "shadow-[0_12px_64px_0_rgba(0,0,0,0.25)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_80%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// --- HeroGeometric Bileşeni ---
type HeroGeometricProps = {
  className?: string;
  ctaHref?: string;
};

export function HeroGeometric({
  ctaHref = "/contact",
  className,
}: HeroGeometricProps) {
  // next-intl useTranslations hook
  const t = useTranslations("hero");

  // Çevirileri çekiyoruz
  const badge = t("badge");
  const title1 = t("title1");
  const title2 = t("title2");
  const description = t("description");
  const ctaText = t("ctaText");

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.25,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#010101] via-[#0d0d0d] to-[#030303] min-h-[80vh] md:min-h-screen",
        className
      )}
    >
      {/* Soft blur layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-purple-900/5 to-pink-800/5 blur-3xl pointer-events-none" />

      {/* Elegant Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={700}
          height={160}
          rotate={10}
          gradient="from-orange-400/20 via-orange-300/15 to-yellow-400/10"
          className="left-[-10%] top-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={450}
          height={120}
          rotate={-25}
          gradient="from-orange-300/15 via-yellow-300/10"
          className="right-[-5%] top-[60%]"
        />
        <ElegantShape
          delay={0.4}
          width={350}
          height={90}
          rotate={-15}
          gradient="from-orange-400/15"
          className="left-[5%] bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={220}
          height={70}
          rotate={25}
          gradient="from-yellow-400/15"
          className="right-[15%] top-[20%]"
        />
        <ElegantShape
          delay={0.7}
          width={180}
          height={50}
          rotate={-30}
          gradient="from-orange-300/15"
          className="left-[20%] top-[10%]"
        />
        <ElegantShape
          delay={0.8}
          width={500}
          height={100}
          rotate={15}
          gradient="from-pink-400/15 via-purple-400/10"
          className="right-[5%] bottom-[20%]"
        />
        <ElegantShape
          delay={0.9}
          width={300}
          height={80}
          rotate={-20}
          gradient="from-blue-400/15 via-cyan-400/10"
          className="left-[15%] top-[25%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-8 bg-white/5 backdrop-blur-sm shadow-[0_0_4px_rgba(0,255,255,0.2)] transition-shadow duration-300"
          >
            <Circle className="h-2 w-2 fill-sky-400/60" />
            <span className="text-sm text-white/70 tracking-wide">{badge}</span>
          </motion.div>

          {/* Title */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold mb-6 md:mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white/90 to-blue-400 drop-shadow-[0_0_6px_rgba(0,255,255,0.25)] transition-all duration-300">
              <span>{title1}</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white/90 to-sky-600">
                {title2}
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg md:text-xl mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4 text-white/70 drop-shadow-[0_0_4px_rgba(0,255,255,0.15)] transition-shadow duration-300"
          >
            {description}
          </motion.div>

          {/* CTA Button */}
          {ctaText && ctaHref && (
            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-block relative overflow-visible"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <MagneticButton
                  onClick={() => (window.location.href = ctaHref)}
                  className="relative px-8 py-4 text-white font-semibold text-lg rounded-full
                     bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300
                     shadow-[0_0_10px_rgba(255,200,0,0.4)]
                     hover:shadow-[0_0_20px_rgba(255,220,50,0.5)]
                     after:absolute after:inset-0 after:rounded-full after:blur-xl after:bg-gradient-to-r after:from-yellow-400/20 after:via-orange-400/10 after:to-amber-300/10 after:pointer-events-none
                     transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2 text-white/80" />
                  {ctaText}
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
}

export type { HeroGeometricProps, ElegantShapeProps };
