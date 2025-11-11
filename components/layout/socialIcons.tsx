"use client";

import { Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-3">
      <Link href="https://github.com/ceyhun64" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon" className="text-white hover:text-purple-400">
          <Github className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="https://linkedin.com/in/ceyhun-türkmen-14882a26a" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon" className="text-white hover:text-blue-400">
          <Linkedin className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
