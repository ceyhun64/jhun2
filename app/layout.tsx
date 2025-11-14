import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SocialSidebar from "@/components/layout/socialSidebar";
import ClientLayoutWrapper from "@/components/layout/clientLayoutWrapper";
import ScrollToTopButton from "@/components/layout/scroll";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",       // text hemen gösterilir, font yüklenirken fallback kullanılır
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  const htmlLang = locale || "tr";
  const ogLocale = locale === "tr" ? "tr_TR" : "en_US";

  const url = "https://jhun.vercel.app"; // kendi siten

  return {
    metadataBase: new URL(url),
    title: "Jhun | Web Geliştirme & Dijital Çözümler",
    description:
      "Kurumsal web siteleri, e-ticaret, portföy ve özel dijital çözümler ile markanızı dijitalde büyütün.",
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
      canonical: url,
      languages: {
        tr: `${url}/tr`,
        en: `${url}/en`,
      },
    },

    openGraph: {
      title: "Jhun | Web Geliştirme Ajansı",
      description:
        "Modern, hızlı ve etkileyici web siteleriyle markanızı dijital dünyada öne çıkarın.",
      url: url,
      siteName: "Jhun",
      images: [
        {
          url: "/og-image.webp",
          width: 1200,
          height: 630,
          alt: "Jhun Web Geliştirme Ajansı",
        },
      ],
      locale: ogLocale,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: "Jhun | Web Geliştirme Ajansı",
      description: "Modern, hızlı ve etkili web çözümleriyle işinizi büyütün.",
      images: ["/og-image.webp"],
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

    lang: htmlLang,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayoutWrapper>
          <main>{children}</main>
        </ClientLayoutWrapper>
        {/* Sosyal medya sidebar */}
        <SocialSidebar />
        <ScrollToTopButton />
        <Toaster
          richColors
          position="bottom-right"
          toastOptions={{
            style: { zIndex: 9999 },
          }}
        />{" "}
      </body>
    </html>
  );
}
