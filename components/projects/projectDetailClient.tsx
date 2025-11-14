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

import Link from "next/link";

type Props = {
  locale: "tr" | "en";
  dict: any;
};

// API'dan gelecek proje yapısını tanımlayalım (Prisma modeline uygun olmalı)
interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  subImage1?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
  subImage5?: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  // Technology: TechnologyItem'ın beklediği tip olmalı
  technologies: Technology[];
}

export default function ProjectDetailClient({ dict, locale }: Props) {
  const params = useParams();
  const id = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>(project?.image || "");
  const [smallImages, setSmallImages] = useState<string[]>([]);

  // Project değiştiğinde mainImage’i resetle

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
          // Büyük görseli çıkarıyoruz, böylece mainImage zaten büyük olduğu için tekrar gözükmez
          .filter((img) => img !== project.image)
      );
    }
  }, [project]);

  const handleThumbnailClick = (img: string) => {
    // Küçük görsel tıklanınca büyük görsel ile yer değiştir
    setSmallImages((prev) => prev.map((i) => (i === img ? mainImage : i)));
    setMainImage(img);
  };

  // DÜZELTME 1: Bütün Hook'ları koşulsuz olarak fonksiyonun başına taşıdık.
  // Bu, React'in Hook sıralama kuralına uyar ve hatayı çözer.
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // --- Veri Çekme İşlemi (useEffect) ---
  useEffect(() => {
    // Geçersiz ID kontrolü
    if (id === null) {
      setLoading(false);
      setError("Geçersiz proje ID'si.");
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        // Belirtilen API rotasını kullanıyoruz
        const response = await fetch(`/api/projects/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Proje bulunamadı.");
          }
          throw new Error("Veri çekme sırasında bir hata oluştu.");
        }

        const data = await response.json();
        console.log(data);
        setProject(data.project); // API'dan gelen JSON yapısına göre (data: { project: Project })
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Bilinmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]); // ID değiştiğinde tekrar çalıştır
  // Proje bulunamazsa gösterilecek placeholder (Proje bulunamadı)
  const NotFoundPlaceholder = () => (
    <div className="min-h-screen flex items-center justify-center text-white text-3xl font-bold bg-black/80">
      {dict.notFound}
      <Bot className="animate-pulse ml-2" />
    </div>
  );

  // Yüklenme durumunda gösterilecek placeholder
  const LoadingPlaceholder = () => (
    <div className="min-h-screen flex items-center justify-center text-white text-3xl font-bold bg-black">
      {dict.loading} <Bot className="animate-pulse ml-2" />
    </div>
  );

  // DÜZELTME 2: Koşullu Çıkışlar (loading, error) tüm Hook'lardan SONRA gelmelidir.
  if (loading) {
    return <LoadingPlaceholder />;
  }

  if (error || !project) {
    return <NotFoundPlaceholder />;
  }

  // --- Carousel kaydırma işlevi (Hook değil, kalabilir) ---
  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 300; // Her tıklamada kayacak mesafe
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

  // API'dan gelen projenin alanları
  const {
    title,
    summary,
    description,
    technologies,
    image,
    subImage1,
    subImage2,
    subImage3,
    subImage4,
    subImage5,
    demoUrl,
    githubUrl,
  } = project;

  // Eğer `images` boş gelirse, bu durum için boş dizi ataması yapalım (API'da null/undefined gelirse)
  // API'dan gelen subImage alanlarını diziye dönüştürelim
  const projectImages = [
    project.subImage1,
    project.subImage2,
    project.subImage3,
    project.subImage4,
    project.subImage5,
  ].filter((img): img is string => Boolean(img)); // boş olanları çıkar

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-black text-white py-1 md:py-10 px-3 md:px-20 overflow-hidden relative font-mono">
      <SparklesCore
        id="tsparticlesfullpage1"
        background="transparent"
        minSize={1}
        maxSize={2}
        particleDensity={50}
        className="absolute inset-0 w-full h-full"
        particleColor="#FFFFFF"
        speed={1}
      />

      {/* Görseller ve detay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-8xl mx-auto mt-20 p-3 md:p-12 rounded-3xl border border-blue-500/20 bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col lg:flex-row items-start lg:items-center gap-12 relative overflow-hidden"
      >
        {/* Sol: Görseller */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <motion.div
            className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
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
                    alt={title}
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
              {/* Sol ok */}
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition sm:-left-6"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Küçük görseller */}
              <div
                ref={carouselRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-none"
              >
                {smallImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleThumbnailClick(img)}
                    className="relative w-32 h-20 sm:w-60 sm:h-36 shrink-0 rounded-lg shadow-lg overflow-hidden border border-white/10 cursor-pointer"
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

              {/* Sağ ok */}
              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition sm:-right-6"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          {/* Butonlar (sadece masaüstünde görsellerin altında) */}
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
        <div className="relative flex-1 flex flex-col justify-center gap-6 md:gap-3  md:p-0 ">
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-4xl">
            {/* Büyük yumuşak glow top */}
            <motion.div
              animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-300 opacity-20 rounded-full filter blur-3xl"
            ></motion.div>

            {/* Küçük glow toplar */}
            <motion.div
              animate={{ x: [50, -50, 50], y: [-30, 30, -30] }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 opacity-15 rounded-full filter blur-2xl"
            ></motion.div>

            {/* Yavaş hareket eden küçük partiküller */}
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
                  className={`absolute w-1 h-1 bg-amber-200/40 rounded-full`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Başlık */}
          <h1 className=" p-0 md:p-4 text-3xl md:text-6xl font-extrabold tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-100 drop-shadow-[0_0_12px_rgba(255,180,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(255,200,0,0.9)] transition-shadow duration-300">
            <GradientText
              gradient="linear-gradient(90deg, #f59e0b 0%, #fbbf24 40%, #fef3c7 60%, #fbbf24 80%, #f59e0b 100%)"
              text={title}
              className="inline font-mono"
            />
          </h1>

          {/* Neon alt çizgi */}
          <div className="h-1 w-24 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full mt-2 md:ms-4 "></div>

          {/* Özet */}
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans p-0 md:p-4 ">
            {summary}
          </p>

          {/* Açıklama */}
          <p className="text-gray-300 leading-relaxed text-sm md:text-md font-mono whitespace-pre-line p-0 md:p-4 ">
            {description}
          </p>

          {/* Butonlar (sadece mobilde, en altta) */}
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

      {/* --- Yeni Eklenen Araçlar ve Teknoloji Yığını Bölümü --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="max-w-8xl mx-auto mt-20 p-2 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xs shadow-lg"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sol sütun */}
          <div className="flex flex-col space-y-2 md:space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white font-mono mt-2 p-4 md:p-0">
              {dict.technologiesTitle}
            </h2>

            <pre className="bg-gray-950/60 text-white p-2 md:p-4 rounded-2xl font-mono overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed mt-4 md:mt-6">
              <code>
                <span className="text-blue-400">&lt;div class=</span>
                <span className="text-yellow-400">"project-info"</span>
                <span className="text-blue-400">&gt;</span>
                {"\n  "}
                <span className="text-blue-400">&lt;p&gt;</span>
                {"\n    "}
                {dict.technologiesIntro.p1}
                {"\n  "}
                <span className="text-blue-400">&lt;/p&gt;</span>
                {"\n"}
                {"\n  "}
                <span className="text-blue-400">&lt;p&gt;</span>
                {"\n    "}
                {dict.technologiesIntro.p2}
                {"\n  "}
                <span className="text-blue-400">&lt;/p&gt;</span>
                {"\n"}
                {"\n  "}
                <span className="text-blue-400">&lt;p&gt;</span>
                {"\n    "}
                {dict.technologiesIntro.p3}
                {"\n  "}
                <span className="text-blue-400">&lt;/p&gt;</span>
                {"\n"}
                {"\n  "}
                <span className="text-blue-400">&lt;p&gt;</span>
                {"\n    "}
                {dict.technologiesIntro.p4}
                {"\n  "}
                <span className="text-blue-400">&lt;/p&gt;</span>
                {"\n"}
                {"\n  "}
                <span className="text-blue-400">&lt;p&gt;</span>
                {"\n    "}
                {dict.technologiesIntro.p5}
                {"\n  "}
                <span className="text-blue-400">&lt;/p&gt;</span>
                {"\n"} {"\n  "}
                <span className="text-blue-400">&lt;p&gt;</span>
                {"\n    "}
                {dict.technologiesIntro.p6}
                <span className="ml-1 animate-blink text-green-400">_</span>
                {"\n  "}
                <span className="text-blue-400">&lt;/p&gt;</span>
                {"\n"}
                <span className="text-blue-400">&lt;/div&gt;</span>
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

            {/* 🌐 Masaüstü: Butonlar (yerinde kalır) */}
            <div className="hidden lg:flex space-x-6 mt-2 md:mt-8 p-4 md:p-0">
              <a
                href={githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                <span className="font-medium">{dict.links.openGithub}</span>
              </a>
              <Link
                href={`/${locale}/contact`}
                className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors group"
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

            {/* 📱 Mobil: Butonlar en altta */}
            <div className="flex lg:hidden flex-row space-x-6 mt-8 p-4">
              <a
                href={githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                <span className="font-medium">{dict.links.openGithub}</span>
              </a>
              <Link
                href={`/${locale}/contact`}
                className="flex items-center justify-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                <span className="font-medium">{dict.links.getInTouch}</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- CTA (Call To Action) Bölümü --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-32 mb-20 text-center relative z-10"
      >
        <div className="relative inline-block px-10 py-8 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 border border-amber-500/30 shadow-[0_0_50px_rgba(255,200,0,0.5)] hover:shadow-[0_0_80px_rgba(255,220,100,0.7)] transition-all duration-700 backdrop-blur-md">
          <h2 className="text-3xl md:text-5xl  font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-white drop-shadow-[0_0_15px_rgba(255,220,100,0.3)]">
            {dict.cta.title}
          </h2>
          <p className="text-gray-200 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            {dict.cta.subtitle}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300 rounded-full text-black font-semibold text-base md:text-lg shadow-[0_0_20px_rgba(255,200,0,0.7)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,220,100,0.8)] transition-all duration-300"
          >
            {dict.cta.button} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hafif arka plan glow efekti */}
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className="w-[400px] h-[400px] bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 opacity-20 blur-3xl rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}
