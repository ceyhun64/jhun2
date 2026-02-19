"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import {
  TechnologyItem,
  Technology,
} from "@/components/projects/technologyItem";
import { useEffect } from "react";

interface TechnologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  technologies: Technology[];
  githubUrl?: string;
}

export default function TechnologyModal({
  isOpen,
  onClose,
  technologies,
  githubUrl,
}: TechnologyModalProps) {
  // Body scroll kilidi
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg p-6 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapat butonu — parent relative olduğu için absolute çalışır */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
              aria-label="Kapat"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Sol: Başlık + kod bloğu + GitHub */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white font-mono">
                  Kullanılan Teknolojiler
                </h2>

                <pre className="bg-gray-900 text-white p-4 rounded-2xl font-mono overflow-x-auto whitespace-pre-wrap text-sm">
                  <code>
                    <span className="text-blue-400">&lt;p&gt;</span>
                    {"\n  "}Bu proje modern web teknolojileriyle geliştirildi...
                    {"\n"}
                    <span className="text-blue-400">&lt;/p&gt;</span>
                    {/* Blink cursor — Tailwind animate-pulse ile */}
                    <span className="ml-1 inline-block w-2 h-4 bg-white align-middle animate-pulse" />
                  </code>
                </pre>

                {githubUrl && (
                  <div className="flex space-x-6 mt-8">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors group"
                    >
                      <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                      <span className="font-medium">Open Github</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Sağ: Teknoloji listesi */}
              <div className="space-y-4 mt-10">
                {technologies.length > 0 ? (
                  technologies.map((tech) => (
                    <TechnologyItem key={tech.name} tech={tech} />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    Bu proje için teknoloji eklenmemiş.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
