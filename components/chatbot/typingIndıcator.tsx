"use client";

interface TypingIndicatorProps {
  message?: string;
}

export default function TypingIndicator({ message }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-none px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          {message && (
            <span className="text-xs text-gray-500 ml-1">{message}</span>
          )}
        </div>
      </div>
    </div>
  );
}