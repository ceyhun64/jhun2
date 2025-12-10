"use client";
import { useParams } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "tr";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale === "tr" ? "tr-TR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          message.role === "user"
            ? "bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
            : "bg-white text-gray-800 shadow-md rounded-bl-none"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {message.content}
        </p>
        <span className="text-xs opacity-70 mt-1 block">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}