"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Loader2, Calendar } from "lucide-react";
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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 rounded-2xl border border-blue-500/20 bg-neutral-900/95 backdrop-blur-md shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors shadow-lg"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            {loading || !blog ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <p className="text-gray-400">Blog detayı yükleniyor...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {/* Başlık ve Tarih */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    {blog.title}
                  </h1>
                  {blog.titleEng && (
                    <p className="text-xl text-gray-400 font-light">
                      {blog.titleEng}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </motion.div>

                {/* Ana Görsel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={1200}
                    height={600}
                    className="object-cover object-center w-full h-auto rounded-xl"
                  />
                </motion.div>

                {/* Özet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3 p-6 bg-white/5 rounded-xl border border-white/10"
                >
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {blog.summary}
                  </p>
                  {blog.summaryEng && (
                    <p className="text-gray-300 text-base leading-relaxed italic">
                      {blog.summaryEng}
                    </p>
                  )}
                </motion.div>

                {/* Açıklama */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  {blog.description && (
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-white">
                        İçerik
                      </h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {blog.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {blog.descriptionEng && (
                    <div className="space-y-3 pt-6 border-t border-white/10">
                      <h3 className="text-2xl font-semibold text-white">
                        Content
                      </h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {blog.descriptionEng}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* URL Bilgisi */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-6 border-t border-white/10"
                >
                  <p className="text-sm text-gray-400">
                    Blog URL: <span className="text-blue-400">{blog.url}</span>
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
