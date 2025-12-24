// app/[locale]/layout.tsx
import "../globals.css";
import ClientLayoutWrapper from "@/components/layout/clientLayoutWrapper";
import ScrollToTopButton from "@/components/layout/scroll";
import { Toaster } from "sonner";
import SocialSidebar from "@/components/layout/socialSidebar";
import type { Metadata } from "next";
import Chatbot from "@/components/chatbot/chatBot";

// Teknolojik fontlar - İstediğiniz kombinasyonu seçin:

// SEÇENEK 1: Orbitron + Space Grotesk (Şu anki)
import { Orbitron, Space_Grotesk } from "next/font/google";
const mainFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});
const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const htmlLang = locale || "tr";
  const ogLocale = locale === "tr" ? "tr_TR" : "en_US";
  const baseUrl = "https://jhun.com.tr";
  const canonicalUrl = `${baseUrl}/${locale}`;
  const ogImageUrl = `${baseUrl}/og-image.webp`;

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
      },
    },

    other: {
      language: htmlLang,
    },
  };
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children }: LayoutProps) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            ${
              mainFont.style.fontFamily
                ? `--font-main: ${mainFont.style.fontFamily};`
                : ""
            }
            ${
              bodyFont.style.fontFamily
                ? `--font-body: ${bodyFont.style.fontFamily};`
                : ""
            }
          }
          body {
            font-family: var(--font-body), system-ui, sans-serif;
          }
          h1, h2, h3, h4, h5, h6,p,span,button{
            font-family: var(--font-main), system-ui, sans-serif;
            font-weight: 700;
            letter-spacing: 0.02em;
          }
        `,
        }}
      />

      <div className={`${mainFont.variable} ${bodyFont.variable}`}>
          <ClientLayoutWrapper>
            <main>{children}</main>
            <Chatbot /> {/* ← HER SAYFADA ÇIKAR */}
          </ClientLayoutWrapper>

          <SocialSidebar />
          <ScrollToTopButton />
          <Toaster
            richColors
            position="bottom-right"
            toastOptions={{ style: { zIndex: 9999 } }}
          />
      </div>
    </>
  );
}
