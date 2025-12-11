"use client";
import { X, Minimize2, BarChart3, RotateCcw } from "lucide-react";
import Image from "next/image";

interface Stats {
  learned: number;
  conversations: number;
  confidence: number;
}

interface ChatHeaderProps {
  stats: Stats;
  showStats: boolean;
  isMinimized: boolean;
  messages: any;
  onToggleStats: () => void;
  onMinimize: () => void;
  onClose: () => void;
  onReset: () => void;
}

export default function ChatHeader({
  stats,
  showStats,
  isMinimized,
  messages,
  onToggleStats,
  onMinimize,
  onClose,
  onReset,
}: ChatHeaderProps) {
  return (
    <>
      <div className="bg-linear-to-r from-black via-slate-700 to-black text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Image
                src="/chatbot/assistant.webp"
                alt="jhunTech"
                width={40}
                height={40}
                className="w-12 h-12 rounded-full"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{messages.title}</h3>
            <p className="text-xs text-gray-300">{messages.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleStats}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label={messages.stats.title}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={onMinimize}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label={messages.minimize}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label={messages.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      {showStats && !isMinimized && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800 text-sm">
              {messages.stats.title}
            </h4>
            <button
              onClick={onReset}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {messages.stats.reset}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {stats.learned}
              </div>
              <div className="text-xs text-gray-600">
                {messages.stats.learned}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {stats.conversations}
              </div>
              <div className="text-xs text-gray-600">
                {messages.stats.conversations}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {stats.confidence}%
              </div>
              <div className="text-xs text-gray-600">
                {messages.stats.confidence}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}