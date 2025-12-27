// components/projects/projectDetailClient.tsx

"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Bot, ArrowLeft } from "lucide-react";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import { useParams } from "next/navigation";
import { ImageZoom } from "../ui/shadcn-io/image-zoom";
import { cn } from "@/lib/utils";
import { SparklesCore } from "../ui/shadcn-io/sparkles";
import { TechnologyItem, Technology } from "./technologyItem";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { useTheme } from "next-themes";

type Props = {
  locale: "tr" | "en";
  dict: any;
};

interface Project {
  id: string;
  title: string;
  titleEng?: string;
  summary: string;
  summaryEng?: string;
  description: string;
  descriptionEng?: string;
  image: string;
  subImage1?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
  subImage5?: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  technologies: Technology[];
}

// ✅ Skeleton Bileşeni - Light/Dark Theme Uyumlu
const ProjectDetailSkeleton = ({ dict }: { dict: any }) => (
  <div className="max-w-8xl mx-auto mt-20 p-3 md:p-12 rounded-3xl border border-gray-300 dark:border-blue-500/20 bg-white/80 dark:bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col lg:flex-row items-start lg:items-center gap-12 relative overflow-hidden">
    {/* Sol: Görseller İskeleti */}
    <div className="w-full lg:w-1/2 flex flex-col gap-6">
      <Skeleton className="relative w-full aspect-video lg:aspect-[16/9] rounded-xl bg-gray-300 dark:bg-zinc-800" />
      <div className="flex gap-4 overflow-x-hidden">
        <Skeleton className="w-32 h-20 sm:w-60 sm:h-36 shrink-0 rounded-lg bg-gray-300 dark:bg-zinc-800" />
        <Skeleton className="w-32 h-20 sm:w-60 sm:h-36 shrink-0 rounded-lg bg-gray-300 dark:bg-zinc-800" />
        <Skeleton className="w-32 h-20 sm:w-60 sm:h-36 shrink-0 rounded-lg bg-gray-300 dark:bg-zinc-800" />
      </div>
      <div className="hidden lg:flex flex-wrap gap-4 mt-4">
        <Skeleton className="h-10 w-24 rounded-full bg-gray-300 dark:bg-zinc-700" />
        <Skeleton className="h-10 w-32 rounded-full bg-gray-300 dark:bg-zinc-700" />
      </div>
    </div>

    {/* Sağ: Bilgi Alanı İskeleti */}
    <div className="flex-1 flex flex-col justify-center gap-6">
      <Skeleton className="h-12 w-3/4 md:w-4/5 rounded-lg bg-amber-300/50" />
      <Skeleton className="h-1 w-24 rounded-full bg-blue-500/50 mt-2" />
      <Skeleton className="h-5 w-full rounded bg-gray-300 dark:bg-zinc-700" />
      <Skeleton className="h-5 w-11/12 rounded bg-gray-300 dark:bg-zinc-700" />
      <Skeleton className="h-4 w-full rounded bg-gray-300 dark:bg-zinc-800" />
      <Skeleton className="h-4 w-10/12 rounded bg-gray-300 dark:bg-zinc-800" />
      <Skeleton className="h-4 w-full rounded bg-gray-300 dark:bg-zinc-800" />
      <Skeleton className="h-4 w-8/12 rounded bg-gray-300 dark:bg-zinc-800" />
      <div className="flex flex-wrap justify-center gap-4 mt-4 lg:hidden">
        <Skeleton className="h-10 w-24 rounded-full bg-gray-300 dark:bg-zinc-700" />
        <Skeleton className="h-10 w-32 rounded-full bg-gray-300 dark:bg-zinc-700" />
      </div>
    </div>
  </div>
);

// ✅ Teknoloji Skeleton - Light/Dark Uyumlu
const TechnologySkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center space-x-4 p-2 bg-gray-200 dark:bg-zinc-900/50 rounded-lg"
      >
        <Skeleton className="h-8 w-8 rounded-full bg-gray-300 dark:bg-zinc-700" />
        <div className="flex-1">
          <Skeleton className="h-4 w-2/5 rounded bg-gray-300 dark:bg-zinc-700" />
          <Skeleton className="h-3 w-4/5 rounded bg-gray-300 dark:bg-zinc-800 mt-1" />
        </div>
      </div>
    ))}
  </div>
);

