"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/shadcn-io/3d-card";
import { FlickeringGrid } from "../ui/shadcn-io/flickering-grid";
import { TextReveal } from "../ui/shadcn-io/text-reveal";

type Props = {
  dict: any;
  locale: "tr" | "en";
};

interface Technology {
  id: number;
  name: string;
}

interface Project {
  id: number;
  title: string;
  summary: string;
  url: string;
  image: string;
  description: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies: Technology[];
}

export default function ProjectsClient({ dict, locale }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) throw new Error(dict.error);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
      setError(dict.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-amber-900 to-black text-white py-15 md:py-20 px-4 md:px-10 relative overflow-hidden">
      {/* Neon blur arka plan */}
      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={20}
        gridGap={5}
        color="#6D6A75"
        maxOpacity={0.1}
        flickerChance={0.1}
      />

      {/* Başlık */}
      <div className="relative w-full flex flex-col justify-center items-center text-center z-10 mt-5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-9xl font-extrabold mb-0 md:mb-2 z-10 font-mono"
        >
          <TextReveal
            text={dict.title_main}
            revealText={dict.title_reveal}
            className="h-20"
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 w-full max-w-2xl mx-auto mb-6 text-sm md:text-base z-10 font-mono"
        >
          {dict.subtitle}
        </motion.p>
      </div>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto text-center relative z-10 font-mono">
        {loading && <div className="text-gray-300 mt-10">{dict.loading}</div>}
        {error && <div className="text-red-400 mt-10">{error}</div>}
        {!loading && !error && projects.length === 0 && (
          <div className="text-gray-400 mt-10">{dict.empty}</div>
        )}

        {/* ✅ GRID sistemi korunuyor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-10">
          {projects.map((proj, index) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full max-w-[400px]"
            >
              {isMobile ? (
                // ✅ Mobil: sade Tailwind kart
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 text-left">
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <Link href={`/${locale}/projects/${proj.id}`}>
                      <Image
                        src={proj.image}
                        alt={proj.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </Link>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                    {proj.summary}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      href={`/${locale}/projects/${proj.id}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      <Eye className="w-4 h-4" /> {dict.view_project}
                    </Link>
                    <Button
                      onClick={() => window.open(proj.url, "_blank")}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-4 py-2 rounded-full font-semibold"
                    >
                      {dict.visit_site} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // 💻 Masaüstü: 3D Card efekti
                <CardContainer
                  className="inter-var"
                  containerClassName="py-6 scale-95 md:scale-100 transition-transform duration-300"
                >
                  <CardBody className="relative bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800/70 rounded-2xl p-4 group/card hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:z-10 text-left">
                    <CardItem translateZ="140" className="w-full">
                      <div className="relative aspect-video overflow-hidden rounded-xl cursor-pointer">
                        <Link href={`/${locale}/projects/${proj.id}`}>
                          <Image
                            src={proj.image}
                            alt={proj.title}
                            fill
                            className="object-cover object-center transition-transform duration-500 group-hover/card:brightness-110"
                          />
                        </Link>
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-orange-500/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </CardItem>

                    <CardItem
                      translateZ="120"
                      className="mt-5 text-lg sm:text-xl font-semibold text-white group-hover/card:text-blue-400 transition-colors text-left"
                    >
                      {proj.title}
                    </CardItem>

                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-sm text-gray-400 mt-2 line-clamp-3 text-left"
                    >
                      {proj.summary}
                    </CardItem>

                    <div className="mt-5 flex justify-between items-center">
                      <CardItem translateZ={60} as="span">
                        <Link
                          href={`/${locale}/projects/${proj.id}`}
                          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-transform"
                        >
                          <Eye className="w-4 h-4" /> {dict.view_project}
                        </Link>
                      </CardItem>

                      <CardItem translateZ={40} as="div">
                        <Button
                          onClick={() => window.open(proj.url, "_blank")}
                          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all"
                        >
                          {dict.visit_site} <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardItem>
                    </div>

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-orange-500/20 to-blue-500/20 opacity-0 group-hover/card:opacity-100 blur-[25px] transition-opacity duration-700"></div>
                  </CardBody>
                </CardContainer>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-32 mb-20 text-center relative z-10"
      >
        <div className="relative inline-block px-10 py-8 rounded-3xl bg-gradient-to-br from-[#0a0f1f] via-[#101a3b] to-[#1e2b4b] border border-indigo-900/30 shadow-[0_0_50px_rgba(24,39,94,0.5)] hover:shadow-[0_0_80px_rgba(60,90,180,0.7)] transition-all duration-700 backdrop-blur-md">
          <h2 className="text-3xl md:text-5xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-blue-100 drop-shadow-[0_0_15px_rgba(90,160,255,0.3)]">
            {dict.cta_title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            {dict.cta_text}
          </p>
          <button
            onClick={() => (window.location.href = `/${locale}/contact`)}
            className="mt-6 w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 rounded-full text-black font-semibold text-lg shadow-[0_0_20px_rgba(56,189,248,0.7)] hover:scale-105 hover:shadow-[0_0_40px_rgba(56,189,248,1)] transition-all duration-300"
          >
            {dict.cta_button} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
