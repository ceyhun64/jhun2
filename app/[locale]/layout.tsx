
import "../globals.css";
import ClientLayoutWrapper from "@/components/layout/clientLayoutWrapper";
import ScrollToTopButton from "@/components/layout/scroll";
import { Toaster } from "sonner";
import SocialSidebar from "@/components/layout/socialSidebar";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const htmlLang = locale || "tr";
  const ogLocale = locale === "tr" ? "tr_TR" : "en_US";
  const baseUrl = "https://jhun.com.tr";
  const canonicalUrl = `${baseUrl}/${locale}`;

  // OG Image için tam URL kullanımı
  const ogImageUrl = `${baseUrl}/og-image.webp`;

  // Dile göre içerik
  const content = {
    tr: {
      title: "Jhun | Web Geliştirme & Dijital Çözümler",
      description:
        "Kurumsal web siteleri, e-ticaret, portföy ve özel dijital çözümler ile markanızı dijitalde büyütün.",
      ogTitle: "Jhun | Web Geliştirme Ajansı",
      ogDescription:
        "Modern, hızlı ve etkileyici web siteleriyle markanızı dijital dünyada öne çıkarın.",
    },
    en: {
      title: "Jhun | Web Development & Digital Solutions",
      description:
        "Grow your brand digitally with corporate websites, e-commerce, portfolio and custom digital solutions.",
      ogTitle: "Jhun | Web Development Agency",
      ogDescription:
        "Stand out your brand in the digital world with modern, fast and impressive websites.",
    },
  };

  const currentContent = content[locale as keyof typeof content] || content.tr;

  return {
    metadataBase: new URL(baseUrl),
    title: currentContent.title,
    description: currentContent.description,
    keywords: [
      "web tasarım",
      "web geliştirme",
      "freelance developer",
      "kurumsal web sitesi",
      "react developer",
      "next.js developer",
      "dijital çözümler",
    ],

    alternates: {
      canonical: canonicalUrl,
      languages: {
        tr: `${baseUrl}/tr`,
        en: `${baseUrl}/en`,
      },
    },

    openGraph: {
      title: currentContent.ogTitle,
      description: currentContent.ogDescription,
      url: canonicalUrl,
      siteName: "Jhun",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: currentContent.ogTitle,
        },
      ],
      locale: ogLocale,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: currentContent.ogTitle,
      description: currentContent.ogDescription,
      images: [ogImageUrl],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        maxSnippet: -1,
        maxImagePreview: "large",
        maxVideoPreview: -1,
      },
    },

    other: {
      language: htmlLang,
    },
  };
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientLayoutWrapper>
        <main>{children}</main>
      </ClientLayoutWrapper>

      <SocialSidebar />
      <ScrollToTopButton />
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{ style: { zIndex: 9999 } }}
      />
    </>
  );
}
