// app/layout.tsx (DÜZELTİLMİŞ KÖK LAYOUT)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font tanımlamaları burada kalsın, ancak sınıfları alt düzeye taşıyacağız
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Jhun | Web Geliştirme & Dijital Çözümler",
  description:
    "Kurumsal web siteleri, e-ticaret, portföy ve özel dijital çözümler ile markanızı dijitalde büyütün.",
  openGraph: {
    title: "Jhun | Web Geliştirme Ajansı",
    description:
      "Modern, hızlı ve etkileyici web siteleriyle markanızı dijital dünyada öne çıkarın.",
    images: ["/og-image.webp"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html> etiketi SADECE BURADA olmalıdır.
    <html>
      {/* <body> etiketi SADECE BURADA olmalıdır. */}
      {/* HATA DÜZELTMESİ: Font sınıfları kaldırıldı. Dinamik dilden gelen dil koduyla çakışmaması için burada lang özniteliği de yok. */}
      <body>
        {/*
          'children' prop'u artık app/[locale]/layout.tsx dosyasını render eder.
          O dosyadaki üst düzey <div /> etiketi, bu <body> etiketinin çocuğu olur.
        */}
        {children}
      </body>
    </html>
  );
}
