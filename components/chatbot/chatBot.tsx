// components/chatbot/chatBot.tsx
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PortfolioChatbot from "./chatBotClient";

export default function Chatbot() {
  const params = useParams();
  const [messages, setMessages] = useState<any>(null);
  const locale = (params?.locale as string) || "tr";

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const mod = await import(`@/messages/${locale}.json`);
        setMessages(mod.default);
      } catch (error) {
        console.error("Dil dosyası yüklenemedi:", error);
        // Fallback olarak Türkçe yükle
        const mod = await import(`@/messages/tr.json`);
        setMessages(mod.default);
      }
    };

    loadMessages();
  }, [locale]);

  if (!messages) {
    return null; // veya loading spinner
  }

  return <PortfolioChatbot locale={locale} messages={messages} />;
}