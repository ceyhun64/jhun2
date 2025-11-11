"use client";

import { ReactNode } from "react";
import ScrollToTopButton from "./scroll";
import { Toaster } from "sonner";

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ScrollToTopButton />
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{ style: { zIndex: 9999 } }}
      />
    </>
  );
}
