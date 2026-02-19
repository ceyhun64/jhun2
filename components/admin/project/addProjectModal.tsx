"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { AlertTriangle, Check, Upload, X } from "lucide-react";

type Technology = {
  id: string;
  name: string;
  icon: string;
  type: string;
  yoe: number;
  color: string;
};
interface Project {
  id: string;
  title: string;
  titleEng: string | null;
  summary: string;
  summaryEng: string | null;
  image: string;
  description: string;
  descriptionEng: string | null;
  url: string;
  demoUrl: string | null;
  githubUrl: string | null;
  subImage1: string | null;
  subImage2: string | null;
  subImage3: string | null;
  subImage4: string | null;
  subImage5: string | null;
  technologies: Technology[];
}
type FormState = {
  title: string;
  titleEng: string;
  summary: string;
  summaryEng: string;
  url: string;
  description: string;
  descriptionEng: string;
  demoUrl: string;
  githubUrl: string;
};
interface AddProjectsModalProps {
  trigger: React.ReactNode;
  projectToEdit?: Project | null;
  onSuccess: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const initialFormState: FormState = {
  title: "",
  titleEng: "",
  summary: "",
  summaryEng: "",
  url: "",
  description: "",
  descriptionEng: "",
  demoUrl: "",
  githubUrl: "",
};
const REQUIRED_FIELDS: Set<keyof FormState> = new Set([
  "title",
  "summary",
  "url",
  "description",
  "descriptionEng",
]);

const FieldLabel = ({
  label,
  required,
  count,
  max,
  min,
}: {
  label: string;
  required?: boolean;
  count: number;
  max: number;
  min?: number;
}) => (
  <div className="flex items-center justify-between mb-1.5">
    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
      {label}
      {required && <span className="text-violet-400 ml-1">*</span>}
      {min && (
        <span className="text-zinc-700 font-normal ml-1 normal-case">
          ({min}–{max} kar)
        </span>
      )}
    </label>
    <span
      className={`text-[11px] font-mono ${count > max * 0.9 ? "text-orange-400" : "text-zinc-700"}`}
    >
      {count}/{max}
    </span>
  </div>
);

const ImageSlot = ({
  label,
  isMain,
  existingImage,
  newImage,
  onImageChange,
  onDelete,
}: {
  label: string;
  isMain: boolean;
  existingImage: string | null;
  newImage: File | null;
  onImageChange: (f: File | null) => void;
  onDelete: () => void;
}) => {
  const hasImage = existingImage || newImage;
  return (
    <div>
      <label
        className={`relative flex flex-col items-center justify-center h-20 rounded-xl border-2 border-dashed cursor-pointer transition-all text-xs font-medium ${
          hasImage
            ? isMain
              ? "border-violet-500/50 bg-violet-600/8 text-violet-300"
              : "border-emerald-500/30 bg-emerald-600/5 text-emerald-400"
            : "border-white/8 bg-white/[0.015] text-zinc-700 hover:border-zinc-600 hover:text-zinc-500"
        }`}
      >
        {hasImage ? (
          <>
            <Check className="w-4 h-4 mb-0.5" />
            {existingImage ? "Mevcut" : newImage?.name?.slice(0, 12) + "…"}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mb-0.5" />
            {label}
            {isMain && <span className="text-violet-400 ml-0.5">*</span>}
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onImageChange(e.target.files?.[0] || null)}
          onClick={(e) => {
            (e.currentTarget as HTMLInputElement).value = "";
          }}
        />
      </label>
      {hasImage && (
        <button
          type="button"
          onClick={onDelete}
          className="w-full text-[11px] text-red-500/70 hover:text-red-400 mt-1 transition text-center"
        >
          Kaldır
        </button>
      )}
    </div>
  );
};

export default function AddProjectsModal({
  trigger,
  projectToEdit,
  onSuccess,
  open: externalOpen,
  setOpen: setExternalOpen,
}: AddProjectsModalProps) {
  const isEditing = !!projectToEdit;
  const [localOpen, setLocalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : localOpen;
  const setOpen =
    setExternalOpen !== undefined ? setExternalOpen : setLocalOpen;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [subImages, setSubImages] = useState<(File | null)[]>(
    Array(5).fill(null),
  );
  const [existingSubImages, setExistingSubImages] = useState<(string | null)[]>(
    Array(5).fill(null),
  );
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techOptions, setTechOptions] = useState<Technology[]>([]);

  useEffect(() => {
    if (open) {
      if (projectToEdit) {
        setForm({
          title: projectToEdit.title,
          titleEng: projectToEdit.titleEng || "",
          summary: projectToEdit.summary,
          summaryEng: projectToEdit.summaryEng || "",
          url: projectToEdit.url,
          description: projectToEdit.description,
          descriptionEng: projectToEdit.descriptionEng || "",
          demoUrl: projectToEdit.demoUrl || "",
          githubUrl: projectToEdit.githubUrl || "",
        });
        setExistingImage(projectToEdit.image);
        setExistingSubImages([
          projectToEdit.subImage1,
          projectToEdit.subImage2,
          projectToEdit.subImage3,
          projectToEdit.subImage4,
          projectToEdit.subImage5,
        ]);
        setTechnologies(projectToEdit.technologies.map((t) => t.id));
      } else {
        setForm(initialFormState);
        setExistingImage(null);
        setExistingSubImages(Array(5).fill(null));
        setTechnologies([]);
      }
      setImage(null);
      setSubImages(Array(5).fill(null));
    }
  }, [projectToEdit, open]);

  useEffect(() => {
    fetch("/api/technology")
      .then((r) => r.json())
      .then((d) => setTechOptions(d.technologies || []))
      .catch(console.error);
  }, []);

  const handleMainImageChange = useCallback((file: File | null) => {
    setImage(file);
    if (file) setExistingImage(null);
  }, []);
  const handleDeleteMainImage = useCallback(() => {
    setExistingImage(null);
    setImage(null);
  }, []);
  const handleSubImageChange = useCallback((idx: number, file: File | null) => {
    setSubImages((p) => {
      const u = [...p];
      u[idx] = file;
      return u;
    });
    if (file)
      setExistingSubImages((p) => {
        const u = [...p];
        u[idx] = null;
        return u;
      });
  }, []);
  const handleDeleteSubImage = useCallback((idx: number) => {
    setExistingSubImages((p) => {
      const u = [...p];
      u[idx] = null;
      return u;
    });
    setSubImages((p) => {
      const u = [...p];
      u[idx] = null;
      return u;
    });
  }, []);

  const handleTechToggle = (id: string) =>
    setTechnologies((p) =>
      p.includes(id) ? p.filter((t) => t !== id) : [...p, id],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, summary, url, description, descriptionEng } = form;
    if (!title || !summary || !url || !description || !descriptionEng) {
      toast.error("Zorunlu alanları doldurun.");
      return;
    }
    if (description.length < 750 || descriptionEng.length < 750) {
      toast.error("Açıklama alanları en az 750 karakter olmalıdır.");
      return;
    }
    if (!existingImage && !image) {
      toast.error("Ana görseli yükleyin.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      technologies.forEach((id) => formData.append("technologies", id));
      if (existingImage) formData.append("existingImage", existingImage);
      existingSubImages.forEach(
        (img, idx) => img && formData.append(`existingSubImage${idx + 1}`, img),
      );
      if (image) formData.append("image", image);
      subImages.forEach(
        (img, idx) => img && formData.append(`subImage${idx + 1}`, img),
      );
      const res = await fetch(
        isEditing ? `/api/projects/${projectToEdit!.id}` : "/api/projects",
        {
          method: isEditing ? "PUT" : "POST",
          body: formData,
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`Proje ${isEditing ? "güncellendi" : "eklendi"}!`);
      setOpen(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    name: keyof FormState,
    maxLength: number,
    minLength = 0,
    isTextarea = false,
  ) => {
    const value = form[name];
    const isRequired = REQUIRED_FIELDS.has(name);
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const val = e.target.value;
      if (val.length <= maxLength) setForm((p) => ({ ...p, [name]: val }));
    };
    const base =
      "w-full bg-white/3 border border-white/8 text-white text-sm placeholder-zinc-700 rounded-xl px-4 focus:outline-none focus:border-violet-500/60 transition resize-none";
    return (
      <div>
        <FieldLabel
          label={label}
          required={isRequired}
          count={value.length}
          max={maxLength}
          min={minLength > 0 ? minLength : undefined}
        />
        {isTextarea ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={label}
            maxLength={maxLength}
            rows={5}
            className={`${base} py-3`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={label}
            maxLength={maxLength}
            className={`${base} py-2.5`}
          />
        )}
        {minLength > 0 && value.length < minLength && value.length > 0 && (
          <p className="text-[11px] text-orange-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> En az {minLength} karakter
            gerekli
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl w-full bg-[#0e0e14] border border-white/8 text-white rounded-2xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-7 py-5 border-b border-white/5 flex-shrink-0">
          <DialogTitle className="text-base font-bold">
            {isEditing ? "Proje Düzenle" : "Yeni Proje Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-7 py-6 space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {renderField("Başlık", "title", 30)}
            {renderField("Başlık (İngilizce)", "titleEng", 30)}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {renderField("Özet", "summary", 82)}
            {renderField("Özet (İngilizce)", "summaryEng", 82)}
          </div>
          {renderField("Açıklama", "description", 800, 750, true)}
          {renderField(
            "Açıklama (İngilizce)",
            "descriptionEng",
            800,
            750,
            true,
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {renderField("GitHub URL", "githubUrl", 255)}
            {renderField("Demo URL", "demoUrl", 255)}
          </div>
          {renderField("Proje URL", "url", 255)}

          {/* Technologies */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Teknolojiler
              {technologies.length > 0 && (
                <span className="text-violet-400 ml-2 normal-case font-bold">
                  {technologies.length} seçili
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {techOptions.map((tech) => {
                const isSelected = technologies.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => handleTechToggle(tech.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-violet-600/20 text-violet-300 border-violet-500/30"
                        : "bg-white/3 text-zinc-500 border-white/6 hover:border-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Görseller{" "}
              <span className="text-zinc-700 normal-case font-normal ml-1">
                (Ana görsel zorunlu, alt görseller opsiyonel)
              </span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <ImageSlot
                label="Ana Görsel"
                isMain
                existingImage={existingImage}
                newImage={image}
                onImageChange={handleMainImageChange}
                onDelete={handleDeleteMainImage}
              />
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <ImageSlot
                    key={idx}
                    label={`Alt ${idx + 1}`}
                    isMain={false}
                    existingImage={existingSubImages[idx]}
                    newImage={subImages[idx]}
                    onImageChange={(file) => handleSubImageChange(idx, file)}
                    onDelete={() => handleDeleteSubImage(idx)}
                  />
                ))}
            </div>
          </div>
        </form>

        <div className="px-7 py-5 border-t border-white/5 flex justify-end gap-2.5 flex-shrink-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-white/8 text-zinc-400 hover:bg-white/5 bg-transparent rounded-xl px-5"
            >
              İptal
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e as any)}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 rounded-xl px-5 font-semibold"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isEditing ? (
              "Güncelle"
            ) : (
              "Proje Ekle"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
