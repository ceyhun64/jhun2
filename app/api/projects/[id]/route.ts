// app/api/projects/[id]/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PROJECT_FOLDER = "products/projeler";

async function uploadImageToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: PROJECT_FOLDER, resource_type: "image" },
      (err, result) => {
        if (err || !result)
          return reject(err || new Error("Cloudinary yükleme başarısız."));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

async function deleteImageFromCloudinary(imageUrl?: string | null) {
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) return;
  try {
    const parts = imageUrl.split("/");
    const publicIdWithExtension = parts.slice(-2).join("/");
    const publicId = publicIdWithExtension.substring(
      0,
      publicIdWithExtension.lastIndexOf(".")
    );
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.warn(`Cloudinary silme hatası: ${imageUrl}`, err);
  }
}

// ------------------------- GET -------------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { technologies: { include: { technology: true } } }, // join ile tech bilgisi
  });

  if (!project)
    return NextResponse.json({ message: "Proje bulunamadı" }, { status: 404 });

  // Tüm technology objularını dön
  const result = {
    ...project,
    technologies: project.technologies.map((pt) => {
      const tech = pt.technology;
      return {
        _id: tech.id,
        name: tech.name,
        icon: tech.icon,
        type: tech.type,
        yoe: tech.yoe,
        color: tech.color,
      };
    }),
  };

  return NextResponse.json({ project: result });
}

// ------------------------- DELETE -------------------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project)
      return NextResponse.json(
        { message: "Proje bulunamadı" },
        { status: 404 }
      );

    await deleteImageFromCloudinary(project.image);
    for (let i = 1; i <= 5; i++)
      await deleteImageFromCloudinary(
        project[`subImage${i}` as keyof typeof project] as string | null
      );

    // Join tabloları sil
    await prisma.projectTechnology.deleteMany({ where: { projectId: id } });

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Proje ve görseller silindi" });
  } catch (err) {
    console.error("Proje Silme Hatası:", err);
    return NextResponse.json(
      { message: "Proje silinirken hata oluştu" },
      { status: 500 }
    );
  }
}

// ------------------------- PUT -------------------------
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const url = formData.get("url") as string;
  const description = formData.get("description") as string;
  const demoUrl = (formData.get("demoUrl") || null) as string | null;
  const githubUrl = (formData.get("githubUrl") || null) as string | null;

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
    .map((t) => t.toString());

  if (!title || !summary || !url || !description)
    return NextResponse.json(
      { message: "Eksik zorunlu alanlar var" },
      { status: 400 }
    );

  if (!existingImage && (!imageFile || imageFile.size === 0))
    return NextResponse.json(
      { message: "Ana görsel zorunludur" },
      { status: 400 }
    );

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project)
      return NextResponse.json(
        { message: "Proje bulunamadı" },
        { status: 404 }
      );

    // Ana görsel
    let finalImageUrl: string | null = existingImage;
    if (imageFile && imageFile.size > 0) {
      if (project.image) await deleteImageFromCloudinary(project.image);
      finalImageUrl = await uploadImageToCloudinary(imageFile);
    } else if (!existingImage && project.image) {
      await deleteImageFromCloudinary(project.image);
      finalImageUrl = null;
    }

    // Alt görseller
    const finalSubImages: (string | null)[] = [...existingSubImages];
    for (let i = 0; i < 5; i++) {
      const oldUrl = project[`subImage${i + 1}` as keyof typeof project] as
        | string
        | null;
      const newFile = subImageFiles[i];
      if (newFile && newFile.size > 0) {
        if (oldUrl) await deleteImageFromCloudinary(oldUrl);
        finalSubImages[i] = await uploadImageToCloudinary(newFile);
      } else if (!existingSubImages[i] && oldUrl) {
        await deleteImageFromCloudinary(oldUrl);
        finalSubImages[i] = null;
      }
    }

    // 1️⃣ Project update
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        summary,
        url,
        description,
        demoUrl,
        githubUrl,
        image: finalImageUrl ?? project.image,
        subImage1: finalSubImages[0],
        subImage2: finalSubImages[1],
        subImage3: finalSubImages[2],
        subImage4: finalSubImages[3],
        subImage5: finalSubImages[4],
      },
    });

    // 2️⃣ Join table: önce sil
    await prisma.projectTechnology.deleteMany({ where: { projectId: id } });

    // 3️⃣ Yeni ilişkileri ekle (MongoDB için safe)
    for (const techId of technologyIds) {
      await prisma.projectTechnology.create({
        data: { projectId: id, technologyId: techId },
      });
    }

    // 4️⃣ Güncel project ve teknolojiler
    const projectWithTech = await prisma.project.findUnique({
      where: { id },
      include: { technologies: { include: { technology: true } } },
    });

    const result = projectWithTech
      ? {
          ...projectWithTech,
          technologies: projectWithTech.technologies.map(
            (pt: { technology: { id: string; name: string } }) => pt.technology
          ),
        }
      : null;

    return NextResponse.json({ project: result });
  } catch (err) {
    console.error("Proje Güncelleme Hatası:", err);
    return NextResponse.json(
      { message: "Proje güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}
