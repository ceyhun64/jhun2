"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  ArrowRight,
  Calendar,
  Clock,
  TrendingUp,
  Search,
  Filter,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/shadcn-io/3d-card";
import { FlickeringGrid } from "../ui/shadcn-io/flickering-grid";
import { Skeleton } from "../ui/skeleton";

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
  <div className="w-full">
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-48 bg-zinc-800" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 rounded bg-zinc-800 mb-3" />
        <Skeleton className="h-4 w-full rounded bg-zinc-800 mb-2" />
        <Skeleton className="h-4 w-5/6 rounded bg-zinc-800 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24 rounded-full bg-zinc-700" />
          <Skeleton className="h-5 w-20 rounded-full bg-zinc-700" />
        </div>
      </div>
    </div>
  </div>
);

export default function BlogsClient({ dict, locale }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "recent">(
    "all"
  );
  const isMobile = useIsMobile();

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog", { cache: "no-store" });
      if (!res.ok) throw new Error(dict.error || "Error fetching blogs");
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
      setError(dict.error || "Error loading blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getLocalizedText = (blog: Blog, field: "title" | "summary") => {
    if (locale === "en") {
      return field === "title"
        ? blog.titleEng || blog.title
        : blog.summaryEng || blog.summary;
    }
    return blog[field];
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = getLocalizedText(blog, "title")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const allTags = [
    "React",
    "TypeScript",
    "Next.js",
    "Web Development",
    "AI",
    "Performance",
  ];

  const renderHeaderSkeletons = () => (
    <div className="relative w-full z-10">
      <Skeleton className="w-full h-48 md:h-64 rounded-3xl bg-zinc-800 mb-8" />
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="flex gap-6">
          <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-800" />
          <div className="flex-1">
            <Skeleton className="h-10 w-64 rounded bg-zinc-800 mb-3" />
            <Skeleton className="h-4 w-96 rounded bg-zinc-700 mb-2" />
            <Skeleton className="h-4 w-80 rounded bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white pt-10 pb-20 relative overflow-hidden">
      <FlickeringGrid
        className="absolute inset-0 z-0 opacity-30"
        squareSize={20}
        gridGap={5}
        color="#3b82f6"
        maxOpacity={0.1}
        flickerChance={0.1}
      />

      {loading ? (
        renderHeaderSkeletons()
      ) : (
        <div className="relative w-full z-10 mb-16">
          {/* Hero Banner */}
          <div className="relative w-full h-56 md:h-72 overflow-hidden">
            <Image
              src="/blog/banner.avif"
              alt="Blog Header"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />

            {/* Floating stats */}
            <div className="absolute bottom-8 right-8 flex gap-4">
              {[
                {
                  icon: "📚",
                  value: blogs.length,
                  label: dict.header?.articlesLabel || "Articles",
                },
                {
                  icon: "👁️",
                  value: `${(blogs.length * 1.2).toFixed(1)}K`,
                  label: dict.header?.viewsLabel || "Views",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10"
                >
                  <div className="text-2xl font-bold">
                    {stat.icon} {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Profile Section */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-48 relative z-20">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-black bg-zinc-900 overflow-hidden shadow-2xl ">
                  <Image
                    src="/avatar/avatar.jpg"
                    alt="Profile"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-black">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text">
                    {dict.header?.title || "Tech Blog"}
                  </h1>

                  <p className="text-gray-400 text-sm md:text-base mb-3">
                    {dict.header?.subtitle ||
                      "Insights on modern web development"}
                  </p>

                  <p className="text-gray-300 text-sm md:text-base max-w-3xl leading-relaxed mb-4">
                    {dict.header?.description ||
                      "Sharing knowledge about React, TypeScript, and modern web technologies. Making complex topics accessible and helping developers level up their skills."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {dict.header?.joined || "Joined"}{" "}
                      {new Date().getFullYear()}
                    </span>
                    <span className="flex items-center gap-1">
                      🌐 {locale === "tr" ? "Türkçe" : "English"}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      {dict.header?.activeLabel || "Active writer"}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedTag === tag
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-zinc-800/50 hover:bg-zinc-700/50 text-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>

            {/* Search & Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={dict.searchPlaceholder || "Search articles..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-1 mt-8 border-b border-zinc-800 overflow-x-auto"
            >
              {(["all", "popular", "recent"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300 relative ${
                    activeTab === tab
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {dict.tabs?.[tab] ||
                    tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-red-400 text-lg">{error}</div>
          </div>
        )}

        {!loading && !error && filteredBlogs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <div className="text-gray-400 text-lg">
              {searchTerm
                ? dict.noResults || "No articles found"
                : dict.empty || "No articles yet"}
            </div>
          </div>
        )}

        {!loading && filteredBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          >
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                {isMobile ? (
                  <Link href={`/${locale}/blog/${blog.id}`}>
                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={blog.image}
                          alt={getLocalizedText(blog, "title")}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {getLocalizedText(blog, "title")}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                          {getLocalizedText(blog, "summary")}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(blog.createdAt).toLocaleDateString(
                              locale === "tr" ? "tr-TR" : "en-US"
                            )}
                          </span>
                          <span className="flex items-center gap-1 text-blue-400">
                            <Eye className="w-3 h-3" />
                            {dict.readMore || "Read more"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <CardContainer className="h-full">
                    <CardBody className="relative bg-zinc-950/50 border border-zinc-800/70 rounded-2xl overflow-hidden group/card hover:border-blue-500/50 transition-all duration-500 h-full flex flex-col">
                      <CardItem translateZ="100" className="w-full">
                        <Link href={`/${locale}/blog/${blog.id}`}>
                          <div className="relative h-48 overflow-hidden cursor-pointer">
                            <Image
                              src={blog.image}
                              alt={getLocalizedText(blog, "title")}
                              fill
                              className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          </div>
                        </Link>
                      </CardItem>

                      <div className="p-5 flex-1 flex flex-col">
                        <CardItem translateZ="80" className="flex-1">
                          <Link href={`/${locale}/blog/${blog.id}`}>
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover/card:text-blue-400 transition-colors cursor-pointer">
                              {getLocalizedText(blog, "title")}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-400 line-clamp-3">
                            {getLocalizedText(blog, "summary")}
                          </p>
                        </CardItem>

                        <CardItem
                          translateZ="60"
                          className="mt-4 flex justify-between items-center text-xs text-gray-500"
                        >
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(blog.createdAt).toLocaleDateString(
                              locale === "tr" ? "tr-TR" : "en-US"
                            )}
                          </span>
                          <Link
                            href={`/${locale}/blog/${blog.id}`}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            {dict.readMore || "Read more"}
                          </Link>
                        </CardItem>
                      </div>
                    </CardBody>
                  </CardContainer>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-32 text-center relative z-10"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative px-8 md:px-12 py-12 rounded-3xl bg-gradient-to-br from-blue-950/30 via-zinc-900/50 to-zinc-950/30 border border-blue-900/30 backdrop-blur-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent mb-4">
                {dict.cta?.title || "Want to work together?"}
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
                {dict.cta?.text ||
                  "Let's create something amazing. Get in touch to start your project."}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                {dict.cta?.button || "Get in Touch"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
