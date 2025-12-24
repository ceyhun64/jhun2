"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Search,
  Linkedin,
  Github,
  Clock,
  ExternalLink,
  TrendingUp,
  Quote,
  Newspaper,
  Sparkles,
  BookOpen,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import { GridPattern } from "../ui/shadcn-io/grid-pattern";
import { cn } from "@/lib/utils";
import { SplittingText } from "../ui/shadcn-io/splitting-text";

type Props = {
  dict: any;
  locale: "tr" | "en";
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

const BlogCardSkeleton = () => (
  <div className="w-full space-y-4 p-4 bg-linear-to-br from-zinc-900/50 to-zinc-950/50 border border-white/10 rounded-3xl backdrop-blur-sm">
    <div className="w-full aspect-[4/5] rounded-2xl bg-zinc-800/50 animate-pulse" />
    <div className="space-y-3 px-2">
      <div className="h-3 w-1/4 rounded-full bg-zinc-800/70 animate-pulse" />
      <div className="h-6 w-full rounded bg-zinc-800/70 animate-pulse" />
      <div className="h-3 w-4/5 rounded bg-zinc-800/70 animate-pulse" />
    </div>
  </div>
);

export default function BlogsClient({ dict, locale }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "recent">(
    "all"
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog", { cache: "no-store" });
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getLocalizedText = (blog: Blog, field: "title" | "summary") => {
    if (locale === "en")
      return field === "title"
        ? blog.titleEng || blog.title
        : blog.summaryEng || blog.summary;
    return blog[field];
  };

  const filteredBlogs = blogs.filter((blog) =>
    getLocalizedText(blog, "title")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-linear-to-b from-black via-zinc-950 to-black text-zinc-100 selection:bg-blue-500/30">
      {/* Ambient Background Effects */}
      <GridPattern className={cn(" opacity-40", "skew-y-12")} />
      <div className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="relative py-12 md:py-25 px-4 md:px-6 overflow-hidden">
          <div className="max-w-8xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-10 items-center">
              {/* Profile Side */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 relative"
              >
                <div className="relative z-10 w-full max-w-md mx-auto aspect-[3/4] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group shadow-2xl shadow-blue-900/20">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-purple-500/10 to-blue-500/20 blur-xl group-hover:blur-2xl transition-all duration-700" />

                  <div className="relative h-full bg-linear-to-br from-zinc-900 to-black border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden">
                    <img
                      src="/avatar/avatar2.jpg"
                      alt="Founder"
                      className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-6 left-6 right-6 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-4xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <BadgeCheck className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            .jhun CEO
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            Curated Insights
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-purple-500/10 blur-[100px] rounded-full" />
              </motion.div>

              {/* Text Side */}
              <div className="lg:col-span-7 space-y-8 md:space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-6"
                >
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
                    <SplittingText
                      text={dict.header?.title}
                      type="words"
                      inView={true}
                      motionVariants={{
                        initial: { opacity: 0, x: 100 },
                        animate: { opacity: 1, x: 0 },
                        transition: { duration: 0.6 },
                        stagger: 0.1,
                      }}
                    />
                  </h1>
                  <p className="text-xl md:text-2xl font-light text-zinc-400 italic font-serif leading-relaxed">
                    {dict.header?.subtitle}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="relative"
                >
                  <div className="absolute -left-4 top-0 w-1 h-full bg-linear-to-b from-blue-500/50 to-transparent rounded-full" />
                  <div className="pl-8 text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl space-y-4">
                    <Quote className="w-8 h-8 text-blue-500/20 mb-2" />
                    <p className="font-light">{dict.header?.description}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10"
                >
                  <div className="group">
                    <div className="p-4 rounded-2xl bg-linear-to-br from-blue-500/5 to-transparent border border-white/5 group-hover:border-blue-500/20 transition-all duration-300">
                      <BookOpen className="w-5 h-5 text-blue-400 mb-3" />
                      <span className="block text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                        {blogs.length}
                      </span>
                      <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                        {dict.header?.articlesLabel}
                      </span>
                    </div>
                  </div>

                  <div className="group">
                    <div className="p-4 rounded-2xl bg-linear-to-br from-purple-500/5 to-transparent border border-white/5 group-hover:border-purple-500/20 transition-all duration-300">
                      <TrendingUp className="w-5 h-5 text-purple-400 mb-3" />
                      <span className="block text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                        {(blogs.length * 1.4).toFixed(1)}k
                      </span>
                      <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                        {dict.header?.viewsLabel}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-3">
                    <a
                      href="#"
                      className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group flex items-center justify-center"
                    >
                      <Linkedin className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    </a>

                    <a
                      href="#"
                      className="w-12 h-12 rounded-2xl bg-linear-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10 hover:border-white/20 transition-all duration-300 group flex items-center justify-center"
                    >
                      <Github className="w-5 h-5 text-zinc-300 group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Filtre --- */}
        <section
          className={cn(
            "md:sticky top-15 md:top-17 z-50 transition-all duration-500 ease-in-out",
            isScrolled ? "pt-2" : "pt-4 md:pt-16"
          )}
        >
          <div className="mx-auto max-w-5xl px-4 md:px-16">
            <motion.div
              layout
              className={cn(
                "w-full border border-white/[0.08] bg-black/80 backdrop-blur-2xl shadow-2xl shadow-black/50 transition-all duration-500",
                isScrolled
                  ? "rounded-xl md:rounded-2xl"
                  : "rounded-2xl md:rounded-3xl"
              )}
            >
              <div
                className={cn(
                  "flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 px-3 md:px-4 transition-all duration-500",
                  isScrolled ? "py-2 md:py-3" : "py-3 md:py-4"
                )}
              >
                {/* TAB GROUP */}
                <div className="relative flex w-full md:w-auto p-1 bg-zinc-950/40 border border-white/[0.05] rounded-xl md:rounded-2xl">
                  {(["all", "popular", "recent"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "relative flex-1 md:flex-none px-4 md:px-9 rounded-lg md:rounded-xl text-[8px] md:text-[11px] font-bold tracking-[0.12em] md:tracking-[0.15em] uppercase transition-all duration-500",
                        isScrolled ? "py-2 md:py-2.5" : "py-2.5 md:py-3",
                        activeTab === tab
                          ? "text-black"
                          : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {activeTab === tab && (
                        <motion.span
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                          style={{ borderRadius: "inherit" }}
                          transition={{
                            type: "spring",
                            bounce: 0.15,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <span className="relative z-10 whitespace-nowrap">
                        {dict.tabs?.[tab]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* SEARCH */}
                <div className="relative w-full md:w-72 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl md:rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-all duration-700" />

                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                      <div className="w-[1px] h-3 bg-white/10 group-focus-within:bg-blue-400/30 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder={dict.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={cn(
                        "w-full pl-11 pr-4 bg-zinc-900/30 border border-white/5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] tracking-widest text-white focus:outline-none focus:border-white/10 focus:bg-zinc-900/60 transition-all placeholder:text-zinc-700 uppercase font-medium",
                        isScrolled ? "py-2 md:py-2.5" : "py-2.5 md:py-3.5"
                      )}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- BLOG GRID --- */}
        <section className="max-w-8xl mx-auto py-8 md:py-25 pb-32 px-4 md:px-20 ">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group/card"
                  >
                    <div className="relative bg-linear-to-br from-zinc-900/60 to-zinc-950/60 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-700 backdrop-blur-xl shadow-2xl shadow-black/50">
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover/card:from-blue-500/5 group-hover/card:to-purple-500/5 transition-all duration-700" />

                      <div className="w-full relative aspect-[5/4] overflow-hidden">
                        <a href={`/${locale}/blog/${blog.id}`}>
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-all duration-1000 group-hover/card:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-bold uppercase tracking-wider text-blue-400 shadow-lg">
                              #{index + 1}
                            </span>
                          </div>

                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full">
                              <Calendar className="w-3 h-3 text-zinc-400" />
                              <span className="text-[9px] font-bold text-zinc-400">
                                {new Date(blog.createdAt).getFullYear()}
                              </span>
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover/card:text-transparent group-hover/card:bg-linear-to-r group-hover/card:from-blue-400 group-hover/card:to-purple-400 group-hover/card:bg-clip-text transition-all duration-500 line-clamp-2">
                              {getLocalizedText(blog, "title")}
                            </h3>
                            <div className="flex items-center gap-4 text-zinc-400 font-bold uppercase text-[9px] tracking-wider">
                              <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full backdrop-blur-sm">
                                <Clock className="w-3 h-3" /> 5 {dict.minRead}
                              </span>
                              <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full backdrop-blur-sm">
                                <TrendingUp className="w-3 h-3" /> Popular
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>

                      <div className="relative p-6 pt-5 space-y-4">
                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light line-clamp-2 italic">
                          <span className="text-blue-400/50">"</span>
                          {getLocalizedText(blog, "summary")}
                          <span className="text-blue-400/50">"</span>
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <a
                            href={`/${locale}/blog/${blog.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white hover:border-blue-500/30 hover:bg-blue-500/20 transition-all duration-300 group/btn"
                          >
                            {dict.readMore}
                            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 duration-300" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* --- CTA --- */}
        <section className="max-w-6xl mx-auto pt-16 px-4 md:px-6 mb-20 md:mb-32">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center rounded-[3rem] md:rounded-[5rem] bg-linear-to-br from-blue-600/40 via-purple-600/20 to-blue-600/30 border border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl "
          >
            <div className="absolute inset-0 bg-[radial-linear(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]" />

            <div className="relative z-10 space-y-8 md:space-y-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                  <span className="bg-linear-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    {dict.cta?.title}
                  </span>
                  <span className="text-blue-400"> ?</span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-zinc-400 text-base md:text-xl font-light max-w-3xl mx-auto leading-relaxed"
              >
                {dict.cta?.text}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-3 px-10 md:px-12 py-5 md:py-6 bg-linear-to-r from-white to-zinc-100 text-black rounded-full font-bold text-[11px] uppercase tracking-wider hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 group shadow-2xl"
                >
                  {dict.cta?.button}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
