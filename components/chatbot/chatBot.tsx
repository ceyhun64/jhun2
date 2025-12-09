// components/PortfolioChatbot.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import ChatButton from "./chatButton";
import MessageBubble from "./messageBubble";
import ChatHeader from "./chatHeader";
import ChatInput from "./chatInput";
import TypingIndicator from "./typingIndıcator";
import keywords from "@/data/keywords.json";
import responses from "@/data/responses.json";

// types/chatbot.ts
export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface LearnedResponse {
  question: string;
  answer: string;
  variations: string[];
  useCount: number;
  confidence: number;
  createdAt: string;
  lastUsed: string;
}

export interface Conversation {
  question: string;
  answer: string;
  timestamp: string;
  context: string[];
}

export interface Stats {
  learned: number;
  conversations: number;
  confidence: number;
}
export const getContextualResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();

  // Anahtar kelime eşleştirme
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((word: string) => input.includes(word))) {
      return responses[category as keyof typeof responses];
    }
  }

  // Kısa soru kontrolü
  if (input.length < 15) {
    return responses.short_question;
  }

  // Varsayılan yanıt
  return responses.default;
};
export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Stats>({
    learned: 0,
    conversations: 0,
    confidence: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const learnedResult = await window.storage.get("learned_responses");
        const conversationsResult = await window.storage.get("conversations");

        const learned = learnedResult ? JSON.parse(learnedResult.value) : [];
        const conversations = conversationsResult
          ? JSON.parse(conversationsResult.value)
          : [];

        const avgConfidence =
          learned.length > 0
            ? learned.reduce(
                (sum: number, item: LearnedResponse) => sum + item.confidence,
                0
              ) / learned.length
            : 0;

        setStats({
          learned: learned.length,
          conversations: conversations.length,
          confidence: Math.round(avgConfidence * 100),
        });
      } catch (error) {
        console.log("İstatistikler yükleniyor...");
      }
    };

    if (isOpen) {
      loadStats();
    }
  }, [isOpen, messages]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content:
              "Merhaba! Ben Ceyhun'un Akıllı Asistanıyım! 😁\n\nSizinle her konusmadan ögreniyor ve gelisiyorum. Web gelistirme projeleri, fiyatlandırma, teknolojiler ve daha fazlası hakkında sorularınızı yanıtlayabilirim.\n\nNasıl yardımcı olabilirim?",
            timestamp: new Date(),
          },
        ]);
      }, 500);
    }
  }, [isOpen]);

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = new Set(str1.split(" ").filter((w) => w.length > 2));
    const words2 = new Set(str2.split(" ").filter((w) => w.length > 2));
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    const jaccardScore = union.size > 0 ? intersection.size / union.size : 0;

    const getTrigrams = (str: string) => {
      const trigrams = [];
      for (let i = 0; i < str.length - 2; i++) {
        trigrams.push(str.slice(i, i + 3));
      }
      return trigrams;
    };

    const tri1 = getTrigrams(str1);
    const tri2 = getTrigrams(str2);
    const triIntersection = tri1.filter((t) => tri2.includes(t)).length;
    const triUnion = tri1.length + tri2.length - triIntersection;
    const trigramScore = triUnion > 0 ? triIntersection / triUnion : 0;

    return jaccardScore * 0.6 + trigramScore * 0.4;
  };

  const findLearnedResponse = async (input: string): Promise<string | null> => {
    try {
      const result = await window.storage.get("learned_responses");
      if (!result) return null;

      const learned: LearnedResponse[] = JSON.parse(result.value);
      let bestMatch = null;
      let bestSimilarity = 0;

      for (const item of learned) {
        const allQuestions = [item.question, ...item.variations];
        for (const q of allQuestions) {
          const similarity = calculateSimilarity(input, q.toLowerCase());
          if (similarity > bestSimilarity && similarity > 0.7) {
            bestSimilarity = similarity;
            bestMatch = item;
          }
        }
      }

      if (bestMatch) {
        bestMatch.useCount++;
        bestMatch.lastUsed = new Date().toISOString();
        bestMatch.confidence = Math.min(0.98, bestMatch.confidence + 0.02);
        await window.storage.set("learned_responses", JSON.stringify(learned));
        return bestMatch.answer;
      }
    } catch (error) {
      console.log("Öğrenme verisi henüz yok");
    }
    return null;
  };

  const findSimilarConversation = async (
    input: string
  ): Promise<string | null> => {
    try {
      const result = await window.storage.get("conversations");
      if (!result) return null;

      const conversations: Conversation[] = JSON.parse(result.value);
      const sorted = conversations
        .map((conv) => ({
          ...conv,
          similarity: calculateSimilarity(input, conv.question.toLowerCase()),
        }))
        .filter((conv) => conv.similarity > 0.65)
        .sort((a, b) => b.similarity - a.similarity);

      if (sorted.length > 0) {
        return sorted[0].answer;
      }
    } catch (error) {
      console.log("Henüz konuşma geçmişi yok");
    }
    return null;
  };

  const generateSmartResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase();
    const learned = await findLearnedResponse(input);
    if (learned) return `🧠 ${learned}`;
    const similar = await findSimilarConversation(input);
    if (similar) return `💡 ${similar}`;
    return getContextualResponse(input);
  };

  const saveConversation = async (question: string, answer: string) => {
    try {
      const result = await window.storage.get("conversations");
      const conversations: Conversation[] = result
        ? JSON.parse(result.value)
        : [];
      conversations.push({
        question,
        answer,
        timestamp: new Date().toISOString(),
        context: conversationContext.slice(-3),
      });
      const recent = conversations.slice(-200);
      await window.storage.set("conversations", JSON.stringify(recent));
      await analyzeAndLearn(question, answer);
    } catch (error) {
      console.error("Konuşma kaydetme hatası:", error);
    }
  };

  const analyzeAndLearn = async (question: string, answer: string) => {
    try {
      const result = await window.storage.get("learned_responses");
      const learned: LearnedResponse[] = result ? JSON.parse(result.value) : [];
      let existing = null;
      let bestSimilarity = 0;

      for (const item of learned) {
        const similarity = calculateSimilarity(
          question.toLowerCase(),
          item.question.toLowerCase()
        );
        if (similarity > bestSimilarity && similarity > 0.75) {
          bestSimilarity = similarity;
          existing = item;
        }
      }

      if (!existing) {
        learned.push({
          question,
          answer,
          variations: [question],
          useCount: 1,
          confidence: 0.5,
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
        });
      } else {
        if (!existing.variations.includes(question)) {
          existing.variations.push(question);
        }
        existing.useCount++;
        existing.confidence = Math.min(0.98, existing.confidence + 0.03);
        existing.lastUsed = new Date().toISOString();
      }

      await window.storage.set("learned_responses", JSON.stringify(learned));
    } catch (error) {
      console.error("Öğrenme hatası:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);
    setIsTyping(true);
    setConversationContext((prev) => [...prev.slice(-5), userInput]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const response = await generateSmartResponse(userInput);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      await saveConversation(userInput, response);
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const resetData = async () => {
    if (confirm("Tüm öğrenilmiş veriler silinecek. Emin misiniz?")) {
      try {
        await window.storage.delete("learned_responses");
        await window.storage.delete("conversations");
        setStats({ learned: 0, conversations: 0, confidence: 0 });
        alert("Veriler sıfırlandı!");
      } catch (error) {
        console.error("Veri sıfırlama hatası:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return <ChatButton stats={stats} onClick={() => setIsOpen(true)} />;
  }

  return (
    <div
      className={`fixed right-0 px-4 md:px-0 bottom-6 md:right-6 rounded-2xl shadow-2xl z-1000 transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      <ChatHeader
        stats={stats}
        showStats={showStats}
        isMinimized={isMinimized}
        onToggleStats={() => setShowStats(!showStats)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onClose={() => setIsOpen(false)}
      />

      {!isMinimized && (
        <>

          <div
            className={`${
              showStats ? "h-[340px]" : "h-[440px]"
            } overflow-y-auto p-4 space-y-4 bg-gray-50`}
          >
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            value={input}
            isLoading={isLoading}
            onChange={setInput}
            onSend={sendMessage}
            onKeyPress={handleKeyPress}
          />
        </>
      )}
    </div>
  );
}
