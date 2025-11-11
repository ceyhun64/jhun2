"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./sidebar";
import { toast } from "sonner";

type Technology = {
  id: number;
  name: string;
};

type FormState = {
  title: string;
  summary: string;
  url: string;
  description: string;
  demoUrl: string;
  githubUrl: string;
};

export default function Projects() {
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    summary: "",
    url: "",
    description: "",
    demoUrl: "",
    githubUrl: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<(File | null)[]>(
    Array(5).fill(null)
  );
  const [technologies, setTechnologies] = useState<number[]>([]);
  const [techOptions, setTechOptions] = useState<Technology[]>([]);

  // Teknolojileri API'den çek
  useEffect(() => {
    fetch("/api/technology")
      .then((res) => res.json())
      .then((data) => setTechOptions(data.technologies || []))
      .catch((err) => console.error("Teknolojiler yüklenemedi:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (index: number, file: File | null) => {
    if (index === -1) return setImage(file);
    const updated = [...subImages];
    updated[index] = file;
    setSubImages(updated);
  };

  const handleTechnologyToggle = (id: number) => {
    setTechnologies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.summary ||
      !form.url ||
      !form.description ||
      !image
    ) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Form alanları
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      // Ana görsel
      formData.append("image", image);

      // Alt görseller
      subImages.forEach((img, idx) => {
        if (img) formData.append(`subImage${idx + 1}`, img);
      });

      // Teknolojiler
      technologies.forEach((id) => formData.append("technologies", String(id)));

      // POST request
      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Proje eklenemedi");

      toast.success("Proje başarıyla eklendi!");

      // Formu resetle
      setForm({
        title: "",
        summary: "",
        url: "",
        description: "",
        demoUrl: "",
        githubUrl: "",
      });
      setImage(null);
      setSubImages(Array(5).fill(null));
      setTechnologies([]);
    } catch (err) {
      console.error(err);
      toast.error("Proje eklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      <main
        className={`flex-1 p-4 md:p-8 transition-all ${
          isMobile ? "" : "md:ml-64"
        }`}
      >
        <Card className="bg-neutral-900 border-neutral-800 text-white">
          <CardHeader>
            <h1 className="text-2xl font-semibold text-white">
              Yeni Proje Ekle
            </h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & URL yan yana */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2" htmlFor="title">
                    Başlık *
                  </Label>
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
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="Proje başlığı"
                    maxLength={30} // HTML tarafında da maksimum sınır
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    {form.title.length}/30 karakter
                  </p>
                </div>

                <div>
                  <Label className="mb-2" htmlFor="url">
                    Proje URL *
                  </Label>
                  <Input
                    id="url"
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="Proje URL'si"
                  />
                </div>
              </div>

              {/* Summary tek başına */}
              <div>
                <Label className="mb-2" htmlFor="summary">
                  Özet *
                </Label>
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
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="Kısa açıklama"
                  maxLength={82} // HTML tarafında da maksimum sınır
                />
                <p className="text-xs text-neutral-400 mt-1">
                  {form.summary.length}/82 karakter
                </p>
              </div>

              {/* Description */}
              <div>
                <Label className="mb-2" htmlFor="description">
                  Açıklama * (750-800 karakter)
                </Label>
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
                  className="bg-neutral-800 border-neutral-700 text-white min-h-[120px]"
                  placeholder="Projeyi açıklayın"
                  maxLength={800} // HTML tarafında da sınır
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

              {/* Demo & Github */}
              <div className="grid md:grid-cols-2 gap-4">
                {["demoUrl", "githubUrl"].map((field) => (
                  <div key={field}>
                    <Label className="mb-2" htmlFor={field}>
                      {field}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      value={form[field as keyof FormState]}
                      onChange={handleChange}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder={`${field} (isteğe bağlı)`}
                    />
                  </div>
                ))}
              </div>

              {/* Görseller (Ana + Alt) */}
              <div>
                <Label className="mb-2">Görseller *</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Ana Görsel */}
                  <div className="flex flex-col">
                    <label className="cursor-pointer bg-neutral-800 border border-neutral-700 text-white text-center py-2 rounded">
                      {image ? image.name : "Ana Görsel"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(-1, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </div>

                  {/* Alt Görseller */}
                  {subImages.map((img, idx) => (
                    <div key={idx} className="flex flex-col">
                      <label className="cursor-pointer bg-neutral-800 border border-neutral-700 text-white text-center py-2 rounded">
                        {img ? img.name : `Alt Görsel ${idx + 1}`}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageChange(idx, e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <Label className="mb-2">Teknolojiler</Label>
                <div className="flex flex-wrap gap-2">
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Kaydediliyor..." : "Proje Ekle"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
