import { ThreeDMarquee } from "@/components/ui/shadcn-io/3d-marquee";
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background";
import { getDictionary } from "@/lib/get-dictionary";

type Props = {
  locale: "tr" | "en";
};
const Banner = async ({ locale }: Props) => {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.banner;

  const images = [
    "/banner/html.webp", //html
    "/banner/html.webp", //html
    "/banner/html.webp", //html
    "/banner/html.webp", //html
    "/banner/shadcn.webp", //shadcn
    "/banner/ts.webp", //ts
    "/banner/react.webp", //react
    "/banner/sequelize.webp", //sequeliz
    "/banner/ts.webp", //ts
    "/banner/tailwind.webp", //tailwind
    "/banner/tailwind.webp", //tailwind
    "/banner/tailwind.webp", //tailwind
    "/banner/tailwind.webp", //tailwind
    "/banner/prisma.webp", //prisma
    "/banner/js.webp", //js
    "/banner/next.webp", //next.js
    "/banner/node.webp", //node.js
    "banner/mysql.webp", //mysql
    "/banner/css.webp", //css
    "/banner/prisma.webp", //prisma
    "/banner/prisma.webp", //prisma
    "/banner/prisma.webp", //prisma
    "/banner/prisma.webp", //prisma
    "/banner/prisma.webp", //prisma
    "/banner/redux.webp", //redux
    "/banner/tailwind.webp", //tailwind
    "/banner/html.webp", //html
    "/banner/bootstrap.webp", //bootstrap
    "/banner/react.webp", //react
    "/banner/react.webp", //react
    "/banner/react.webp", //react
    "/banner/react.webp", //react
    "/banner/react.webp", //react
    "/banner/react.webp", //react
    "/banner/react.webp", //react
    "/banner/react.webp", //react
    "/banner/react.webp", //react
  ];

  return (
    <div className="bg-linear-to-b from-black to-slate-950 py-5">
      <div className="mx-auto max-w-7xl rounded-3xl px-4 ">
        <AuroraBackground>
          {/* HERO BÖLÜMÜ */}
          {/* HERO BÖLÜMÜ */}
          <div className="text-center py-15 z-50 px-2">
            <h1 className="text-2xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {dict.title}
            </h1>
            <p className="mt-6 text-sm md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {dict.subtitle}
            </p>
          </div>

          {/* BİLGİ / CTA BÖLÜMÜ */}
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200">
              {dict.tech_title}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-lg">
              {dict.tech_subtitle}
            </p>
          </div>
        </AuroraBackground>

        {/* 3D MARQUEE BÖLÜMÜ */}
        <ThreeDMarquee images={images} />
      </div>
    </div>
  );
};

export default Banner;