export default function ProjectDetailClient({ dict, locale }: Props) {
  const params = useParams();
  const id = params.id;
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [smallImages, setSmallImages] = useState<string[]>([]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // useTheme için mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Tema durumuna göre parçacık rengini belirle
  const currentTheme = mounted ? (resolvedTheme || theme) : "light";
  const particleColor = currentTheme === "dark" ? "#FFFFFF" : "#000000";

  useEffect(() => {
    if (project) {
      setMainImage(project.image);
      setSmallImages(
        [
          project.subImage1,
          project.subImage2,
          project.subImage3,
          project.subImage4,
          project.subImage5,
        ]
          .filter((img): img is string => Boolean(img))
          .filter((img) => img !== project.image)
      );
    } else {
      setMainImage("");
      setSmallImages([]);
    }
  }, [project]);

  const handleThumbnailClick = (img: string) => {
    setSmallImages((prev) => prev.map((i) => (i === img ? mainImage : i)));
    setMainImage(img);
  };

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("Geçersiz proje ID'si.");
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Proje bulunamadı.");
          }
          throw new Error("Veri çekme sırasında bir hata oluştu.");
        }

        const data = await response.json();
        setProject(data.project);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Bilinmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const NotFoundPlaceholder = () => (
    <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-white text-3xl font-bold bg-gray-100 dark:bg-black/80">
      {dict.notFound}
      <Bot className="animate-pulse ml-2" />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-black dark:via-indigo-950 dark:to-black text-gray-900 dark:text-white py-1 md:py-10 px-3 md:px-20 overflow-hidden relative font-mono">
        <ProjectDetailSkeleton dict={dict} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-8xl mx-auto mt-20 p-2 md:p-12 rounded-3xl border border-gray-300 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xs shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col space-y-6">
              <Skeleton className="h-10 w-3/4 rounded-lg bg-gray-300 dark:bg-zinc-700" />
              <Skeleton className="h-32 w-full rounded-2xl bg-gray-200 dark:bg-zinc-950/60" />
            </div>
            <TechnologySkeleton />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !project) {
    return <NotFoundPlaceholder />;
  }

  const {
    title,
    titleEng,
    summary,
    summaryEng,
    description,
    descriptionEng,
    technologies,
    demoUrl,
    githubUrl,
  } = project;

  const displayTitle = locale === "en" && titleEng ? titleEng : title;
  const displaySummary = locale === "en" && summaryEng ? summaryEng : summary;
  const displayDescription =
    locale === "en" && descriptionEng ? descriptionEng : description;

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    const currentScrollLeft = carouselRef.current.scrollLeft;

    let newScrollPosition;
    if (direction === "left") {
      newScrollPosition = Math.max(currentScrollLeft - scrollAmount, 0);
    } else {
      newScrollPosition = currentScrollLeft + scrollAmount;
    }

    carouselRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
    setScrollPosition(newScrollPosition);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] via-gray-200 to-[#F5F7FA] dark:from-black dark:via-indigo-950 dark:to-black text-gray-900 dark:text-white py-1 md:py-10 px-3 md:px-20 overflow-hidden relative font-mono">
      {mounted && (
        <SparklesCore
          id="tsparticlesfullpage1"
          background="transparent"
          minSize={1}
          maxSize={2}
          particleDensity={50}
          className="absolute inset-0 w-full h-full"
          particleColor={particleColor}
          speed={1}
        />
      )}

      {/* Görseller ve detay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-8xl mx-auto mt-20 p-3 md:p-12 rounded-3xl border border-blue-300/20 dark:border-blue-500/20 bg-black/5 dark:bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col lg:flex-row items-start lg:items-center gap-12 relative overflow-hidden"
      >
        {/* Sol: Görseller */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <motion.div
            className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-white/10 bg-white/50 dark:bg-white/5 shadow-2xl"
            whileHover={{ scale: 1.02 }}
          >
            {mainImage && (
              <ImageZoom
                backdropClassName={cn(
                  '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/60'
                )}
              >
                <div className="relative w-full aspect-video lg:aspect-[16/9] rounded-xl overflow-hidden">
                  <Image
                    src={mainImage}
                    alt={displayTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1000px"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </ImageZoom>
            )}
          </motion.div>

          {smallImages.length > 0 && (
            <div className="relative">
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-gray-900 dark:text-white p-2 rounded-full backdrop-blur-md transition sm:-left-6"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div
                ref={carouselRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-none"
              >
                {smallImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleThumbnailClick(img)}
                    className="relative w-32 h-20 sm:w-60 sm:h-36 shrink-0 rounded-lg shadow-lg overflow-hidden border border-gray-300 dark:border-white/10 cursor-pointer"
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

              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-gray-900 dark:text-white p-2 rounded-full backdrop-blur-md transition sm:-right-6"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          {/* Butonlar (masaüstü) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex flex-wrap gap-3 sm:gap-4 mt-4"
          >
            {githubUrl && (
              <Button
                onClick={() => window.open(githubUrl, "_blank")}
                className="flex items-center gap-2 bg-[#24292e] hover:bg-[#333] text-white px-4 py-2 rounded-full font-semibold shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all text-sm sm:text-base"
              >
                <Github className="w-4 h-4 text-white" />
                GitHub
              </Button>
            )}
            {demoUrl && (
              <Button
                onClick={() => window.open(demoUrl, "_blank")}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full font-semibold shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all text-sm sm:text-base"
              >
                {dict.demoButton} <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        </div>

        {/* Sağ: Bilgi Alanı */}
        <div className="relative flex-1 flex flex-col justify-center gap-6 md:gap-3 md:p-0">
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-4xl">
            {/* Glow efektleri - Light mode için daha yumuşak */}
            <motion.div
              animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-200 dark:from-amber-400 dark:via-amber-500 dark:to-amber-300 opacity-10 dark:opacity-20 rounded-full filter blur-3xl"
            ></motion.div>

            <motion.div
              animate={{ x: [50, -50, 50], y: [-30, 30, -30] }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 dark:from-amber-300 dark:via-amber-400 dark:to-amber-500 opacity-10 dark:opacity-15 rounded-full filter blur-2xl"
            ></motion.div>

            {/* Partiküller */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [-10, 10], x: [-5, 5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 5 + i,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                  className="absolute w-1 h-1 bg-amber-400/20 dark:bg-amber-200/40 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Başlık */}
          <h1 className="p-0 md:p-4 text-3xl md:text-6xl font-extrabold tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-500 dark:via-amber-300 dark:to-yellow-100 drop-shadow-[0_0_12px_rgba(255,180,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(255,200,0,0.9)] transition-shadow duration-300">
            <GradientText
              gradient="linear-gradient(90deg, #f59e0b 0%, #fbbf24 40%, #fef3c7 60%, #fbbf24 80%, #f59e0b 100%)"
              text={displayTitle}
              className="inline font-mono"
            />
          </h1>

          {/* Neon alt çizgi */}
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 rounded-full mt-2 md:ms-4"></div>

          {/* Özet */}
          <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl leading-relaxed font-sans p-0 md:p-4">
            {displaySummary}
          </p>

          {/* Açıklama */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-md font-mono whitespace-pre-line p-0 md:p-4">
            {displayDescription}
          </p>

          {/* Butonlar (mobil) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 md:mt-6 lg:hidden"
          >
            {githubUrl && (
              <Button
                onClick={() => window.open(githubUrl, "_blank")}
                className="flex items-center gap-2 bg-[#24292e] hover:bg-[#333] text-white px-4 py-2 rounded-full font-semibold shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all text-sm sm:text-base"
              >
                <Github className="w-4 h-4 text-white" />
                GitHub
              </Button>
            )}
            {demoUrl && (
              <Button
                onClick={() => window.open(demoUrl, "_blank")}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all text-sm sm:text-base"
              >
                {dict.demoButton} <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Araçlar ve Teknoloji Yığını */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="max-w-8xl mx-auto mt-20 p-2 md:p-12 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xs shadow-lg"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sol sütun */}
          <div className="flex flex-col space-y-2 md:space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white font-mono mt-2 p-4 md:p-0">
              {dict.technologiesTitle}
            </h2>

            <pre className="bg-gray-100 dark:bg-gray-950/60 text-gray-900 dark:text-white p-2 md:p-4 rounded-2xl font-mono overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed mt-4 md:mt-6 border border-gray-300 dark:border-gray-800">
              <code>
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;div class=
                </span>
                <span className="text-yellow-600 dark:text-yellow-400">
                  "project-info"
                </span>
                <span className="text-blue-600 dark:text-blue-400">&gt;</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;p&gt;
                </span>
                {"\n    "}
                {dict.technologiesIntro.p1}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;/p&gt;
                </span>
                {"\n"}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;p&gt;
                </span>
                {"\n    "}
                {dict.technologiesIntro.p2}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;/p&gt;
                </span>
                {"\n"}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;p&gt;
                </span>
                {"\n    "}
                {dict.technologiesIntro.p3}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;/p&gt;
                </span>
                {"\n"}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;p&gt;
                </span>
                {"\n    "}
                {dict.technologiesIntro.p4}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;/p&gt;
                </span>
                {"\n"}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;p&gt;
                </span>
                {"\n    "}
                {dict.technologiesIntro.p5}
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;/p&gt;
                </span>
                {"\n"} {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;p&gt;
                </span>
                {"\n    "}
                {dict.technologiesIntro.p6}
                <span className="ml-1 animate-blink text-green-600 dark:text-green-400">
                  _
                </span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;/p&gt;
                </span>
                {"\n"}
                <span className="text-blue-600 dark:text-blue-400">
                  &lt;/div&gt;
                </span>
              </code>
            </pre>

            <style jsx>{`
              .animate-blink {
                display: inline-block;
                width: 1ch;
                animation: blink 2s infinite;
              }
              @keyframes blink {
                0%,
                50%,
                100% {
                  opacity: 1;
                }
                25%,
                75% {
                  opacity: 0;
                }
              }
            `}</style>

            {/* Masaüstü: Butonlar */}
            <div className="hidden lg:flex space-x-6 mt-2 md:mt-8 p-4 md:p-0">
              <a
                href={githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                <span className="font-medium">{dict.links.openGithub}</span>
              </a>
              <Link
                href={`/${locale}/contact`}
                className="flex items-center space-x-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                <span className="font-medium">{dict.links.getInTouch}</span>
              </Link>
            </div>
          </div>

          {/* Sağ sütun */}
          <div className="space-y-4 mt-0 md:mt-10">
            {technologies.map((tech, idx) => (
              <TechnologyItem
                key={tech._id ? tech._id.toString() : idx}
                tech={tech}
              />
            ))}

            {/* Mobil: Butonlar */}
            <div className="flex lg:hidden flex-row space-x-6 mt-8 p-4">
              <a
                href={githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                <span className="font-medium">{dict.links.openGithub}</span>
              </a>
              <Link
                href={`/${locale}/contact`}
                className="flex items-center justify-center space-x-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                <span className="font-medium">{dict.links.getInTouch}</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA - Light/Dark Theme Uyumlu */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-32 mb-20 text-center relative z-10"
      >
        <div className="relative inline-block px-10 py-8 rounded-3xl bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 dark:from-amber-400 dark:via-orange-500 dark:to-yellow-400 border border-amber-300 dark:border-amber-500/30 shadow-[0_0_30px_rgba(255,200,0,0.3)] dark:shadow-[0_0_50px_rgba(255,200,0,0.5)] hover:shadow-[0_0_50px_rgba(255,200,0,0.4)] dark:hover:shadow-[0_0_80px_rgba(255,220,100,0.7)] transition-all duration-700 backdrop-blur-md">
          <h2 className="text-3xl md:text-5xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 dark:from-amber-200 dark:via-yellow-100 dark:to-white drop-shadow-[0_0_15px_rgba(255,220,100,0.3)]">
            {dict.cta.title}
          </h2>
          <p className="text-gray-800 dark:text-gray-200 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            {dict.cta.subtitle}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300 rounded-full text-white font-semibold text-base md:text-lg shadow-[0_0_20px_rgba(255,200,0,0.7)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,220,100,0.8)] transition-all duration-300"
          >
            {dict.cta.button} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Arka plan glow */}
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className="w-[400px] h-[400px] bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-200 dark:from-amber-400 dark:via-yellow-500 dark:to-orange-400 opacity-10 dark:opacity-20 blur-3xl rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}
