import { Send } from "lucide-react";
export default function ChatInput({
  value,
  isLoading,
  onChange,
  onSend,
  onKeyPress,
}: {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="p-4 border-t bg-white rounded-b-2xl">
      <div className="flex gap-2 items-end">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Mesajınızı yazın..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          className="bg-linear-to-r from-amber-500 to-amber-600 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          aria-label="Gönder"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
