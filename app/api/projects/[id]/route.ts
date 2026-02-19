// ================================================
// app/api/projects/[id]/route.ts
// ================================================
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongoose";
import Project from "@/models/projects";
import Technology from "@/models/technology";
import type { IProject } from "@/models/projects";
import type { FlattenMaps } from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PROJECT_FOLDER = "products/projects";

type LeanProject = FlattenMaps<IProject> & { _id: string };

async function uploadImageToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: PROJECT_FOLDER, resource_type: "image" },
      (err, result) => {
        if (err || !result)
          return reject(err || new Error("Cloudinary yükleme başarısız."));
        resolve(result.secure_url);
      },
    );
    uploadStream.end(buffer);
  });
}

async function deleteImageFromCloudinary(imageUrl?: string | null) {
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) return;
  try {
    const parts = imageUrl.split("/");
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

function transformProject(project: any) {
  return {
    ...project,
    id: project._id.toString(),
    technologies: Array.isArray(project.technologies)
      ? project.technologies
          .map((tech: any) => {
            if (!tech || !tech._id) return null;
            return {
              id: tech._id.toString(),
              name: tech.name,
              icon: tech.icon,
              type: tech.type,
              yoe: tech.yoe,
              color: tech.color,
            };
          })
          .filter(Boolean)
      : [],
  };
}

// ------------------------- GET -------------------------
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const project = await Project.findById(id).populate("technologies").lean();

    if (!project)
      return NextResponse.json(
        { message: "Proje bulunamadı" },
        { status: 404 },
      );

    return NextResponse.json({ project: transformProject(project) });
  } catch (err) {
    console.error("Proje getirme hatası:", err);
    return NextResponse.json({ message: "Proje alınamadı" }, { status: 500 });
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

    const project = await Project.findById(id).lean<LeanProject>();
    if (!project)
      return NextResponse.json(
        { message: "Proje bulunamadı" },
        { status: 404 },
      );

    // Teknoloji ilişkisini temizle
    await Technology.updateMany({ projects: id }, { $pull: { projects: id } });

    // Cloudinary'den tüm görselleri sil
    await deleteImageFromCloudinary(project.image);
    for (let i = 1; i <= 5; i++) {
      const key = `subImage${i}` as keyof LeanProject;
      await deleteImageFromCloudinary(project[key] as string | null);
    }

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: "Proje ve görseller silindi" });
  } catch (err) {
    console.error("Proje Silme Hatası:", err);
    return NextResponse.json(
      { message: "Proje silinirken hata oluştu" },
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
  const url = formData.get("url") as string;
  const description = formData.get("description") as string;
  const descriptionEng = formData.get("descriptionEng") as string;
  const demoUrl = (formData.get("demoUrl") as string) || null;
  const githubUrl = (formData.get("githubUrl") as string) || null;

  const existingImage = formData.get("existingImage") as string | null;
  const existingSubImages: (string | null)[] = Array(5)
    .fill(null)
    .map((_, i) => formData.get(`existingSubImage${i + 1}`) as string | null);

  const imageFile = formData.get("image") as File | null;
  const subImageFiles: (File | null)[] = Array(5)
    .fill(null)
    .map((_, i) => formData.get(`subImage${i + 1}`) as File | null);

  const technologyIds = formData
    .getAll("technologies")
    .map((t) => t.toString())
    .filter(
      (id) => id && id !== "undefined" && id !== "null" && id.trim() !== "",
    );

  if (!title || !summary || !url || !description)
    return NextResponse.json(
      { message: "Eksik zorunlu alanlar var" },
      { status: 400 },
    );

  if (!existingImage && (!imageFile || imageFile.size === 0))
    return NextResponse.json(
      { message: "Ana görsel zorunludur" },
      { status: 400 },
    );

  try {
    await connectDB();

    const project = await Project.findById(id).lean<LeanProject>();
    if (!project)
      return NextResponse.json(
        { message: "Proje bulunamadı" },
        { status: 404 },
      );

    // Teknoloji ilişkilerini güncelle
    const oldTechIds = (project.technologies as any[]).map((t) => t.toString());
    const removedTechIds = oldTechIds.filter(
      (old) => !technologyIds.includes(old),
    );
    const addedTechIds = technologyIds.filter((n) => !oldTechIds.includes(n));

    if (removedTechIds.length > 0) {
      await Technology.updateMany(
        { _id: { $in: removedTechIds } },
        { $pull: { projects: id } },
      );
    }
    if (addedTechIds.length > 0) {
      await Technology.updateMany(
        { _id: { $in: addedTechIds } },
        { $addToSet: { projects: id } },
      );
    }

    // Ana görsel
    let finalImageUrl: string = existingImage || project.image;
    if (imageFile && imageFile.size > 0) {
      if (project.image) await deleteImageFromCloudinary(project.image);
      finalImageUrl = await uploadImageToCloudinary(imageFile);
    } else if (!existingImage && project.image) {
      await deleteImageFromCloudinary(project.image);
      finalImageUrl = "";
    }

    // Alt görseller
    const finalSubImages: (string | null)[] = [...existingSubImages];
    for (let i = 0; i < 5; i++) {
      const key = `subImage${i + 1}` as keyof LeanProject;
      const oldUrl = project[key] as string | null;
      const newFile = subImageFiles[i];
      if (newFile && newFile.size > 0) {
        if (oldUrl) await deleteImageFromCloudinary(oldUrl);
        finalSubImages[i] = await uploadImageToCloudinary(newFile);
      } else if (!existingSubImages[i] && oldUrl) {
        await deleteImageFromCloudinary(oldUrl);
        finalSubImages[i] = null;
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        titleEng: titleEng || null,
        summary,
        summaryEng: summaryEng || null,
        url,
        description,
        descriptionEng: descriptionEng || null,
        demoUrl: demoUrl || null,
        githubUrl: githubUrl || null,
        image: finalImageUrl,
        subImage1: finalSubImages[0],
        subImage2: finalSubImages[1],
        subImage3: finalSubImages[2],
        subImage4: finalSubImages[3],
        subImage5: finalSubImages[4],
        technologies: technologyIds,
      },
      { new: true },
    )
      .populate("technologies")
      .lean();

    if (!updatedProject) {
      return NextResponse.json(
        { message: "Proje güncellenemedi" },
        { status: 500 },
      );
    }

    return NextResponse.json({ project: transformProject(updatedProject) });
  } catch (err) {
    console.error("Proje Güncelleme Hatası:", err);
    return NextResponse.json(
      { message: "Proje güncellenirken hata oluştu" },
      { status: 500 },
    );
  }
}
