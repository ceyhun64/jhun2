"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

export default function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Record<string, any>; // nested JSON ile uyumlu
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
