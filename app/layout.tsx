import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

// Temel metadata - locale layout'ta daha detaylı override edilecek
export const metadata: Metadata = {
  metadataBase: new URL("https://jhun.com.tr"),
  title: "Jhun | Web Geliştirme & Dijital Çözümler",
  description:
    "Kurumsal web siteleri, e-ticaret, portföy ve özel dijital çözümler ile markanızı dijitalde büyütün.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
