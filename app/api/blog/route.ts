// ================================================
// app/api/blog/route.ts
// ================================================
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import Blog from "@/models/blog";

type BlogWithTransform = {
  id: string;
  title: string;
  titleEng: string | null;
  summary: string;
  summaryEng: string | null;
  description: string;
  descriptionEng: string | null;
  url: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments();

    const transformedBlogs: BlogWithTransform[] = blogs.map((blog: any) => ({
      id: blog._id.toString(),
      title: blog.title,
      titleEng: blog.titleEng || null,
      summary: blog.summary,
      summaryEng: blog.summaryEng || null,
      description: blog.description,
      descriptionEng: blog.descriptionEng || null,
      url: blog.url,
      image: blog.image,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    return NextResponse.json({
      blogs: transformedBlogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Bloglar alınamadı:", err);
    return NextResponse.json(
      {
        message: "Bloglar alınamadı.",
        error: err instanceof Error ? err.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const titleEng = formData.get("titleEng") as string;
    const summary = formData.get("summary") as string;
    const summaryEng = formData.get("summaryEng") as string;
    const description = formData.get("description") as string;
    const descriptionEng = formData.get("descriptionEng") as string;
    const url = formData.get("url") as string;
    const image = formData.get("image") as File | null;

    if (!title || !summary || !description || !url || !image) {
      return NextResponse.json(
        { message: "Başlık, özet, açıklama, url ve görsel zorunludur." },
        { status: 400 }
      );
    }

    // Aynı URL'ye sahip blog var mı kontrol et
    const existingBlog = await Blog.findOne({ url });
    if (existingBlog) {
      return NextResponse.json(
        { message: "Bu URL zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Görseli yükle
    const uploadForm = new FormData();
    uploadForm.append("file", image);
    uploadForm.append("folderName", "blogs");

    const uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: uploadForm,
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok || !uploadData.path) {
      throw new Error("Görsel yükleme başarısız");
    }

    const imagePath = uploadData.path as string;

    // Blog oluştur
    const blog = await Blog.create({
      title,
      titleEng,
      summary,
      summaryEng,
      description,
      descriptionEng,
      url,
      image: imagePath,
    });

    const result: BlogWithTransform = {
      id: blog._id.toString(),
      title: blog.title,
      titleEng: blog.titleEng || null,
      summary: blog.summary,
      summaryEng: blog.summaryEng || null,
      description: blog.description,
      descriptionEng: blog.descriptionEng || null,
      url: blog.url,
      image: blog.image,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };

    return NextResponse.json({ blog: result }, { status: 201 });
  } catch (err) {
    console.error("Blog oluşturulurken hata:", err);
    return NextResponse.json(
      {
        message: "Blog oluşturulamadı.",
        error: err instanceof Error ? err.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}