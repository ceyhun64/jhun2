// addProjectModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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

// Proje tiplerini Projects dosyasından alıyoruz
type Technology = {
  id: number;
  name: string;
};

type Project = {
  id: number;
  title: string;
  summary: string;
  image: string; // URL veya dosya adı olabilir
  description: string;
  url: string;
  demoUrl?: string;
  githubUrl?: string;
  subImage1?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
  subImage5?: string;
  technologies: Technology[];
};

type FormState = {
  title: string;
  summary: string;
  url: string;
  description: string;
  demoUrl: string;
  githubUrl: string;
};

interface AddProjectsModalProps {
  trigger: React.ReactNode; // Modal açma butonu veya elementi
  projectToEdit?: Project | null; // Düzenlenecek proje (opsiyonel)
  onSuccess: () => void; // Başarılı işlem sonrası çağrılacak fonksiyon
}

const initialFormState: FormState = {
  title: "",
  summary: "",
  url: "",
  description: "",
  demoUrl: "",
  githubUrl: "",
};

export default function AddProjectsModal({
  trigger,
  projectToEdit,
  onSuccess,
}: AddProjectsModalProps) {
  const isEditing = !!projectToEdit;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [image, setImage] = useState<File | null>(null); // Yeni ana görsel dosyası
  const [existingImage, setExistingImage] = useState<string | null>(null); // Mevcut ana görsel URL'si
  const [subImages, setSubImages] = useState<(File | null)[]>(
    Array(5).fill(null) // Yeni alt görsel dosyaları
  );
  const [existingSubImages, setExistingSubImages] = useState<(string | null)[]>(
    Array(5).fill(null) // Mevcut alt görsel URL'leri
  );
  const [technologies, setTechnologies] = useState<number[]>([]);
  const [techOptions, setTechOptions] = useState<Technology[]>([]);

  // Proje verileri değiştiğinde form state'ini sıfırlama/doldurma
  useEffect(() => {
    if (projectToEdit) {
      setForm({
        title: projectToEdit.title,
        summary: projectToEdit.summary,
        url: projectToEdit.url,
        description: projectToEdit.description,
        demoUrl: projectToEdit.demoUrl || "",
        githubUrl: projectToEdit.githubUrl || "",
      });
      setExistingImage(projectToEdit.image);
      setExistingSubImages([
        projectToEdit.subImage1 || null,
        projectToEdit.subImage2 || null,
        projectToEdit.subImage3 || null,
        projectToEdit.subImage4 || null,
        projectToEdit.subImage5 || null,
      ]);
      setTechnologies(projectToEdit.technologies.map((t) => t.id));
    } else {
      setForm(initialFormState);
      setExistingImage(null);
      setExistingSubImages(Array(5).fill(null));
      setTechnologies([]);
    }
    // Ayrıca dosya state'lerini de sıfırla, düzenleme modunda bile yeni dosya yüklenmediği sürece `null` olmalı
    setImage(null);
    setSubImages(Array(5).fill(null));
  }, [projectToEdit, open]); // open değiştiğinde de state'i sıfırlıyoruz/dolduruyoruz

  // Teknoloji seçeneklerini yükleme
  useEffect(() => {
    fetch("/api/technology")
      .then((res) => res.json())
      .then((data) => setTechOptions(data.technologies || []))
      .catch((err) => console.error("Teknolojiler yüklenemedi:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // Mevcut görseli koru veya yeni görseli set et
  const handleImageChange = (index: number, file: File | null) => {
    if (index === -1) {
      setImage(file);
      if (file) setExistingImage(null); // Yeni dosya seçilirse mevcut URL'yi sil
    } else {
      const updated = [...subImages];
      updated[index] = file;
      setSubImages(updated);
      if (file) {
        // Yeni dosya seçilirse mevcut URL'yi sil
        const updatedExisting = [...existingSubImages];
        updatedExisting[index] = null;
        setExistingSubImages(updatedExisting);
      }
    }
  };

  // Mevcut görseli URL'sinden tamamen silme (düzenleme modunda)
  const handleDeleteExistingImage = (index: number) => {
    if (index === -1) {
      setExistingImage(null);
      setImage(null);
    } else {
      const updatedExisting = [...existingSubImages];
      updatedExisting[index] = null;
      setExistingSubImages(updatedExisting);
      const updatedNew = [...subImages];
      updatedNew[index] = null;
      setSubImages(updatedNew);
    }
  };

  const handleTechnologyToggle = (id: number) => {
    setTechnologies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zorunlu alan kontrolü
    if (
      !form.title ||
      !form.summary ||
      !form.url ||
      !form.description ||
      (!isEditing && !image) // Yeni projede ana görsel zorunlu
    ) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }

    // Açıklama karakter limiti kontrolü
    if (form.description.length < 750) {
      toast.error("Açıklama en az 750 karakter olmalı.");
      return;
    }

    // Düzenleme modunda mevcut görsel yoksa ve yeni görsel yüklenmemişse hata ver
    if (isEditing && !existingImage && !image) {
      toast.error("Lütfen ana görseli yükleyin.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      technologies.forEach((id) => formData.append("technologies", String(id)));

      // Mevcut URL'leri de FormData'ya ekle
      if (existingImage) formData.append("existingImage", existingImage);
      existingSubImages.forEach(
        (img, idx) => img && formData.append(`existingSubImage${idx + 1}`, img)
      );

      // Yeni yüklenen dosyaları ekle
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
      if (!res.ok)
        throw new Error(
          data.message ||
            `${isEditing ? "Proje güncellenemedi" : "Proje eklenemedi"}`
        );

      toast.success(
        `Proje başarıyla ${isEditing ? "güncellendi" : "eklendi"}!`
      );

      // Formu sıfırla/kapat
      setOpen(false);
      onSuccess(); // Projeleri yeniden yükleme tetikleyicisi
    } catch (err) {
      console.error(err);
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const dialogTitle = isEditing ? "Proje Düzenle" : "Yeni Proje Ekle";
  const submitButtonText = isEditing ? "Güncelle" : "Proje Ekle";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl w-full bg-neutral-900 text-white rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-2 overflow-y-auto max-h-[80vh]"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* Başlık */}
            <div>
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 30) {
                    setForm({ ...form, title: value });
                  } else {
                    toast.error("Başlık en fazla 30 karakter olabilir.");
                  }
                }}
                className="bg-neutral-800 border-neutral-700 text-white mt-1"
                placeholder="Proje başlığı"
                maxLength={30}
              />
              <p className="text-xs text-neutral-400 mt-1">
                {form.title.length}/30 karakter
              </p>
            </div>

            {/* Proje URL */}
            <div>
              <Label htmlFor="url">Proje URL *</Label>
              <Input
                id="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                className="bg-neutral-800 border-neutral-700 text-white mt-1"
                placeholder="Proje URL'si"
              />
            </div>
          </div>

          {/* Özet */}
          <div>
            <Label htmlFor="summary">Özet *</Label>
            <Input
              id="summary"
              name="summary"
              value={form.summary}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 82) {
                  setForm({ ...form, summary: value });
                } else {
                  toast.error("Özet en fazla 82 karakter olabilir.");
                }
              }}
              className="bg-neutral-800 border-neutral-700 text-white mt-1"
              placeholder="Kısa açıklama"
              maxLength={82}
            />
            <p className="text-xs text-neutral-400 mt-1">
              {form.summary.length}/82 karakter
            </p>
          </div>

          {/* Açıklama */}
          <div>
            <Label htmlFor="description">Açıklama * (750-800 karakter)</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 800) {
                  setForm({ ...form, description: value });
                } else {
                  toast.error("Açıklama en fazla 800 karakter olabilir.");
                }
              }}
              className="bg-neutral-800 border-neutral-700 text-white min-h-[120px] mt-1"
              placeholder="Projeyi açıklayın"
              maxLength={800}
            />
            <p className="text-xs text-neutral-400 mt-1">
              {form.description.length}/800 karakter
            </p>
            {form.description.length < 750 && (
              <p className="text-xs text-red-400 mt-1">
                Açıklama en az 750 karakter olmalı.
              </p>
            )}
          </div>

          {/* Opsiyonel URL'ler */}
          <div className="grid md:grid-cols-2 gap-4">
            {["demoUrl", "githubUrl"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field}</Label>
                <Input
                  id={field}
                  name={field}
                  value={form[field as keyof FormState]}
                  onChange={handleChange}
                  className="bg-neutral-800 border-neutral-700 text-white mt-1"
                  placeholder={`${field} (isteğe bağlı)`}
                />
              </div>
            ))}
          </div>

          {/* Görseller */}
          <div>
            <Label>Görseller *</Label>
            <div className="grid md:grid-cols-3 gap-4 mt-1">
              {/* Ana Görsel */}
              <div className="flex flex-col">
                <label
                  className={`cursor-pointer border text-center py-2 rounded transition-colors ${
                    existingImage || image
                      ? "bg-neutral-700 border-green-500"
                      : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                  }`}
                >
                  {existingImage
                    ? "Ana Görsel (Mevcut)"
                    : image
                    ? image.name
                    : "Ana Görsel Yükle"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageChange(-1, e.target.files?.[0] || null)
                    }
                    onClick={(e) => {
                      if (existingImage && !isEditing) {
                        // Sadece ekleme modunda butona basınca eski resim varsa temizle
                        e.preventDefault();
                      }
                      e.currentTarget.value = ""; // Aynı dosyayı tekrar seçebilmek için
                    }}
                  />
                </label>
                {(existingImage || image) && isEditing && (
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(-1)}
                    className="text-xs text-red-400 mt-1 hover:text-red-500"
                  >
                    Görseli Kaldır
                  </button>
                )}
              </div>

              {/* Alt Görseller (Maks. 5 adet) */}
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="flex flex-col">
                    <label
                      className={`cursor-pointer border text-center py-2 rounded transition-colors ${
                        existingSubImages[idx] || subImages[idx]
                          ? "bg-neutral-700 border-yellow-500"
                          : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                      }`}
                    >
                      {existingSubImages[idx]
                        ? `Alt Görsel ${idx + 1} (Mevcut)`
                        : subImages[idx]
                        ? subImages[idx]!.name
                        : `Alt Görsel ${idx + 1} Yükle`}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(idx, e.target.files?.[0] || null)
                        }
                        onClick={(e) => {
                          e.currentTarget.value = ""; // Aynı dosyayı tekrar seçebilmek için
                        }}
                      />
                    </label>
                    {(existingSubImages[idx] || subImages[idx]) &&
                      isEditing && (
                        <button
                          type="button"
                          onClick={() => handleDeleteExistingImage(idx)}
                          className="text-xs text-red-400 mt-1 hover:text-red-500"
                        >
                          Görseli Kaldır
                        </button>
                      )}
                  </div>
                ))}
            </div>
          </div>

          {/* Teknolojiler */}
          <div>
            <Label>Teknolojiler</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {techOptions.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleTechnologyToggle(tech.id)}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    technologies.includes(tech.id)
                      ? "bg-blue-600 border-blue-500"
                      : "bg-neutral-800 border-neutral-700"
                  }`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                İptal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
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
