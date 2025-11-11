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


interface GalleryItem {
  id: string;
  title: string;
  summary: string;
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

const GalleryClient: React.FC<GalleryClientProps> = ({ dict, locale }) => {
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);

  // fetch data client-side
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setItems(data.projects || []);
      } catch (error) {
        console.error("Projects fetch error:", error);
      }
    };
    fetchProjects();
  }, []);

  // 👇 GÜNCELLENMİŞ KAYDIRMA KONTROL BLOĞU
  useEffect(() => {
    if (!carouselApi) return;

    // Kaydırma durumunu güncelleyen işlev
    const updateScrollStatus = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    // Başlangıç durumunu ve her kaydırmayı izle
    updateScrollStatus(); // İlk yüklemede durumu ayarlar

    carouselApi.on("select", updateScrollStatus);
    carouselApi.on("reInit", updateScrollStatus); // Öğeler değiştiğinde yeniden kontrol et
    // 'init' olayını Embla setApi ile otomatik hallettiği için 'select' yeterli olabilir,
    // ancak 'reInit' durumu daha güvenli hale getirir.

    return () => {
      carouselApi.off("select", updateScrollStatus);
      carouselApi.off("reInit", updateScrollStatus);
    };
  }, [carouselApi, items.length]); // items.length'i de dinleyelim ki veri geldiğinde durum güncellensin

  return (
    <section className="py-16 md:py-28 bg-linear-to-t from-black to-slate-950 relative font-sans overflow-hidden">
      {/* Neon glow background */}
    
      {/* Title */}
      <div className="container mx-auto mb-1 md:mb-10 text-center md:text-left px-4 sm:px-6 md:px-16">
        <RollingText
          className="inline-block relative w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-white bg-clip-text mb-1"
          text={dict.title}
        />
        <p className="text-gray-400 max-w-2xl text-sm md:text-md lg:text-lg mt-2">
          {dict.description}
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full overflow-x-hidden mt-10 font-mono">
        {items.length > 0 ? ( // Veri varsa karuseli göster
          <Carousel
            setApi={setCarouselApi}
            opts={{
              loop: false,
              align: "start",
              skipSnaps: false,
              breakpoints: {
                "(max-width: 768px)": { dragFree: true },
              },
            }}
          >
            <CarouselContent className="flex px-4 sm:px-6 md:px-16">
              {items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="w-full md:max-w-[400px] cursor-pointer"
                >
                  <CardContainer
                    className="inter-var"
                    containerClassName="py-6 "
                  >
                    <CardBody className="relative bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800/70 rounded-2xl p-4 group/card hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:z-10 text-left">
                      {/* Görsel */}
                      <CardItem translateZ="140" className="w-full">
                        <div className="relative aspect-video overflow-hidden rounded-xl cursor-pointer">
                          <Link
                            href={`/projects/${item.id}`}
                            className="block w-full h-full"
                          >
                            <Image
                              src={item.image}
                              alt={item.title}
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
                        {item.title}
                      </CardItem>

                      {/* Açıklama */}
                      <CardItem
                        as="p"
                        translateZ="60"
                        className="text-sm text-gray-400 mt-2 line-clamp-3 text-left"
                      >
                        {item.summary}
                      </CardItem>

                      {/* Alt kısım */}
                      <div className="mt-5 flex justify-between items-center">
                        <CardItem
                          translateZ={60}
                          as="span"
                          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-semibold group-hover/card:translate-x-1 transition-transform cursor-pointer text-left"
                        >
                          <Link
                            href={`/projects/${item.id}`}
                            className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-transform"
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

                      {/* Glow efekti */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-orange-500/20 to-blue-500/20 opacity-0 group-hover/card:opacity-100 blur-[25px] transition-opacity duration-700"></div>
                    </CardBody>
                  </CardContainer>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="text-center text-gray-500 py-10">
            {dict.fetchError}
          </div> // Hata durumunda veya yüklenirken
        )}
      </div>

      {/* Arrows & buttons */}
      <div className="flex md:hidden mt-6 justify-between items-center w-full gap-3 px-4 sm:px-6 md:px-16">
        <div className="flex gap-2">
          <Button
            size="icon"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Button>
          <Button
            size="icon"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </Button>
        </div>

        <Link href={`/${locale}/projects`}>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 ">
            {dict.exploreProjects}
          </Button>
        </Link>
      </div>

      <div className="hidden md:flex flex-row gap-4 mt-10 justify-between items-center px-4 sm:px-6 md:px-16">
        <div className="flex gap-3">
          <Button
            size="icon"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Button>
          <Button
            size="icon"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </Button>
        </div>

        <Link href={`/${locale}/projects`}>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700">
            {dict.exploreProjects} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default GalleryClient;
