// ================================================
// app/api/technology/route.ts
// ================================================
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import Technology from "@/models/technology";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, icon, type, yoe, color } = body;

    if (!name || !icon || !type || yoe === undefined || !color) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 },
      );
    }

    const newTechnology = await Technology.create({
      name,
      icon,
      type,
      yoe,
      color,
      projects: [],
    });

    return NextResponse.json(
      {
        message: "Teknoloji başarıyla eklendi.",
        technology: {
          ...newTechnology.toObject(),
          id: newTechnology._id.toString(),
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Teknoloji eklenemedi:", err);

    if (err instanceof Error && (err as any).code === 11000) {
      return NextResponse.json(
        { message: "Bu teknoloji zaten mevcut." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Teknoloji eklenirken bir hata oluştu." },
      { status: 500 },
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    await connectDB();

    const technologies = await Technology.find({}).sort({ name: 1 }).lean();

    return NextResponse.json({
      technologies: technologies.map((t) => ({
        ...t,
        id: t._id.toString(),
        // projects dizisindeki ObjectId'leri de string'e çevir
        projects: Array.isArray(t.projects)
          ? t.projects.map((p: any) => p.toString())
          : [],
      })),
    });
  } catch (err) {
    console.error("Teknolojiler alınamadı:", err);
    return NextResponse.json(
      { message: "Teknolojiler alınamadı." },
      { status: 500 },
    );
  }
}
