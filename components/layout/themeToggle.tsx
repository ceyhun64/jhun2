"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Hydration hatasını önlemek için mounted kontrolü
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />; // Boş yer tutucu
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative flex items-center justify-center rounded-full hover:bg-accent/50"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem] text-purple-400" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Temayı Değiştir</span>
    </Button>
  );
}
