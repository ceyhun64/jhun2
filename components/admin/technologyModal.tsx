// TechnologyModal.tsx
"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TechnologyItem, Technology } from "@/components/projects/technologyItem";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-8xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xs shadow-lg p-6 md:p-12"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full font-semibold z-20"
        >
          Kapat
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col space-y-4">
            <h2 className="text-5xl font-extrabold text-white font-mono">
              Kullanılan Teknolojiler
            </h2>
            <pre className="bg-gray-900 text-white p-4 rounded-2xl font-mono overflow-x-auto whitespace-pre-wrap">
              <code>
                <span className="text-blue-400">&lt;p&gt;</span>
                {"\n  "}Bu proje modern web teknolojileriyle geliştirildi...
                <span className="text-blue-400">&lt;/p&gt;</span>
                <span className="ml-1 animate-blink">▌</span>
              </code>
            </pre>
            <style jsx>{`
              .animate-blink {
                display: inline-block;
                width: 1ch;
                animation: blink 2s infinite;
              }
            `}</style>

            <div className="flex space-x-6 mt-8">
              <a
                href={githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                <span className="font-medium">Open Github</span>
              </a>
            </div>
          </div>

          <div className="space-y-4 mt-10">
            {technologies.map((tech) => (
              <TechnologyItem key={tech.name} tech={tech} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
