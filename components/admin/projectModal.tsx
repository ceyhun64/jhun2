"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, ArrowLeft, Github } from "lucide-react";
import { useRef } from "react";
import "react-medium-image-zoom/dist/styles.css";
import { useState } from "react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    summary: string;
    description: string;
    image: string;
    subImage1?: string;
    subImage2?: string;
    subImage3?: string;
    subImage4?: string;
    subImage5?: string;
    demoUrl?: string;
    githubUrl?: string;
  } | null;
}

export default function ProjectModal({
  isOpen,
  onClose,
  project,
}: ProjectModalProps) {
  const [isTechModalOpen, setTechModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !project) return null;

  const {
    title,
    summary,
    description,
    image,
    subImage1,
    subImage2,
    subImage3,
    subImage4,
    subImage5,
    demoUrl,
    githubUrl,
  } = project;

  // subImage alanlarını array’e çeviriyoruz
  const images = [subImage1, subImage2, subImage3, subImage4, subImage5].filter(
    Boolean
  ) as string[];

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const offset = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
    carouselRef.current.scrollTo({
      left: scrollLeft + offset,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-8xl mx-auto p-6 md:p-12 rounded-3xl border border-blue-500/20 bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col lg:flex-row items-start lg:items-center gap-12 relative overflow-hidden"
      >
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full font-semibold"
        >
          Kapat
        </button>

        {/* Sol: Büyük görsel + küçük görseller */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <motion.div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <Image
              src={image} // Ana görsel
              alt={title}
              width={1000}
              height={600}
              className="object-cover object-center w-full h-auto rounded-xl"
            />
          </motion.div>

          {images.length > 0 && (
            <div className="relative">
              {/* Sol Ok */}
              <button
                onClick={() => scroll("left")}
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Görseller Carousel */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-hidden scroll-smooth"
              >
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="relative w-60 h-42 shrink-0 rounded-lg shadow-lg overflow-hidden border border-white/10"
                  >
                    <Image
                      src={img}
                      alt={`Screenshot ${idx + 1}`}
                      fill
                      className="object-cover object-center"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Sağ Ok */}
              <button
                onClick={() => scroll("right")}
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Demo ve GitHub butonları */}
          <div className="flex flex-wrap gap-4 mt-6">
            {demoUrl && (
              <Button
                onClick={() => window.open(demoUrl, "_blank")}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all"
              >
                Siteye Git <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            {githubUrl && (
              <Button
                onClick={() => window.open(githubUrl, "_blank")}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                GitHub <Github className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Sağ: Bilgi */}
        <div className="relative flex-1 flex flex-col justify-center gap-6 p-4 md:p-0">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-100 drop-shadow-[0_0_12px_rgba(255,180,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(255,200,0,0.9)] transition-shadow duration-300">
            {title}
          </h1>

          <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans">
            {summary}
          </p>
          <p className="text-gray-300 leading-relaxed text-base md:text-md font-mono whitespace-pre-line">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
