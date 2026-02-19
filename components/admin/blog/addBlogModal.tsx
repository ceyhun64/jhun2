"use client";

import { useState, useEffect } from "react";
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
import { Upload, X, AlertTriangle } from "lucide-react";
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
const REQUIRED_FIELDS: Set<
  keyof Omit<FormState, "imageFile" | "existingImage">
> = new Set(["title", "summary", "url", "description"]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }
    setForm((p) => ({ ...p, imageFile: file, existingImage: "" }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((p) => ({ ...p, imageFile: null, existingImage: "" }));
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, summary, url, description, imageFile, existingImage } = form;
    if (!title || !summary || !url || !description) {
      toast.error("Zorunlu alanları doldurun.");
      return;
    }
    if (!isEditing && !imageFile) {
      toast.error("Görsel yükleyin.");
      return;
    }
    if (isEditing && !imageFile && !existingImage) {
      toast.error("Görsel gerekli.");
      return;
    }
    if (description.length < 100) {
      toast.error("Açıklama en az 100 karakter olmalıdır.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      (
        [
          "title",
          "titleEng",
          "summary",
          "summaryEng",
          "url",
          "description",
          "descriptionEng",
        ] as const
      ).forEach((k) => formData.append(k, form[k]));
      if (form.imageFile) formData.append("image", form.imageFile);
      if (isEditing && form.existingImage)
        formData.append("existingImage", form.existingImage);
      const res = await fetch(
        isEditing ? `/api/blog/${blogToEdit!.id}` : "/api/blog",
        {
          method: isEditing ? "PUT" : "POST",
          body: formData,
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`Blog ${isEditing ? "güncellendi" : "eklendi"}!`);
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
    name: keyof Omit<FormState, "imageFile" | "existingImage">,
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
            {isEditing ? "Blog Düzenle" : "Yeni Blog Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-7 py-6 space-y-5"
        >
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

          {/* Image upload */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Görsel <span className="text-violet-400">*</span>
            </label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-white/8 bg-white/3">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={800}
                  height={400}
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2.5 right-2.5 w-8 h-8 bg-red-600 hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition shadow-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="blog-image"
                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/8 rounded-xl cursor-pointer bg-white/[0.015] hover:bg-white/[0.03] hover:border-violet-500/30 transition group"
              >
                <Upload className="w-8 h-8 text-zinc-700 mb-2 group-hover:text-violet-500/60 transition" />
                <p className="text-sm text-zinc-600 group-hover:text-zinc-500">
                  Görsel yüklemek için tıklayın
                </p>
                <p className="text-xs text-zinc-700 mt-1">
                  PNG, JPG, WEBP · Maks. 5MB
                </p>
                <input
                  id="blog-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </form>

        <div className="px-7 py-5 border-t border-white/5 flex justify-end gap-2.5 flex-shrink-0">
          <DialogClose asChild>
            <Button
              type="button"
              className="border-white/8 text-zinc-400 hover:bg-white/5 bg-transparent rounded-xl px-5"
              variant="outline"
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
              "Blog Ekle"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
