// app/layout.tsx (DÜZELTİLMİŞ KÖK LAYOUT)

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
