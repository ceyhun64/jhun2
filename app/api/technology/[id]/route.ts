// app/api/technologies/[id]/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Promise olarak al
) {
  const { id } = await context.params; // await et

  try {
    const technology = await prisma.technology.findUnique({
      where: { id: id }, // MongoDB ObjectId string olarak
    });

    if (!technology) {
      return NextResponse.json(
        { message: "Teknoloji bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({ technology });
  } catch (err) {
    console.error("Teknoloji alınamadı:", err);
    return NextResponse.json(
      { message: "Teknoloji alınamadı." },
      { status: 500 }
    );
  }
}
