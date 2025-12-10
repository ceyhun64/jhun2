// ================================================
// app/api/projects/route.ts
// ================================================
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/models/projects";
import Technology from "@/models/technology";

type ProjectWithTech = {
  id: string;
  title: string;
  titleEng: string | null;
  summary: string;
  summaryEng: string | null;
  url: string;
  description: string;
  descriptionEng: string | null;
  image: string;
  demoUrl: string | null;
  githubUrl: string | null;
  subImage1: string | null;
  subImage2: string | null;
  subImage3: string | null;
  subImage4: string | null;
  subImage5: string | null;
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
    await connectDB();

    // ✅ Teknolojileri populate et
    const projects = await Project.find({})
      .sort({ createdAt: -1 })
      .populate("technologies")
      .lean();

    console.log("Projeler:", projects);

    const transformedProjects: ProjectWithTech[] = projects.map(
      (project: any) => ({
        id: project._id.toString(),
        title: project.title,
        titleEng: project.titleEng || null,
        summary: project.summary,
        summaryEng: project.summaryEng || null,
        url: project.url,
        description: project.description,
        descriptionEng: project.descriptionEng || null,
        image: project.image,
        demoUrl: project.demoUrl || null,
        githubUrl: project.githubUrl || null,
        subImage1: project.subImage1 || null,
        subImage2: project.subImage2 || null,
        subImage3: project.subImage3 || null,
        subImage4: project.subImage4 || null,
        subImage5: project.subImage5 || null,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
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
      })
    );

    return NextResponse.json({ projects: transformedProjects });
  } catch (err) {
    console.error("Projeler alınamadı:", err);
    return NextResponse.json(
      {
        message: "Projeler alınamadı.",
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
    console.log("formData:", formData);

    const title = formData.get("title") as string;
    const titleEng = formData.get("titleEng") as string;
    const summary = formData.get("summary") as string;
    const summaryEng = formData.get("summaryEng") as string;
    const url = formData.get("url") as string;
    const image = formData.get("image") as File | null;
    const description = formData.get("description") as string;
    const descriptionEng = formData.get("descriptionEng") as string;
    const demoUrl = (formData.get("demoUrl") || null) as string | null;
    const githubUrl = (formData.get("githubUrl") || null) as string | null;

    const subImage1 = formData.get("subImage1") as File | null;
    const subImage2 = formData.get("subImage2") as File | null;
    const subImage3 = formData.get("subImage3") as File | null;
    const subImage4 = formData.get("subImage4") as File | null;
    const subImage5 = formData.get("subImage5") as File | null;

    const technologyIds = formData
      .getAll("technologies")
      .map((t) => t.toString())
      .filter(
        (id) => id && id !== "undefined" && id !== "null" && id.trim() !== ""
      );

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

    // ✅ Proje oluştur
    const project = await Project.create({
      title,
      titleEng,
      summary,
      summaryEng,
      url,
      image: imagePath!,
      description,
      descriptionEng,
      demoUrl,
      githubUrl,
      subImage1: subImagePaths[0],
      subImage2: subImagePaths[1],
      subImage3: subImagePaths[2],
      subImage4: subImagePaths[3],
      subImage5: subImagePaths[4],
      technologies: technologyIds,
    });

    // ✅ ÇOK ÖNEMLİ: İlişkiyi diğer tarafta da güncelle
    if (technologyIds.length > 0) {
      await Technology.updateMany(
        { _id: { $in: technologyIds } },
        { $addToSet: { projects: project._id } }
      );
    }

    const projectWithTech = await Project.findById(project._id)
      .populate("technologies")
      .lean();

    const result: ProjectWithTech | null = projectWithTech
      ? {
          id: projectWithTech._id.toString(),
          title: projectWithTech.title,
          titleEng: projectWithTech.titleEng || null,
          summary: projectWithTech.summary,
          summaryEng: projectWithTech.summaryEng || null,
          url: projectWithTech.url,
          description: projectWithTech.description,
          descriptionEng: projectWithTech.descriptionEng || null,
          image: projectWithTech.image,
          demoUrl: projectWithTech.demoUrl || null,
          githubUrl: projectWithTech.githubUrl || null,
          subImage1: projectWithTech.subImage1 || null,
          subImage2: projectWithTech.subImage2 || null,
          subImage3: projectWithTech.subImage3 || null,
          subImage4: projectWithTech.subImage4 || null,
          subImage5: projectWithTech.subImage5 || null,
          createdAt: projectWithTech.createdAt,
          updatedAt: projectWithTech.updatedAt,
          technologies: Array.isArray(projectWithTech.technologies)
            ? projectWithTech.technologies.map((tech: any) => ({
                id: tech._id.toString(),
                name: tech.name,
                icon: tech.icon,
                type: tech.type,
                yoe: tech.yoe,
                color: tech.color,
              }))
            : [],
        }
      : null;

    return NextResponse.json({ project: result }, { status: 201 });
  } catch (err) {
    console.error("Proje oluşturulurken hata:", err);
    return NextResponse.json(
      {
        message: "Proje oluşturulamadı.",
        error: err instanceof Error ? err.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
