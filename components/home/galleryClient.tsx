// components/home/galleryClient.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { RollingText } from "../ui/shadcn-io/rolling-text";
import { CardContainer, CardBody, CardItem } from "../ui/shadcn-io/3d-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

// --- Arayüz Tanımları ---
interface GalleryItem {
  id: string;
  title: string;
  titleEng?: string;
  summary: string;
  summaryEng?: string;
  description: string;
  descriptionEng?: string;
  url: string;
  image: string;
}

interface GalleryClientProps {
  locale: "tr" | "en";
  dict: {
    title: string;
    description: string;
    view: string;
    visitSite: string;
    exploreProjects: string;
    fetchError: string;
  };
}

// 🧩 SkeletonCard
const SkeletonCard = () => {
  return (
    <CardContainer
      className="inter-var"
      containerClassName="py-6 scale-85 sm:scale-95 md:scale-100 transition-transform duration-300"
    >
      <CardBody className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-zinc-950/10 dark:to-zinc-900 border border-gray-300 dark:border-zinc-800/70 rounded-2xl p-3 text-left transition-colors duration-300">
        {/* Görsel Alanı */}
        <CardItem translateZ="140" className="w-full">
          <Skeleton className="relative aspect-video overflow-hidden rounded-xl bg-gray-300 dark:bg-zinc-800" />
        </CardItem>

        {/* Başlık */}
        <CardItem
          translateZ="120"
          className="mt-5 text-lg sm:text-xl font-semibold text-left"
        >
          <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-zinc-700" />
        </CardItem>

        {/* Açıklama */}
        <CardItem
          as="div"
          translateZ="60"
          className="text-sm mt-2 line-clamp-3 text-left"
        >
          <Skeleton className="h-4 w-full bg-gray-300 dark:bg-zinc-700 mb-1" />
          <Skeleton className="h-4 w-11/12 bg-gray-300 dark:bg-zinc-700 mb-1" />
          <Skeleton className="h-4 w-10/12 bg-gray-300 dark:bg-zinc-700" />
        </CardItem>

        {/* Butonlar */}
        <div className="mt-2 flex justify-between items-center">
          <CardItem translateZ={60} as="span">
            <Skeleton className="h-5 w-24 rounded-full bg-gray-300 dark:bg-zinc-700" />
          </CardItem>

          <CardItem translateZ={40} as="div">
            <Skeleton className="h-10 w-32 rounded-full bg-gray-300 dark:bg-zinc-700" />
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

// 💻 Ana Bileşen: GalleryClient
const GalleryClient: React.FC<GalleryClientProps> = ({ dict, locale }) => {
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // fetch data
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setItems(data.projects || []);
      } catch (error) {
        console.error("Projects fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // carousel scroll control
  useEffect(() => {
    if (!carouselApi) return;

    const updateScrollStatus = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateScrollStatus();

    carouselApi.on("select", updateScrollStatus);
    carouselApi.on("reInit", updateScrollStatus);

    return () => {
      carouselApi.off("select", updateScrollStatus);
      carouselApi.off("reInit", updateScrollStatus);
    };
  }, [carouselApi, items.length]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Carousel
          opts={{
            loop: false,
            align: isMobile ? "center" : "start",
            skipSnaps: false,
            dragFree: false,
            breakpoints: {
              "(max-width: 768px)": {
                align: "center",
                dragFree: false,
              },
            },
          }}
        >
          <CarouselContent className="flex md:gap-0 px-4 sm:px-6 md:px-16">
            {[...Array(5)].map((_, index) => (
              <CarouselItem
                key={`skeleton-${index}`}
                className="w-full md:max-w-[400px]"
              >
                <SkeletonCard />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center text-gray-600 dark:text-gray-500 py-10 transition-colors duration-300">
          {dict.fetchError}
        </div>
      );
    }

    return (
      <Carousel
        setApi={setCarouselApi}
        opts={{
          loop: false,
          align: isMobile ? "center" : "start",
          skipSnaps: false,
          dragFree: false,
          breakpoints: {
            "(max-width: 768px)": {
              align: "center",
              dragFree: false,
            },
          },
        }}
      >
        <CarouselContent className="flex md:gap-0 px-4 sm:px-6 md:px-16">
          {items.map((item) => {
            const displayTitle =
              locale === "en" && item.titleEng ? item.titleEng : item.title;
            const displaySummary =
              locale === "en" && item.summaryEng
                ? item.summaryEng
                : item.summary;

            return (
              <CarouselItem
                key={item.id}
                className="w-full md:max-w-[400px] cursor-pointer"
              >
                {isMobile ? (
                  // Mobil kart
                  <div className="bg-gray-100 dark:bg-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-2xl p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 text-left mt-6">
                    <div className="relative aspect-video overflow-hidden rounded-xl">
                      <Link href={`/projects/${item.id}`}>
                        <Image
                          src={item.image}
                          alt={displayTitle}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </Link>
                    </div>
                    <div className="p-1.5">
                      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        {displayTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 transition-colors duration-300">
                        {displaySummary}
                      </p>

                      <div className="mt-4 flex justify-between items-center">
                        <Link
                          href={`/projects/${item.id}`}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-300"
                        >
                          <Eye className="w-4 h-4" /> {dict.view}
                        </Link>
                        <Button
                          onClick={() => window.open(item.url, "_blank")}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-4 py-2 rounded-full font-semibold"
                        >
                          {dict.visitSite} <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Masaüstü 3D Card
                  <CardContainer
                    className="inter-var"
                    containerClassName="py-6 scale-85 sm:scale-95 md:scale-100 transition-transform duration-300"
                  >
                    <CardBody className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-zinc-950/10 dark:to-zinc-900 border border-gray-300 dark:border-zinc-800/70 rounded-2xl p-3 group/card hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:z-10 text-left">
                      <CardItem translateZ="140" className="w-full">
                        <div className="relative aspect-video overflow-hidden rounded-xl cursor-pointer">
                          <Link href={`/projects/${item.id}`}>
                            <Image
                              src={item.image}
                              alt={displayTitle}
                              fill
                              className="object-cover object-center transition-transform duration-500 group-hover/card:brightness-110"
                            />
                          </Link>
                          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-orange-500/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                        </div>
                      </CardItem>

                      <CardItem
                        translateZ="120"
                        className="mt-5 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors text-left"
                      >
                        {displayTitle}
                      </CardItem>

                      <CardItem
                        as="p"
                        translateZ="60"
                        className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 text-left transition-colors duration-300"
                      >
                        {displaySummary}
                      </CardItem>

                      <div className="mt-5 flex justify-between items-center">
                        <CardItem translateZ={60} as="span">
                          <Link
                            href={`/${locale}/projects/${item.id}`}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-300"
                          >
                            <Eye className="w-4 h-4" /> {dict.view}
                          </Link>
                        </CardItem>

                        <CardItem translateZ={40} as="div">
                          <Button
                            onClick={() => window.open(item.url, "_blank")}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all"
                          >
                            {dict.visitSite} <ArrowRight className="w-4 h-4" />
                          </Button>
                        </CardItem>
                      </div>

                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-orange-500/20 to-blue-500/20 opacity-0 group-hover/card:opacity-100 blur-[25px] transition-opacity duration-700"></div>
                    </CardBody>
                  </CardContainer>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    );
  };

  return (
    <section className="py-16 md:py-28 bg-gradient-to-t from-[#F5F7FA] to-[#F5F7FA] dark:from-black dark:to-slate-950 relative font-sans overflow-hidden transition-colors duration-500">
      {/* Title */}
      <div className="container mx-auto mb-1 md:mb-10 text-center md:text-left md:px-16">
        <RollingText
          className="inline-block relative w-full text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-gray-900 dark:text-white mb-1 transition-colors duration-300"
          text={dict.title}
        />
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-sm md:text-md lg:text-lg mt-2 transition-colors duration-300">
          {dict.description}
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full overflow-x-hidden mt-0 md:mt-10 font-mono">
        {renderContent()}
      </div>

      {/* Navigation Buttons */}
      {!isLoading && items.length > 0 && (
        <>
          {/* Mobil Navigasyon */}
          <div className="flex md:hidden mt-6 justify-between items-center w-full gap-3 px-4 sm:px-6 md:px-16">
            <div className="flex gap-2">
              <Button
                size="icon"
                aria-label="Önceki slayt"
                onClick={() => carouselApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="bg-gray-300 dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-zinc-700 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
              </Button>
              <Button
                size="icon"
                aria-label="Sonraki slayt"
                onClick={() => carouselApi?.scrollNext()}
                disabled={!canScrollNext}
                className="bg-gray-300 dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-zinc-700 transition-colors duration-300"
              >
                <ArrowRight className="w-5 h-5 text-gray-900 dark:text-white" />
              </Button>
            </div>

            <Link href={`/${locale}/projects`}>
              <Button className="flex items-center text-white gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-all duration-300">
                {dict.exploreProjects}
              </Button>
            </Link>
          </div>

          {/* Masaüstü Navigasyon */}
          <div className="hidden md:flex flex-row gap-4 mt-10 justify-between items-center px-4 sm:px-6 md:px-16">
            <div className="flex gap-3">
              <Button
                size="icon"
                aria-label="Önceki slayt"
                onClick={() => carouselApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="bg-gray-300 dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-zinc-700 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
              </Button>
              <Button
                size="icon"
                aria-label="Sonraki slayt"
                onClick={() => carouselApi?.scrollNext()}
                disabled={!canScrollNext}
                className="bg-gray-300 dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-zinc-700 transition-colors duration-300"
              >
                <ArrowRight className="w-5 h-5 text-gray-900 dark:text-white" />
              </Button>
            </div>

            <Link href={`/${locale}/projects`}>
              <Button className="flex items-center text-white gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-all duration-300">
                {dict.exploreProjects} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default GalleryClient;
