"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Hydration hatasını önlemek için bileşenin yüklendiğinden emin oluyoruz
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />; // Boş alan bırakır

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-white hover:bg-white/10"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 transition-all text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 transition-all text-blue-400" />
        )}
        <span className="sr-only">Tema Değiştir</span>
      </Button>
    </motion.div>
  );
}