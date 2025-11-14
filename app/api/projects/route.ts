// app/api/projects/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { NextRequest } from "next/server";

// MongoDB için tipler
type ProjectWithTech = {
  id: string;
  title: string;
  summary: string;
  url: string;
  description: string;
  image: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  subImage1?: string | null;
  subImage2?: string | null;
  subImage3?: string | null;
  subImage4?: string | null;
  subImage5?: string | null;
  createdAt: Date;
  updatedAt: Date;
  technologies: {
    id: string;
    name: string;
    icon: string;
    type: string;
    yoe: number;
    color: string;
  }[];
};

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        technologies: {
          include: { technology: true }, // join table üzerinden teknolojileri al
        },
      },
    });

    // Frontend için technologies array’ini düzleştir
    const result: ProjectWithTech[] = projects.map((project) => ({
      ...project,
      technologies: project.technologies.map((pt) => pt.technology),
    }));

    return NextResponse.json({ projects: result });
  } catch (err) {
    console.error("Projeler alınamadı:", err);
    return NextResponse.json(
      { message: "Projeler alınamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log("formData:", formData);
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const url = formData.get("url") as string;
    const image = formData.get("image") as File | null;
    const description = formData.get("description") as string;
    const demoUrl = (formData.get("demoUrl") || null) as string | null;
    const githubUrl = (formData.get("githubUrl") || null) as string | null;

    const subImage1 = formData.get("subImage1") as File | null;
    const subImage2 = formData.get("subImage2") as File | null;
    const subImage3 = formData.get("subImage3") as File | null;
    const subImage4 = formData.get("subImage4") as File | null;
    const subImage5 = formData.get("subImage5") as File | null;

    const technologyIds = formData
      .getAll("technologies")
      .map((t) => t.toString());

    if (!title || !summary || !url || !image || !description) {
      return NextResponse.json(
        { message: "Başlık, özet, url, açıklama ve ana resim zorunludur." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    async function uploadFile(file: File | null) {
      if (!file) return null;

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("folderName", "projects");

      const uploadRes = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.path)
        throw new Error("Dosya yükleme başarısız");

      return uploadData.path as string;
    }

    const imagePath = await uploadFile(image);
    const subImagePaths = await Promise.all([
      uploadFile(subImage1),
      uploadFile(subImage2),
      uploadFile(subImage3),
      uploadFile(subImage4),
      uploadFile(subImage5),
    ]);

    const project = await prisma.project.create({
      data: {
        title,
        summary,
        url,
        image: imagePath!,
        description,
        demoUrl,
        githubUrl,
        subImage1: subImagePaths[0],
        subImage2: subImagePaths[1],
        subImage3: subImagePaths[2],
        subImage4: subImagePaths[3],
        subImage5: subImagePaths[4],
      },
    });

    if (technologyIds.length > 0) {
      const projectTechnologies = technologyIds.map((techId) => ({
        projectId: project.id,
        technologyId: techId,
      }));

      await prisma.projectTechnology.createMany({
        data: projectTechnologies,
      });
    }

    const projectWithTech = await prisma.project.findUnique({
      where: { id: project.id },
      include: { technologies: { include: { technology: true } } },
    });

    const result: ProjectWithTech | null = projectWithTech
      ? {
          ...projectWithTech,
          technologies: projectWithTech.technologies.map((pt) => pt.technology),
        }
      : null;

    return NextResponse.json({ project: result }, { status: 201 });
  } catch (err) {
    console.error("Proje oluşturulurken hata:", err);
    return NextResponse.json(
      { message: "Proje oluşturulamadı." },
      { status: 500 }
    );
  }
}
