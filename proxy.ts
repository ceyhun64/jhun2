import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const locales = ["tr", "en"];

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return "tr";
  const preferred = acceptLanguage.split(",")[0].split("-")[0];
  return locales.includes(preferred) ? preferred : "tr";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔒 Statik dosyalar, API ve _next klasörü hariç
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return;
  }

  // 🧩 Admin sayfasını da locale yönlendirmesinden hariç tut
  if (pathname.startsWith("/admin")) {
    return; // admin'e dokunma, /tr/admin yapma
  }

  // 🌍 Locale eklemesi gereken sayfalar
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const url = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }
}
