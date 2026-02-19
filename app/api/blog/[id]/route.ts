// ================================================
// app/api/blog/[id]/route.ts
// ================================================
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongoose";
import Blog from "@/models/blog";
import type { IBlog } from "@/models/blog";
import type { FlattenMaps } from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

type LeanBlog = FlattenMaps<IBlog> & { _id: string };

async function deleteImageFromCloudinary(imageUrl?: string | null) {
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) return;
  try {
    const parts = imageUrl.split("/");
    // Cloudinary URL formatı: .../upload/v{version}/{folder}/{filename}.{ext}
    // public_id = folder/filename (uzantısız)
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return;

    // version segmentini (v12345...) atla
    const afterUpload = parts.slice(uploadIndex + 1);
    const withoutVersion = afterUpload[0]?.startsWith("v")
      ? afterUpload.slice(1)
      : afterUpload;

    const publicIdWithExtension = withoutVersion.join("/");
    const publicId = publicIdWithExtension.substring(
      0,
      publicIdWithExtension.lastIndexOf("."),
    );

    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.warn(`Cloudinary silme hatası: ${imageUrl}`, err);
  }
}

// ------------------------- GET -------------------------
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const blog = await Blog.findById(id).lean<LeanBlog>();

    if (!blog)
      return NextResponse.json({ message: "Blog bulunamadı" }, { status: 404 });

    const result = {
      ...blog,
      id: blog._id.toString(),
    };

    return NextResponse.json({ blog: result });
  } catch (err) {
    console.error("Blog getirme hatası:", err);
    return NextResponse.json({ message: "Blog alınamadı" }, { status: 500 });
  }
}

// ------------------------- DELETE -------------------------
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const blog = await Blog.findById(id).lean<LeanBlog>();
    if (!blog)
      return NextResponse.json({ message: "Blog bulunamadı" }, { status: 404 });

    await deleteImageFromCloudinary(blog.image);
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog ve görsel silindi" });
  } catch (err) {
    console.error("Blog Silme Hatası:", err);
    return NextResponse.json(
      { message: "Blog silinirken hata oluştu" },
      { status: 500 },
    );
  }
}

// ------------------------- PUT -------------------------
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const titleEng = formData.get("titleEng") as string;
  const summary = formData.get("summary") as string;
  const summaryEng = formData.get("summaryEng") as string;
  const description = formData.get("description") as string;
  const descriptionEng = formData.get("descriptionEng") as string;
  const url = formData.get("url") as string;

  const existingImage = formData.get("existingImage") as string | null;
  const imageFile = formData.get("image") as File | null;

  if (!title || !summary || !description || !url)
    return NextResponse.json(
      { message: "Eksik zorunlu alanlar var" },
      { status: 400 },
    );

  if (!existingImage && (!imageFile || imageFile.size === 0))
    return NextResponse.json({ message: "Görsel zorunludur" }, { status: 400 });

  try {
    await connectDB();

    const blog = await Blog.findById(id).lean<LeanBlog>();
    if (!blog)
      return NextResponse.json({ message: "Blog bulunamadı" }, { status: 404 });

    // URL çakışma kontrolü
    if (url && url !== blog.url) {
      const existingBlog = await Blog.findOne({ url, _id: { $ne: id } });
      if (existingBlog) {
        return NextResponse.json(
          { message: "Bu URL zaten kullanılıyor" },
          { status: 400 },
        );
      }
    }

    // Görsel güncelleme
    let finalImageUrl: string = existingImage || blog.image;

    if (imageFile && imageFile.size > 0) {
      // Eski görseli sil
      if (blog.image) await deleteImageFromCloudinary(blog.image);

      // Yeni görseli yükle
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const uploadForm = new FormData();
      uploadForm.append("file", imageFile);
      uploadForm.append("folderName", "blogs");

      const uploadRes = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.path) {
        throw new Error("Görsel yükleme başarısız");
      }

      finalImageUrl = uploadData.path as string;
    } else if (!existingImage && blog.image) {
      // Görsel tamamen kaldırılmışsa
      await deleteImageFromCloudinary(blog.image);
      finalImageUrl = "";
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        titleEng: titleEng || null,
        summary,
        summaryEng: summaryEng || null,
        description,
        descriptionEng: descriptionEng || null,
        url,
        image: finalImageUrl,
      },
      { new: true },
    ).lean<LeanBlog>();

    if (!updatedBlog) {
      return NextResponse.json(
        { message: "Blog güncellenemedi" },
        { status: 500 },
      );
    }

    const result = {
      ...updatedBlog,
      id: updatedBlog._id.toString(),
    };

    return NextResponse.json({ blog: result });
  } catch (err) {
    console.error("Blog Güncelleme Hatası:", err);
    return NextResponse.json(
      { message: "Blog güncellenirken hata oluştu" },
      { status: 500 },
    );
  }
}
