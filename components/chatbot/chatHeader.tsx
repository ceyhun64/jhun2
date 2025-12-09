"use client";
import { X, Minimize2, BarChart3 } from "lucide-react";
import Image from "next/image";

interface Stats {
  learned: number;
  conversations: number;
  confidence: number;
}
export default function ChatHeader({
  stats,
  showStats,
  isMinimized,
  onToggleStats,
  onMinimize,
  onClose,
}: {
  stats: Stats;
  showStats: boolean;
  isMinimized: boolean;
  onToggleStats: () => void;
  onMinimize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="bg-gradient-to-r from-black via-slate-700 to-black text-white p-4 rounded-t-2xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Image
              src="/chatbot/assistan.webp"
              alt="jhunTech"
              width={40}
              height={40}
              className="w-12 h-12  rounded-full"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">AI Asistan</h3>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          aria-label="Küçült"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
