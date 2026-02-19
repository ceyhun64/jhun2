"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Loader2, Calendar, Clock } from "lucide-react";
import { useEffect } from "react";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  blog: {
    title: string;
    titleEng: string | null;
    summary: string;
    summaryEng: string | null;
    description: string;
    descriptionEng: string | null;
    image: string;
    url: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export default function BlogModal({
  isOpen,
  onClose,
  blog,
  loading = false,
}: BlogModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-w-3xl w-full max-h-[88vh] overflow-y-auto rounded-2xl bg-[#0e0e14] border border-white/8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/5 hover:bg-red-600/80 border border-white/8 text-white rounded-xl flex items-center justify-center transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {loading || !blog ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                  <p className="text-zinc-600 text-sm">Yükleniyor…</p>
                </div>
              </div>
            ) : (
              <div>
                {/* Hero image */}
                <div className="relative w-full h-56 overflow-hidden rounded-t-2xl">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-transparent" />
                </div>

                <div className="p-7 space-y-5">
                  {/* Title */}
                  <div>
                    <h1 className="text-2xl font-bold text-white leading-tight">
                      {blog.title}
                    </h1>
                    {blog.titleEng && (
                      <p className="text-base text-zinc-500 font-light mt-1">
                        {blog.titleEng}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                        <span className="text-xs text-zinc-600">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "tr-TR",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-700" />
                        <span className="text-xs text-zinc-600">
                          /{blog.url}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/5" />

                  {/* Summary */}
                  <div className="bg-white/[0.025] border border-white/5 rounded-xl p-4 space-y-2">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {blog.summary}
                    </p>
                    {blog.summaryEng && (
                      <p className="text-sm text-zinc-500 leading-relaxed italic">
                        {blog.summaryEng}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {blog.description && (
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                        İçerik
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                        {blog.description}
                      </p>
                    </div>
                  )}
                  {blog.descriptionEng && (
                    <div className="pt-4 border-t border-white/5">
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                        Content
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                        {blog.descriptionEng}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
