// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message, locale, context } = await req.json();

    const systemPrompt =
      locale === "tr"
        ? `Sen Ceyhun Türkmen'in (.jhun) portfolyo sitesinin AI asistanısın. 
         Full-Stack Web geliştirici, 5+ yıl deneyim.
         React, Next.js, TypeScript, Tailwind CSS kullanıyor.
         Uşak/Türkiye merkezli, uzaktan çalışıyor.
         WhatsApp: +90 554 149 6377
         Kısa ve samimi cevaplar ver. Türkçe konuş.`
        : `You are AI assistant for Ceyhun Türkmen's (.jhun) portfolio.
         Full-Stack developer, 5+ years experience.
         Uses React, Next.js, TypeScript, Tailwind CSS.
         Based in Uşak, Turkey. Works remotely.
         Give short friendly responses in English.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // ← bunu değiştir
      systemInstruction: systemPrompt,
    });

    const allHistory = (context || []).slice(-6).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // İlk user mesajından itibaren al
    const firstUserIndex = allHistory.findIndex((m: any) => m.role === "user");
    const history = firstUserIndex >= 0 ? allHistory.slice(firstUserIndex) : [];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const text = result.response.text();
    console.log("✅ Gemini yanıtı:", text); // ← bunu ekle

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ error: "API hatası" }, { status: 500 });
  }
}
