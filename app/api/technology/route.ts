// app/api/technologies/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: "asc" }, // isteğe bağlı: alfabetik sırala
    });

    return NextResponse.json({ technologies });
  } catch (err) {
    console.error("Teknolojiler alınamadı:", err);
    return NextResponse.json(
      { message: "Teknolojiler alınamadı." },
      { status: 500 }
    );
  }
}
