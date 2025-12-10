// addProjectModal.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface ImageInputProps {
  index: number;
  label: string;
  existingImage: string | null;
  newImage: File | null;
  onImageChange: (file: File | null) => void;
  onDeleteExisting: () => void;
  isEditing: boolean;
}

const ImageInput = ({
  index,
  label,
  existingImage,
  newImage,
  onImageChange,
  onDeleteExisting,
  isEditing,
}: ImageInputProps) => {
  const isSelected = existingImage || newImage;
  const isMainImage = index === -1;
  const bgColor = isSelected
    ? isMainImage
      ? "bg-green-700 border-green-500"
      : "bg-yellow-700 border-yellow-500"
    : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700";

  return (
    <div className="flex flex-col">
      <label
        className={`cursor-pointer border text-center py-3 px-2 rounded-lg transition-all duration-200 ${bgColor}`}
      >
        {existingImage
          ? `${label} (Mevcut)`
          : newImage
          ? newImage.name.length > 20
            ? newImage.name.substring(0, 20) + "..."
            : newImage.name
          : `${label} Yükle${isMainImage ? " *" : ""}`}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onImageChange(e.target.files?.[0] || null)}
          onClick={(e) => {
            e.currentTarget.value = "";
          }}
        />
      </label>
      {isSelected && (
        <button
          type="button"
          onClick={onDeleteExisting}
          className="text-xs text-red-400 mt-2 hover:text-red-500 transition"
        >
          Görseli Kaldır
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
    Array(5).fill(null)
  );
  const [existingSubImages, setExistingSubImages] = useState<(string | null)[]>(
    Array(5).fill(null)
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
      .then((res) => res.json())
      .then((data) => {
        setTechOptions(data.technologies || []);
      })
      .catch((err) => console.error("Teknolojiler yüklenemedi:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMainImageChange = useCallback((file: File | null) => {
    setImage(file);
    if (file) setExistingImage(null);
  }, []);

  const handleDeleteMainImage = useCallback(() => {
    setExistingImage(null);
    setImage(null);
  }, []);

  const handleSubImageChange = useCallback(
    (index: number, file: File | null) => {
      const updated = [...subImages];
      updated[index] = file;
      setSubImages(updated);
      if (file) {
        const updatedExisting = [...existingSubImages];
        updatedExisting[index] = null;
        setExistingSubImages(updatedExisting);
      }
    },
    [subImages, existingSubImages]
  );

  const handleDeleteExistingSubImage = useCallback(
    (index: number) => {
      const updatedExisting = [...existingSubImages];
      updatedExisting[index] = null;
      setExistingSubImages(updatedExisting);
      const updatedNew = [...subImages];
      updatedNew[index] = null;
      setSubImages(updatedNew);
    },
    [existingSubImages, subImages]
  );

  const handleTechnologyToggle = (id: string) => {
    setTechnologies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, summary, url, description, descriptionEng } = form;

    if (!title || !summary || !url || !description || !descriptionEng) {
      toast.error("Lütfen tüm zorunlu (*) alanları doldurun.");
      return;
    }

    if (description.length < 750 || descriptionEng.length < 750) {
      toast.error("Açıklama alanları en az 750 karakter olmalıdır.");
      return;
    }

    if (!existingImage && !image) {
      toast.error("Lütfen ana görseli yükleyin.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      technologies.forEach((id) => formData.append("technologies", id));

      if (existingImage) formData.append("existingImage", existingImage);
      existingSubImages.forEach(
        (img, idx) => img && formData.append(`existingSubImage${idx + 1}`, img)
      );

      if (image) formData.append("image", image);
      subImages.forEach(
        (img, idx) => img && formData.append(`subImage${idx + 1}`, img)
      );

      const apiUrl = isEditing
        ? `/api/projects/${projectToEdit!.id}`
        : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(apiUrl, {
        method,
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            `${isEditing ? "Proje güncellenemedi" : "Proje eklenemedi"}`
        );
      }

      toast.success(
        `Proje başarıyla ${isEditing ? "güncellendi" : "eklendi"}!`
      );
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    name: keyof FormState,
    maxLength: number,
    minLength: number = 0,
    isTextarea: boolean = false
  ) => {
    const value = form[name];

    const handleFieldChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const val = e.target.value;
      if (val.length <= maxLength) {
        setForm({ ...form, [name]: val });
      } else {
        toast.error(`${label} en fazla ${maxLength} karakter olabilir.`);
      }
    };

    const Component = isTextarea ? Textarea : Input;
    const rows = isTextarea ? 5 : undefined;

    return (
      <div>
        <Label htmlFor={name} className="text-sm font-medium">
          {label} * {minLength > 0 && `(${minLength}-${maxLength} karakter)`}
        </Label>
        <Component
          id={name}
          name={name}
          value={value}
          onChange={handleFieldChange}
          className="bg-neutral-800 border-neutral-700 text-white mt-1"
          placeholder={label}
          maxLength={maxLength}
          rows={rows}
        />
        <p className="text-xs text-neutral-400 mt-1">
          {value.length}/{maxLength} karakter
        </p>
        {minLength > 0 && value.length < minLength && value.length > 0 && (
          <p className="text-xs text-red-400 mt-1">
            {label.split("(")[0].trim()} en az {minLength} karakter olmalı.
          </p>
        )}
      </div>
    );
  };

  const dialogTitle = isEditing ? "Proje Düzenle" : "Yeni Proje Ekle";
  const submitButtonText = isEditing ? "Güncelle" : "Proje Ekle";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full bg-neutral-900 text-white rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
            true
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {renderField("GitHub URL (Opsiyonel)", "githubUrl", 255)}
            {renderField("Demo URL (Opsiyonel)", "demoUrl", 255)}
          </div>

          {renderField("Proje URL", "url", 255)}

          <div>
            <Label className="text-lg font-semibold mb-2 block">
              Görseller
            </Label>
            <p className="text-xs text-neutral-400 mb-3">
              Ana görsel zorunludur. Alt görseller opsiyoneldir.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <ImageInput
                index={-1}
                label="Ana Görsel"
                existingImage={existingImage}
                newImage={image}
                onImageChange={handleMainImageChange}
                onDeleteExisting={handleDeleteMainImage}
                isEditing={isEditing}
              />

              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <ImageInput
                    key={idx}
                    index={idx}
                    label={`Alt Görsel ${idx + 1}`}
                    existingImage={existingSubImages[idx]}
                    newImage={subImages[idx]}
                    onImageChange={(file) => handleSubImageChange(idx, file)}
                    onDeleteExisting={() => handleDeleteExistingSubImage(idx)}
                    isEditing={isEditing}
                  />
                ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-2 block">
              Teknolojiler
            </Label>
            <div className="flex flex-wrap gap-2">
              {techOptions.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleTechnologyToggle(tech.id)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    technologies.includes(tech.id)
                      ? "bg-blue-600 border-blue-500 hover:bg-blue-700"
                      : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                  }`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-neutral-700 hover:bg-neutral-800"
              >
                İptal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading
                ? `${isEditing ? "Güncelleniyor..." : "Kaydediliyor..."}`
                : submitButtonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
