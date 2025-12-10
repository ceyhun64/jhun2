// ProjectModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, ArrowLeft, Github, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface Technology {
  id: string;
  name: string;
  icon: string;
  type: string;
  yoe: number;
  color: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    titleEng: string | null;
    summary: string;
    summaryEng: string | null;
    description: string;
    descriptionEng: string | null;
    image: string;
    subImage1?: string | null;
    subImage2?: string | null;
    subImage3?: string | null;
    subImage4?: string | null;
    subImage5?: string | null;
    demoUrl?: string | null;
    githubUrl?: string | null;
    technologies?: Technology[];
  } | null;
}

export default function ProjectModal({
  isOpen,
  onClose,
  project,
}: ProjectModalProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScrollability = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      checkScrollability();
      carousel.addEventListener("scroll", checkScrollability);
      return () => carousel.removeEventListener("scroll", checkScrollability);
    }
  }, [project]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!project) return null;

  const {
    title,
    titleEng,
    summary,
    summaryEng,
    description,
    descriptionEng,
    image,
    subImage1,
    subImage2,
    subImage3,
    subImage4,
    subImage5,
    demoUrl,
    githubUrl,
    technologies = [],
  } = project;

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-7xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 rounded-2xl border border-blue-500/20 bg-neutral-900/95 backdrop-blur-md shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors shadow-lg"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Sol: Görseller */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
                >
                  <Image
                    src={image}
                    alt={title}
                    width={1000}
                    height={600}
                    className="object-cover object-center w-full h-auto rounded-xl"
                  />
                </motion.div>

                {images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    {canScrollLeft && (
                      <button
                        onClick={() => scroll("left")}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition shadow-lg"
                        aria-label="Sola kaydır"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}

                    <div
                      ref={carouselRef}
                      className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {images.map((img, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className="relative w-60 h-40 shrink-0 rounded-lg shadow-lg overflow-hidden border border-white/10"
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

                    {canScrollRight && (
                      <button
                        onClick={() => scroll("right")}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition shadow-lg"
                        aria-label="Sağa kaydır"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Demo ve GitHub butonları */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-3"
                >
                  {demoUrl && (
                    <Button
                      onClick={() => window.open(demoUrl, "_blank")}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-orange-500/50 transition-all"
                    >
                      Siteye Git <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                  {githubUrl && (
                    <Button
                      onClick={() => window.open(githubUrl, "_blank")}
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-gray-700/50 transition-all"
                    >
                      GitHub <Github className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              </div>

              {/* Sağ: İçerik */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex flex-col gap-6"
              >
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent mb-2">
                    {title}
                  </h1>
                  {titleEng && (
                    <p className="text-xl text-gray-400 font-light">
                      {titleEng}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {summary}
                  </p>
                  {summaryEng && (
                    <p className="text-gray-300 text-base leading-relaxed">
                      {summaryEng}
                    </p>
                  )}
                </div>

                {technologies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Kullanılan Teknolojiler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech.id}
                          className="px-3 py-1.5 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-full text-sm font-medium"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {description && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Açıklama
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                        {description}
                      </p>
                    </div>
                  )}

                  {descriptionEng && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Description
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                        {descriptionEng}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
