"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Bot, Calendar } from "lucide-react";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { SparklesCore } from "../ui/shadcn-io/sparkles";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

type Props = {
  locale: "tr" | "en";
  dict: any;
};

interface Blog {
  id: string;
  title: string;
  titleEng: string | null;
  summary: string;
  summaryEng: string | null;
  description: string;
  descriptionEng: string | null;
  url: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Blog Detail Skeleton Bileşeni
const BlogDetailSkeleton = ({ dict }: { dict: any }) => (
  <div className="max-w-8xl mx-auto mt-20 p-3 md:p-12 rounded-3xl border border-blue-500/20 bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col gap-12 relative overflow-hidden">
    {/* Ana Görsel İskeleti */}
    <Skeleton className="relative w-full aspect-video lg:aspect-[21/9] rounded-xl bg-zinc-800" />

    {/* İçerik İskeleti */}
    <div className="flex flex-col gap-6">
      {/* Başlık İskeleti */}
      <Skeleton className="h-12 w-3/4 md:w-4/5 rounded-lg bg-amber-300/50" />

      {/* Tarih İskeleti */}
      <Skeleton className="h-5 w-48 rounded bg-zinc-700" />

      {/* Alt Çizgi İskeleti */}
      <Skeleton className="h-1 w-24 rounded-full bg-blue-500/50 mt-2" />

      {/* Özet İskeleti */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-full rounded bg-zinc-700" />
        <Skeleton className="h-5 w-11/12 rounded bg-zinc-700" />
      </div>

      {/* Açıklama İskeleti */}
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-full rounded bg-zinc-800" />
        <Skeleton className="h-4 w-10/12 rounded bg-zinc-800" />
        <Skeleton className="h-4 w-full rounded bg-zinc-800" />
        <Skeleton className="h-4 w-8/12 rounded bg-zinc-800" />
        <Skeleton className="h-4 w-full rounded bg-zinc-800" />
        <Skeleton className="h-4 w-9/12 rounded bg-zinc-800" />
      </div>
    </div>
  </div>
);

export default function BlogDetailClient({ dict, locale }: Props) {
  const params = useParams();
  const id = params.id;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("Geçersiz blog ID'si.");
      return;
    }

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/blog/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog bulunamadı.");
          }
          throw new Error("Veri çekme sırasında bir hata oluştu.");
        }

        const data = await response.json();
        setBlog(data.blog);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Bilinmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const NotFoundPlaceholder = () => (
    <div className="min-h-screen flex items-center justify-center text-white text-3xl font-bold bg-black/80">
      {dict.notFound || "Blog bulunamadı"}
      <Bot className="animate-pulse ml-2" />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-indigo-950 to-black text-white py-1 md:py-10 px-3 md:px-20 overflow-hidden relative font-mono">
        <BlogDetailSkeleton dict={dict} />
      </div>
    );
  }

  if (error || !blog) {
    return <NotFoundPlaceholder />;
  }

  // Locale'e göre içerik seçimi
  const title = locale === "en" && blog.titleEng ? blog.titleEng : blog.title;
  const summary =
    locale === "en" && blog.summaryEng ? blog.summaryEng : blog.summary;
  const description =
    locale === "en" && blog.descriptionEng
      ? blog.descriptionEng
      : blog.description;

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-indigo-950 to-black text-white py-1 md:py-10 px-3 md:px-20 overflow-hidden relative font-mono">
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

      {/* Ana İçerik */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-8xl mx-auto mt-20 p-3 md:p-12 rounded-3xl border border-blue-500/20 bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col gap-12 relative overflow-hidden"
      >
        {/* Ana Görsel */}
        <motion.div
          className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative w-full aspect-video lg:aspect-[21/9] rounded-xl overflow-hidden">
            <Image
              src={blog.image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              className="object-cover object-center"
              priority
            />
          </div>
        </motion.div>

        {/* İçerik Alanı */}
        <div className="relative flex flex-col gap-6">
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-4xl">
            <motion.div
              animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-linear-to-tr from-amber-400 via-amber-500 to-amber-300 opacity-20 rounded-full filter blur-3xl"
            ></motion.div>

            <motion.div
              animate={{ x: [50, -50, 50], y: [-30, 30, -30] }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-linear-to-br from-amber-300 via-amber-400 to-amber-500 opacity-15 rounded-full filter blur-2xl"
            ></motion.div>
          </div>

          {/* Başlık */}
          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight font-mono text-transparent bg-clip-text bg-linear-to-r from-amber-500 via-amber-300 to-yellow-100 drop-shadow-[0_0_12px_rgba(255,180,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(255,200,0,0.9)] transition-shadow duration-300">
            <GradientText
              gradient="linear-gradient(90deg, #f59e0b 0%, #fbbf24 40%, #fef3c7 60%, #fbbf24 80%, #f59e0b 100%)"
              text={title}
              className="inline font-mono"
            />
          </h1>

          {/* Tarih */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(blog.createdAt).toLocaleDateString(
                locale === "tr" ? "tr-TR" : "en-US",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>
          </div>

          {/* Neon alt çizgi */}
          <div className="h-1 w-24 bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full"></div>

          {/* Özet */}
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans">
              {summary}
            </p>
          </div>

          {/* Açıklama */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">
              {locale === "tr" ? "İçerik" : "Content"}
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-sm md:text-base font-mono whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>

          {/* URL Bilgisi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pt-6 border-t border-white/10"
          >
            <p className="text-sm text-gray-400">
              Blog URL: <span className="text-blue-400">{blog.url}</span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA (Call To Action) Bölümü */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-32 mb-20 text-center relative z-10"
      >
        <div className="relative inline-block px-10 py-8 rounded-3xl bg-linear-to-r from-amber-400 via-orange-500 to-yellow-400 border border-amber-500/30 shadow-[0_0_50px_rgba(255,200,0,0.5)] hover:shadow-[0_0_80px_rgba(255,220,100,0.7)] transition-all duration-700 backdrop-blur-md">
          <h2 className="text-3xl md:text-5xl font-extrabold font-mono text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-100 to-white drop-shadow-[0_0_15px_rgba(255,220,100,0.3)]">
            {dict.cta?.title || "Birlikte Çalışalım"}
          </h2>
          <p className="text-gray-200 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            {dict.cta?.subtitle || "Projeleriniz için benimle iletişime geçin"}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-amber-500 via-orange-400 to-yellow-300 rounded-full text-black font-semibold text-base md:text-lg shadow-[0_0_20px_rgba(255,200,0,0.7)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,220,100,0.8)] transition-all duration-300"
          >
            {dict.cta?.button || "İletişime Geç"}{" "}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className="w-[400px] h-[400px] bg-linear-to-r from-amber-400 via-yellow-500 to-orange-400 opacity-20 blur-3xl rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}
