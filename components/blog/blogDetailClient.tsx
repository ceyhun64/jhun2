"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Calendar,
  Clock,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import { useParams, useRouter } from "next/navigation";
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
  image: string;
  createdAt: string;
}

const BlogDetailSkeleton = () => (
  <div className="max-w-5xl mx-auto mt-32 px-6">
    <Skeleton className="w-full aspect-[21/9] rounded-3xl bg-zinc-200 dark:bg-white/5" />
    <div className="mt-12 space-y-6">
      <Skeleton className="h-16 w-3/4 bg-zinc-200 dark:bg-white/5" />
      <Skeleton className="h-6 w-1/4 bg-zinc-200 dark:bg-white/5" />
      <div className="space-y-4 pt-10">
        <Skeleton className="h-4 w-full bg-zinc-200 dark:bg-white/5" />
        <Skeleton className="h-4 w-full bg-zinc-200 dark:bg-white/5" />
        <Skeleton className="h-4 w-2/3 bg-zinc-200 dark:bg-white/5" />
      </div>
    </div>
  </div>
);

export default function BlogDetailClient({ dict, locale }: Props) {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${id}`);
        const data = await response.json();
        setBlog(data.blog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-[#030303]">
        <BlogDetailSkeleton />
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#030303] text-zinc-900 dark:text-white">
        <Bot className="w-16 h-16 text-amber-500 mb-6" />
        <h1 className="text-2xl font-light tracking-widest uppercase">
          {dict?.notFound || "Blog Not Found"}
        </h1>
        <button
          onClick={() => router.back()}
          className="mt-8 text-amber-500 hover:text-amber-400 flex items-center gap-2 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          {dict?.backButton || "Go Back"}
        </button>
      </div>
    );

  const title = locale === "en" && blog.titleEng ? blog.titleEng : blog.title;
  const summary =
    locale === "en" && blog.summaryEng ? blog.summaryEng : blog.summary;
  const description =
    locale === "en" && blog.descriptionEng
      ? blog.descriptionEng
      : blog.description;

  return (
    <div className="relative min-h-screen bg-white dark:bg-gradient-to-br dark:from-black dark:to-black text-zinc-700 dark:text-zinc-300 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="fixed inset-0 z-0 dark:block hidden">
        <div className="w-full h-full bg-transparent" />
      </div>

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Back Button & Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-tighter text-xs"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {dict?.backToBlog || "Back to Blog"}
            </button>
            <div className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              {dict?.categoryLabel || "Insight"}
            </div>
          </motion.div>

          {/* Hero Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mb-12"
          >
            <h1 className="text-4xl md:text-7xl font-medium tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              <GradientText
                gradient="linear-gradient(to right, #18181b, #71717a)"
                className="inline dark:bg-gradient-to-r dark:from-white dark:to-zinc-400"
                text={title}
              />
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 dark:text-zinc-500 font-light">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500/70" />
                {new Date(blog.createdAt).toLocaleDateString(
                  locale === "tr" ? "tr-TR" : "en-US",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500/70" />
                {dict?.readTime || "5 min read"}
              </div>
              <button className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
                {dict?.shareButton || "Share"}
              </button>
            </div>
          </motion.header>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[21/9] rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/5 shadow-2xl mb-16"
          >
            <Image
              src={blog.image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#030303] via-transparent to-transparent opacity-60" />
          </motion.div>

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8 space-y-12"
            >
              {/* Summary Block */}
              <div className="relative pl-8 border-l-2 border-amber-500/50">
                <p className="text-xl md:text-2xl text-zinc-800 dark:text-zinc-200 leading-relaxed font-light italic">
                  {summary}
                </p>
              </div>

              {/* Main Text */}
              <article className="prose prose-zinc dark:prose-invert prose-amber max-w-none">
                <div className="text-zinc-600 dark:text-zinc-400 leading-[1.8] text-lg font-light whitespace-pre-line space-y-6">
                  {description}
                </div>
              </article>
            </motion.div>

            {/* Sidebar / Extra Info */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-32 p-8 rounded-3xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02] backdrop-blur-md">
                <h3 className="text-zinc-900 dark:text-white font-medium mb-4 uppercase tracking-widest text-xs text-amber-500">
                  {dict?.sidebar?.title || "About this article"}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-light">
                  {dict?.sidebar?.description ||
                    "This content provides an in-depth look at the future of AI and digital transformation."}
                </p>
                <div className="h-[1px] w-full bg-zinc-200 dark:bg-white/10 mb-6" />
                <Link
                  href={`/${locale}/blog`}
                  className="group flex items-center justify-between text-zinc-900 dark:text-white text-sm hover:text-amber-500 transition-colors"
                >
                  <span>{dict?.sidebar?.exploreMore || "Explore more"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* Premium CTA */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 max-w-4xl mx-auto"
        >
          <div className="relative p-12 md:p-20 rounded-[3rem] overflow-hidden border border-amber-500/20 text-center">
            {/* CTA Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent)]" />

            <h2 className="text-3xl md:text-5xl font-medium text-zinc-900 dark:text-white mb-6 tracking-tight">
              {dict?.cta?.title || "Let's Shape the Future"}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-10 max-w-lg mx-auto font-light leading-relaxed">
              {dict?.cta?.text ||
                "Elevate your business with cutting-edge digital solutions tailored to your needs."}
            </p>

            <Link
              href={`/${locale}/contact`}
              className="relative inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-500 group overflow-hidden"
            >
              <span className="relative z-10">
                {dict?.cta?.button || "Get in Touch"}
              </span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
