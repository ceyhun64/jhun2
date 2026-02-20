// // app/api/chat/route.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextRequest, NextResponse } from "next/server";

// // API Key kontrolünü burada yapalım ki hata erkenden yakalansın
// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey || "");

// export async function POST(req: NextRequest) {
//   try {
//     if (!apiKey) {
//       return NextResponse.json({ error: "API Key bulunamadı!" }, { status: 500 });
//     }

//     const { message, locale, context } = await req.json();

//     const systemPrompt = locale === "tr"
//       ? "Sen Ceyhun Türkmen'in portfolyo asistanısın. Kısa ve samimi cevaplar ver."
//       : "You are Ceyhun Türkmen's portfolio assistant. Give short, friendly responses.";

//     // "gemini-1.5-flash" en stabil olanıdır
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: systemPrompt,
//     });

//     // Geçmiş mesajları Gemini'nin beklediği formata sok (Hata payını azaltır)
//     const history = (context || [])
//       .filter((m: any) => m.content && (m.role === "user" || m.role === "assistant"))
//       .map((msg: any) => ({
//         role: msg.role === "assistant" ? "model" : "user",
//         parts: [{ text: msg.content }],
//       }));

//     // Chat başlatırken geçmişin user ile başladığından emin olalım
//     const chat = model.startChat({
//       history: history.length > 0 && history[0].role === "model" ? history.slice(1) : history,
//     });

//     const result = await chat.sendMessage(message);
//     const text = result.response.text();

//     return NextResponse.json({ response: text });
//   } catch (error: any) {
//     console.error("DETAYLI HATA:", error);
//     // Eğer hala 404 veriyorsa model ismi yerine "models/gemini-1.5-flash" dene
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// app/api/chat/route.ts
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    const messages = (context || []).slice(-6).map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    messages.push({ role: "user", content: message });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json({ error: "API hatası" }, { status: 500 });
  }
}
