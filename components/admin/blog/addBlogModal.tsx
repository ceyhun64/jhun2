"use client";

import { useState, useEffect } from "react";
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
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  titleEng: string | null;
  summary: string;
  summaryEng: string | null;
  image: string;
  description: string;
  descriptionEng: string | null;
  url: string;
}

type FormState = {
  title: string;
  titleEng: string;
  summary: string;
  summaryEng: string;
  url: string;
  description: string;
  descriptionEng: string;
  imageFile: File | null;
  existingImage: string;
};

interface AddBlogModalProps {
  trigger: React.ReactNode;
  blogToEdit?: Blog | null;
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
  imageFile: null,
  existingImage: "",
};

export default function AddBlogModal({
  trigger,
  blogToEdit,
  onSuccess,
  open: externalOpen,
  setOpen: setExternalOpen,
}: AddBlogModalProps) {
  const isEditing = !!blogToEdit;
  const [localOpen, setLocalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : localOpen;
  const setOpen =
    setExternalOpen !== undefined ? setExternalOpen : setLocalOpen;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (blogToEdit) {
        setForm({
          title: blogToEdit.title,
          titleEng: blogToEdit.titleEng || "",
          summary: blogToEdit.summary,
          summaryEng: blogToEdit.summaryEng || "",
          url: blogToEdit.url,
          description: blogToEdit.description,
          descriptionEng: blogToEdit.descriptionEng || "",
          imageFile: null,
          existingImage: blogToEdit.image,
        });
        setImagePreview(blogToEdit.image);
      } else {
        setForm(initialFormState);
        setImagePreview("");
      }
    }
  }, [blogToEdit, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
        return;
      }
      setForm({ ...form, imageFile: file, existingImage: "" });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm({ ...form, imageFile: null, existingImage: "" });
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, summary, url, description, imageFile, existingImage } = form;

    if (!title || !summary || !url || !description) {
      toast.error("Lütfen tüm zorunlu (*) alanları doldurun.");
      return;
    }

    if (!isEditing && !imageFile) {
      toast.error("Lütfen bir görsel yükleyin.");
      return;
    }

    if (isEditing && !imageFile && !existingImage) {
      toast.error("Lütfen bir görsel yükleyin veya mevcut görseli koruyun.");
      return;
    }

    if (description.length < 100) {
      toast.error("Açıklama en az 100 karakter olmalıdır.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("titleEng", form.titleEng);
      formData.append("summary", form.summary);
      formData.append("summaryEng", form.summaryEng);
      formData.append("url", form.url);
      formData.append("description", form.description);
      formData.append("descriptionEng", form.descriptionEng);

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      if (isEditing && form.existingImage) {
        formData.append("existingImage", form.existingImage);
      }

      const apiUrl = isEditing ? `/api/blog/${blogToEdit!.id}` : "/api/blog";
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
            `${isEditing ? "Blog güncellenemedi" : "Blog eklenemedi"}`
        );
      }

      toast.success(
        `Blog yazısı başarıyla ${isEditing ? "güncellendi" : "eklendi"}!`
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
    name: keyof Omit<FormState, "imageFile" | "existingImage">,
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

  const dialogTitle = isEditing ? "Blog Düzenle" : "Yeni Blog Ekle";
  const submitButtonText = isEditing ? "Güncelle" : "Blog Ekle";

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
            {renderField("Başlık", "title", 100)}
            {renderField("Başlık (İngilizce)", "titleEng", 100)}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {renderField("Özet", "summary", 200)}
            {renderField("Özet (İngilizce)", "summaryEng", 200)}
          </div>

          {renderField("Açıklama", "description", 5000, 100, true)}
          {renderField("Açıklama (İngilizce)", "descriptionEng", 5000, 0, true)}

          {renderField("Blog URL (Slug)", "url", 255)}

          {/* Görsel Yükleme */}
          <div>
            <Label htmlFor="image" className="text-sm font-medium">
              Blog Görseli *
            </Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full h-48"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition"
                >
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    Görsel yüklemek için tıklayın
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP (Max 5MB)
                  </p>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <DialogClose asChild>
              <Button
                type="button"
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
