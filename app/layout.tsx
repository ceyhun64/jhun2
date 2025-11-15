// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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

const criticalCSS = `
  :root{
    --radius:.625rem;
    --background:#fff;
    --foreground:#09090b;
    --card:#fff;
    --card-foreground:#09090b;
    --primary:#18181b;
    --primary-foreground:#fafafa;
    --secondary:#f4f4f5;
    --secondary-foreground:#18181b;
    --muted:#f4f4f5;
    --muted-foreground:#71717b;
  }
  html{overflow-y:scroll}
  header, nav, main { padding: 20px; background: var(--background); }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Geri kalan CSS’i ertele */}
        <Script src="/globals.css" strategy="afterInteractive" />
      </body>
    </html>
  );
}
