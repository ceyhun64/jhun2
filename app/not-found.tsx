"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-black via-slate-950 to-black text-white px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Glowing orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* 404 Number with glitch effect */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h1 className="text-9xl md:text-[200px] font-black tracking-tighter">
            <span className="relative inline-block">
              <span className="absolute inset-0 blur-2xl bg-linear-to-r from-blue-500 to-cyan-500 opacity-50" />
              <span className="relative bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                404
              </span>
            </span>
          </h1>

          {/* Glitch lines */}
          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute top-1/3 left-0 right-0 h-1 bg-cyan-400/50 blur-sm"
          />
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Sayfa Bulunamadı
          </h2>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>
        </motion.div>

        {/* Search suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-cyan-400"
        >
          <Search className="w-5 h-5" />
          <span className="text-sm">
            URL'yi kontrol edin veya ana sayfaya dönün
          </span>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary button */}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Ana Sayfaya Dön
              </span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-cyan-600 to-blue-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>

          {/* Secondary button */}
          <Link href="/tr">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Geri Dön
            </motion.button>
          </Link>
        </motion.div>

        {/* Popular links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <p className="text-sm text-slate-500 mb-4">Popüler Sayfalar</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Projeler", href: "/tr/projects" },
              { label: "Hakkımda", href: "/tr/about" },
              { label: "İletişim", href: "/tr/contact" },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
