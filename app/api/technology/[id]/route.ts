// ================================================
// app/api/technology/[id]/route.ts
// ================================================
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import Technology from "@/models/technology";
import Project from "@/models/projects";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();

    // ✅ İsteğe bağlı: Bu teknolojiyi kullanan projeleri de göster
    const technology = await Technology.findById(id)
      .populate("projects")
      .lean();

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const technology = await Technology.findById(id).lean();
    if (!technology) {
      return NextResponse.json(
        { message: "Teknoloji bulunamadı." },
        { status: 404 }
      );
    }

    // ✅ ÇOK ÖNEMLİ: İlişkiyi projelerden de temizle
    await Project.updateMany(
      { technologies: id },
      { $pull: { technologies: id } }
    );

    await Technology.findByIdAndDelete(id);

    return NextResponse.json({ message: "Teknoloji başarıyla silindi." });
  } catch (err) {
    console.error("Teknoloji silinemedi:", err);
    return NextResponse.json(
      { message: "Teknoloji silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const body = await request.json();
    const { name, icon, type, yoe, color } = body;

    if (!name || !icon || !type || yoe === undefined || !color) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    const updatedTechnology = await Technology.findByIdAndUpdate(
      id,
      { name, icon, type, yoe, color },
      { new: true, runValidators: true }
    );

    if (!updatedTechnology) {
      return NextResponse.json(
        { message: "Teknoloji bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Teknoloji başarıyla güncellendi.",
      technology: updatedTechnology,
    });
  } catch (err) {
    console.error("Teknoloji güncellenemedi:", err);

    if (err instanceof Error && (err as any).code === 11000) {
      return NextResponse.json(
        { message: "Bu teknoloji adı zaten kullanılıyor." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Teknoloji güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
