"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/shadcn-io/3d-card";
import { FlickeringGrid } from "../ui/shadcn-io/flickering-grid";
import { GradientText } from "../ui/shadcn-io/gradient-text";
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
    <div className="min-h-screen bg-linear-to-b from-black via-amber-900 to-black text-white py-20 px-10 relative overflow-hidden">
      {/* Neon blur arka plan */}
      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={20}
        gridGap={5}
        color="#6D6A75"
        maxOpacity={0.1}
        flickerChance={0.1}
      />

      <div className="relative w-full flex flex-col justify-center items-center text-center z-10 mt-5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-9xl font-extrabold mb-2 z-10 font-mono"
        >
          <TextReveal
            text={dict.title_main}
            revealText={dict.title_reveal} // ✅ düzeltildi
            className="h-20"
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 w-full max-w-2xl mx-auto mb-6 text-md z-10 font-mono"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {projects.map((proj, index) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardContainer className="inter-var" containerClassName="py-6">
                <CardBody className="relative bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800/70 rounded-2xl p-4 group/card hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:z-10 text-left">
                  {/* Görsel */}
                  <CardItem translateZ="140" className="w-full">
                    <div className="relative aspect-video overflow-hidden rounded-xl cursor-pointer">
                      <Link
                        href={`/projects/${proj.id}`}
                        className="block w-full h-full"
                      >
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

                  {/* Başlık */}
                  <CardItem
                    translateZ="120"
                    className="mt-5 text-lg sm:text-xl font-semibold text-white group-hover/card:text-blue-400 transition-colors text-left"
                  >
                    {proj.title}
                  </CardItem>

                  {/* Açıklama */}
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-sm text-gray-400 mt-2 line-clamp-3 text-left"
                  >
                    {proj.summary}
                  </CardItem>

                  {/* Alt kısım */}
                  <div className="mt-5 flex justify-between items-center">
                    <CardItem
                      translateZ={60}
                      as="span"
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-semibold group-hover/card:translate-x-1 transition-transform cursor-pointer text-left"
                    >
                      <Link
                        href={`/${locale}/projects/${proj.id}`} // <-- locale eklendi
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
                        {dict.visit_site}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardItem>
                  </div>

                  {/* Glow efekti */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-orange-500/20 to-blue-500/20 opacity-0 group-hover/card:opacity-100 blur-[25px] transition-opacity duration-700"></div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Bölümü */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-32 mb-20 text-center relative z-10"
      >
        <div className="relative inline-block px-12 py-10 rounded-3xl bg-gradient-to-br from-[#0a0f1f] via-[#101a3b] to-[#1e2b4b] border border-indigo-900/30 shadow-[0_0_50px_rgba(24,39,94,0.5)] hover:shadow-[0_0_80px_rgba(60,90,180,0.7)] transition-all duration-700 backdrop-blur-md">
          <h2 className="text-4xl md:text-5xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-blue-100 drop-shadow-[0_0_15px_rgba(90,160,255,0.3)]">
            {dict.cta_title}
          </h2>
          <p className="text-slate-300 text-lg mt-4 font-mono leading-relaxed">
            {dict.cta_text}
          </p>

          <button
            onClick={() => (window.location.href = `/${locale}/contact`)}
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1e3a8a] via-[#243f91] to-[#3b82f6] rounded-full text-white font-semibold text-lg shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:scale-105 hover:shadow-[0_0_35px_rgba(56,189,248,0.9)] transition-all duration-300"
          >
            {dict.cta_button} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className="w-[500px] h-[500px] bg-gradient-to-br from-[#0b1120] via-[#142040] to-[#1e3a8a] opacity-30 blur-[100px] rounded-full animate-pulse-slow"></div>
        </div>
      </motion.div>
    </div>
  );
}
