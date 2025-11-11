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
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/768px-React-icon.svg.png?20220125121207",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/768px-React-icon.svg.png?20220125121207",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/768px-React-icon.svg.png?20220125121207",
    "https://img-c.udemycdn.com/course/750x422/522048_4a6f.jpg", //html
    "https://devio2024-media.developers.io/image/upload/f_auto,q_auto,w_3840/v1728916104/user-gen-eyecatch/kdto5ze9dbln9agt6wsh.webp", //shadcn
    "https://wearedevelopers.imgix.net/magazine/articles/554/images/hero/odPaQHSbArSIFzZbUzlE-1740483365.jpeg?w=720&auto=compress,format", //ts
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://media.licdn.com/dms/image/v2/D5612AQH-HrWdn6BhYg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1677358366310?e=2147483647&v=beta&t=gVLQpnfHPqPtYnn_qcQuT5ZFXJyLX9mhb7QNFOELjHE", //mysql
    "https://wearedevelopers.imgix.net/magazine/articles/554/images/hero/odPaQHSbArSIFzZbUzlE-1740483365.jpeg?w=720&auto=compress,format",
    "https://miro.medium.com/v2/0*7sP4KxRZaIRmzYG8.png",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
    "https://cdn-1.webcatalog.io/catalog/prisma-data-platform/prisma-data-platform-social-preview.png?v=1714776724281", //prisma

    "https://www.kozmoslisesi.com/wp-content/uploads/2022/11/JavaScript.jpg", //js
    "https://www.crmizmir.com/KYP/Resimler/Next-JS-26-04-2023-10-48-44.png", //next.js
    "https://miro.medium.com/v2/1*Ojh_geZ9dR6L49yO7rim1Q.jpeg", //node.js
    "https://www.bilgisayar.name/wp-content/uploads/2014/03/mysql-logo.gif", //mysql
    "https://img-c.udemycdn.com/course/750x422/522050_6f76.jpg", //css
    "https://cdn-1.webcatalog.io/catalog/prisma-data-platform/prisma-data-platform-social-preview.png?v=1714776724281",
    "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    "https://assets.aceternity.com/glowing-effect.webp",
    "https://assets.aceternity.com/hover-border-gradient.png",
    "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
    "https://saigontechnology.com/wp-content/uploads/redux%20toolkit.webp", //tailwind
    "https://miro.medium.com/v2/0*7sP4KxRZaIRmzYG8.png", //
    "https://img-c.udemycdn.com/course/750x422/522048_4a6f.jpg", //
    "https://a.storyblok.com/f/42126/f247bde4e1/bootstrap-4-tutorial.png/m/1600x900/filters:quality(70)/", //
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
    "https://glyapi.turkcell.com.tr/CdnApi/file/educationtitle/2353b82c-bcc7-4297-9a3e-1d17ade77c1b.png", //react
  ];

  return (
    <div className="bg-linear-to-b from-black to-slate-950 py-5">
      <div className="mx-auto max-w-7xl rounded-3xl px-4 ">
        <AuroraBackground>
          {/* HERO BÖLÜMÜ */}
          {/* HERO BÖLÜMÜ */}
          <div className="text-center py-16 z-50">
            <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {dict.title}
            </h1>
            <p className="mt-6 text-md sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {dict.subtitle}
            </p>
          </div>

          {/* BİLGİ / CTA BÖLÜMÜ */}
          <div className="text-center mb-16">
            <h2 className="text-xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
              {dict.tech_title}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto sm:text-xl leading-relaxed text-md">
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
