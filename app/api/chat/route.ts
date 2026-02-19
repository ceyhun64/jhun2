// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { message, locale, context } = await req.json();

  const systemPrompt = locale === "tr"
    ? `Sen Ceyhun Türkmen'in (.jhun) portfolyo sitesinin AI asistanısın. 
       Ceyhun bir Full-Stack Web geliştiricisidir. 5+ yıl deneyimi var.
       React, Next.js, TypeScript, Tailwind CSS kullanıyor.
       Türkiye/Uşak'ta yaim, uzaktan çalışıyor.
       WhatsApp: +90 554 149 6377
       GitHub: github.com/ceyhun64
       LinkedIn: linkedin.com/in/ceyhun-türkmen-14882a26a
       
       Kısa, samimi ve yardımsever cevaplar ver. Türkçe konuş.
       Fiyat sorusunda: "Her proje özel, detaylı konuşalım" de ve iletişime yönlendir.`
    : `You are the AI assistant for Ceyhun Türkmen's (.jhun) portfolio site.
       Ceyhun is a Full-Stack Web developer with 5+ years experience.
       Uses React, Next.js, TypeScript, Tailwind CSS.
       Based in Uşak, Turkey. Works remotely.
       WhatsApp: +90 554 149 6377
       
       Give short, friendly, helpful responses. Speak in English.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Ücretsiz ve hızlı
    systemInstruction: systemPrompt,
  });

  // Önceki konuşmaları gönder (context)
  const history = (context || []).slice(-6).map((msg: any) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(message);
  const text = result.response.text();

  return NextResponse.json({ response: text });
}