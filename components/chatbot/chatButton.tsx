"use client";
import { Bot, MessageCircle } from "lucide-react";

interface Stats {
  learned: number;
  conversations: number;
  confidence: number;
}
export default function ChatButton({
  stats,
  onClick,
}: {
  stats: Stats;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 z-50 group"
      aria-label="Sohbeti Aç"
    >
      <Bot className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      {stats.learned > 0 && (
        <span className="absolute -top-2 -left-2 bg-yellow-500 text-xs px-2 py-1 rounded-full font-bold">
          {stats.learned}
        </span>
      )}
    </button>
  );
}
