"use client";

import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import { FireworksBackground } from "@/components/ui/shadcn-io/fireworks-background";
import TypingText from "@/components/ui/shadcn-io/typing-text";
import { PixelImage } from "@/components/ui/shadcn-io/pixel-image";
import { SparklesCore } from "@/components/ui/shadcn-io/sparkles";
import Link from "next/link";
import { easeOut, motion } from "framer-motion";

interface Props {
  dict: any;
}

interface Company {
  src: string;
  alt: string;
}

interface Achievement {
  label: string;
  value: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, duration: 0.6 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function AboutClient({ dict }: Props) {
  const defaultCompanies: Company[] = [
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
      alt: "Arc",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
      alt: "Descript",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
      alt: "Mercury",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
      alt: "Ramp",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
      alt: "Retool",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
      alt: "Watershed",
    },
  ];

  const defaultAchievements: Achievement[] = [
    { label: dict.achievement_1_label, value: dict.achievement_1_value },
    { label: dict.achievement_2_label, value: dict.achievement_2_value },
    { label: dict.achievement_3_label, value: dict.achievement_3_value },
    { label: dict.achievement_4_label, value: dict.achievement_4_value },
  ];

  return (
    <motion.section
      className="py-8 md:py-16 px-4 md:px-10 bg-gradient-to-b from-gray-200  to-gray-200 dark:from-black dark:to-slate-950 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mx-auto">
        {/* Başlık ve açıklama */}
        <div className="mb-2 md:mb-4 grid gap-5 text-center md:grid-cols-2 md:text-left px-2 md:px-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold tracking-tight text-gray-900 dark:text-white">
            <TypingText text={dict.typingTitle} cursorClassName="h-8 sm:h-9" />
          </h1>

          <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-0 mt-1 md:not-first:mt-4 text-gray-700 dark:text-white">
            {dict.lead}
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          {/* Sol Görsel Alanı */}
          <div className="lg:col-span-2">
            <div className="relative flex-1 rounded-xl overflow-hidden">
              <SparklesCore
                id="tsparticlesfullpage0"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="absolute inset-0 w-full h-full"
                particleColor="#FFFFFF"
                speed={1}
              />
              <div className="relative z-10 flex flex-col justify-between h-full overflow-hidden p-0 md:p-4 space-y-4">
                {/* 1. ve 2. Paragrafı içeren Ana Kod Bloğu */}
                <pre className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-2xl font-mono overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">
                  <code>
                    {/* Paragraf 1 */}
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;section id=
                    </span>
                    <span className="text-yellow-600 dark:text-yellow-400">
                      "giris"
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      &gt;
                    </span>
                    {"\n  "}
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;h2&gt;
                    </span>
                    <span className="text-yellow-700 dark:text-yellow-300 font-bold">
                      {dict.paragraph1_title}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;/h2&gt;
                    </span>
                    {"\n  "}
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;p&gt;
                    </span>
                    {"\n    "}
                    {dict.paragraph1_text}
                    {"\n  "}
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;/p&gt;
                    </span>
                    {"\n\n"}

                    {/* Misyon Paragrafı */}
                    {"\n  "}
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;h3 class=
                    </span>
                    <span className="text-yellow-600 dark:text-yellow-400">
                      "mission-focus"
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      &gt;
                    </span>
                    <span className="text-yellow-700 dark:text-yellow-300 font-bold">
                      {dict.mission_title}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;/h3&gt;
                    </span>
                    {"\n  "}
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;p&gt;
                    </span>
                    {"\n    "}
                    {dict.mission_text}
                    {"\n  "}
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;/p&gt;
                    </span>
                    {"\n"}
                    <span className="text-blue-600 dark:text-blue-400">
                      &lt;/section&gt;
                    </span>
                  </code>
                </pre>

                <motion.div
                  variants={{}}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Vizyon Paragrafı (Küçük Kutucuk) */}
                  <div className="flex flex-col justify-center p-0 md:p-4 rounded-2xl shadow bg-white dark:bg-gray-900">
                    <pre className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-2xl font-mono overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">
                      <code>
                        <span className="text-blue-600 dark:text-blue-400">
                          &lt;div id=
                        </span>
                        <span className="text-yellow-600 dark:text-yellow-400">
                          "vizyon"
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                          &gt;
                        </span>
                        {"\n  "}
                        <span className="text-blue-600 dark:text-blue-400">
                          &lt;h4&gt;
                        </span>
                        <span className="text-yellow-700 dark:text-yellow-300 font-bold">
                          {dict.vision_title}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                          &lt;/h4&gt;
                        </span>
                        {"\n  "}
                        <span className="text-blue-600 dark:text-blue-400">
                          &lt;p&gt;
                        </span>
                        {"\n    "}
                        {dict.vision_text}
                        <span className="ml-1 animate-blink text-green-600 dark:text-green-400">
                          _
                        </span>
                        {"\n  "}
                        <span className="text-blue-600 dark:text-blue-400">
                          &lt;/p&gt;
                        </span>
                        {"\n"}
                        <span className="text-blue-600 dark:text-blue-400">
                          &lt;/div&gt;
                        </span>
                      </code>
                    </pre>

                    <style jsx>{`
                      .animate-blink {
                        display: inline-block;
                        width: 1ch;
                        animation: blink 2s infinite;
                      }
                      @keyframes blink {
                        0%,
                        50%,
                        100% {
                          opacity: 1;
                        }
                        25%,
                        75% {
                          opacity: 0;
                        }
                      }
                    `}</style>
                  </div>

                  {/* Görsel Kutusu */}
                  <div className="w-full sm:w-auto h-96 sm:h-72 md:h-full rounded-2xl overflow-hidden flex items-center justify-center">
                    <PixelImage src="/logo/logo.webp" grid="4x6" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Sağ İçerik */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <div className="relative rounded-xl overflow-hidden p-0.5 md:p-4">
              <SparklesCore
                id="tsparticlesfullpage1"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="absolute inset-0 w-full h-full"
                particleColor="#FFFFFF"
                speed={1}
              />
              <div className="relative z-10 flex flex-col gap-4 text-gray-900 dark:text-white">
                <Link href="/">
                  <GradientText
                    className="text-2xl font-bold font-mono"
                    text={dict.title}
                  />
                </Link>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                  {dict.projects_heading}
                </h2>
                <p className="leading-7 text-sm sm:text-base">
                  {dict.projects_description}
                </p>
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight mt-6">
                  {dict.logo_title}
                </h3>
                <p className="mt-2 text-sm sm:text-base">
                  {dict.logo_paragraph1}
                </p>
                <p className="mt-2 text-sm sm:text-base">
                  {dict.logo_paragraph2}
                </p>
                <blockquote className="mt-4 border-l-2 pl-4 italic text-sm sm:text-base">
                  "{dict.quote}"
                </blockquote>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Başarılarımız */}
        <div className="mt-16 rounded-xl relative overflow-hidden py-8 px-4 md:p-16 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
          <FireworksBackground
            className="absolute inset-0 w-full h-full"
            population={0.1}
          />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-semibold">
              {dict.achievement_heading}
            </h2>
            <p className="max-w-xl mx-auto md:mx-0 text-sm sm:text-base">
              {dict.achievement_sub}
            </p>
            <div className="mt-10 flex flex-wrap justify-center md:justify-between gap-6 md:gap-10">
              {defaultAchievements.map((a, i) => (
                <div key={i} className="flex flex-col gap-2 md:gap-4">
                  <p className="text-sm sm:text-base">{a.label}</p>
                  <span className="text-2xl sm:text-4xl md:text-5xl font-semibold">
                    {a.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
