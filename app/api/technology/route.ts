// app/api/technology/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, icon, type, yoe, color } = body;

    // Basit doğrulama
    if (!name || !icon || !type || !yoe || !color) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    // Prisma ile teknoloji ekleme
    const newTechnology = await prisma.technology.create({
      data: {
        name,
        icon,
        type,
        yoe,
        color,
      },
    });

    return NextResponse.json(
      { message: "Teknoloji başarıyla eklendi.", technology: newTechnology },
      { status: 201 }
    );
  } catch (err) {
    console.error("Teknoloji eklenemedi:", err);

    // Unique constraint hatası
    if (err instanceof Error && (err as any).code === "P2002") {
      return NextResponse.json(
        { message: "Bu teknoloji zaten mevcut." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Teknoloji eklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// GET metodunu da koruyoruz
export async function GET(request: NextRequest) {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: "asc" },
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
