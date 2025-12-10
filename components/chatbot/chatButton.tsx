"use client";
import { Bot } from "lucide-react";

interface Stats {
  learned: number;
  conversations: number;
  confidence: number;
}

interface ChatButtonProps {
  stats: Stats;
  messages: any;
  onClick: () => void;
}

export default function ChatButton({
  stats,
  messages,
  onClick,
}: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 group z-55"
      aria-label={messages.aiAssistant}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

      {/* Main button */}
      <div className="relative bg-linear-to-br from-violet-600 via-fuchsia-600 to-pink-600 p-5 rounded-full shadow-2xl hover:shadow-fuchsia-500/60 transition-all duration-500 hover:scale-110 hover:rotate-12">
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full" />

        {/* Icon container */}
        <div className="relative">
          <Bot className="w-5 h-5 text-white drop-shadow-lg" />
        </div>

        {/* Orbital rings */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute inset-0 rounded-full border-2 border-white/10 animate-spin"
          style={{ animationDuration: "5s", animationDirection: "reverse" }}
        />
      </div>

      {/* Online indicator with gradient */}
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-linear-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-400/50">
        <span className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
      </span>

      {/* AI learned badge with modern design */}
      {stats.learned > 0 && (
        <div className="absolute -top-3 -left-3 bg-linear-to-br from-purple-500 to-indigo-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg shadow-purple-500/50 border-2 border-white/30 backdrop-blur-sm">
          <span className="relative z-55">+{stats.learned}</span>
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
        </div>
      )}

      {/* Hover tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-4 py-2 z-55 bg-gray-900/95 backdrop-blur-md text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl border border-white/10 transform group-hover:-translate-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{messages.aiAssistant}</span>
          <span className="text-green-400">●</span>
        </div>

        <div className="absolute bottom-0 right-4 w-2 h-2 bg-gray-900/95 transform rotate-45 translate-y-1" />
      </div>
    </button>
  );
}