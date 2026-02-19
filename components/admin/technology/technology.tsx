"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Upload,
  Link,
  Check,
  Loader2,
  Cpu,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Technology {
  id: string;
  name: string;
  icon: string;
  type: string;
  yoe: number;
  color: string;
}
interface FormData {
  name: string;
  icon: string;
  type: string;
  yoe: string;
  color: string;
}
type IconInputMode = "url" | "upload";

const TECH_TYPES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Mobile",
  "Database",
  "AI/ML",
  "Other",
];
const PRESET_COLORS = [
  "#8B5CF6",
  "#6366F1",
  "#3B82F6",
  "#06B6D4",
  "#10B981",
  "#22C55E",
  "#F59E0B",
  "#F97316",
  "#EF4444",
  "#EC4899",
  "#A855F7",
  "#14B8A6",
  "#0EA5E9",
  "#84CC16",
  "#FFFFFF",
  "#94A3B8",
];

export default function Technology() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    icon: "",
    type: "",
    yoe: "0",
    color: "#8B5CF6",
  });
  const [iconMode, setIconMode] = useState<IconInputMode>("url");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [iconPreviewError, setIconPreviewError] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState<Technology | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const fetchTechnologies = useCallback(async () => {
    try {
      const res = await fetch("/api/technology");
      const data = await res.json();
      setTechnologies(data.technologies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const openModal = (tech: Technology | null = null) => {
    if (tech) {
      setEditingId(tech.id);
      setFormData({
        name: tech.name,
        icon: tech.icon,
        type: tech.type,
        yoe: tech.yoe.toString(),
        color: tech.color,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", icon: "", type: "", yoe: "0", color: "#8B5CF6" });
    }
    setIconMode("url");
    setIconPreviewError(false);
    setShowModal(true);
    setFormError("");
    setFormSuccess("");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", icon: "", type: "", yoe: "", color: "" });
    setFormError("");
    setFormSuccess("");
    setIconPreviewError(false);
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Sadece resim dosyaları yüklenebilir.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormError("Dosya boyutu 2MB'dan küçük olmalıdır.");
      return;
    }
    setUploadLoading(true);
    setFormError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folderName", "technologies");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Yükleme başarısız.");
        return;
      }
      setFormData((prev) => ({ ...prev, icon: data.path }));
      setIconPreviewError(false);
    } catch {
      setFormError("Dosya yüklenirken hata oluştu.");
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const suggestColor = (name: string) => {
    const map: Record<string, string> = {
      react: "#61DAFB",
      next: "#FFFFFF",
      vue: "#42B883",
      angular: "#DD0031",
      typescript: "#3178C6",
      javascript: "#F7DF1E",
      node: "#339933",
      python: "#3776AB",
      rust: "#CE422B",
      go: "#00ADD8",
      java: "#ED8B00",
      kotlin: "#7F52FF",
      swift: "#FA7343",
      docker: "#2496ED",
      kubernetes: "#326CE5",
      postgres: "#336791",
      mysql: "#4479A1",
      mongodb: "#47A248",
      redis: "#DC382D",
      tailwind: "#06B6D4",
      css: "#1572B6",
      html: "#E34F26",
      graphql: "#E10098",
      firebase: "#FFCA28",
      aws: "#FF9900",
      azure: "#0078D4",
      gcp: "#4285F4",
    };
    const lower = name.toLowerCase();
    const match = Object.keys(map).find((k) => lower.includes(k));
    return match ? map[match] : null;
  };

  const handleNameChange = (val: string) => {
    const suggested = suggestColor(val);
    setFormData((prev) => ({
      ...prev,
      name: val,
      color: suggested || prev.color || "#8B5CF6",
    }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (
      !formData.name ||
      !formData.icon ||
      !formData.type ||
      !formData.yoe ||
      !formData.color
    ) {
      setFormError("Tüm alanlar zorunludur.");
      return;
    }
    const yoeNum = parseInt(formData.yoe);
    if (isNaN(yoeNum) || yoeNum < 0 || yoeNum > 50) {
      setFormError("Yıl deneyimi 0-50 arasında olmalıdır.");
      return;
    }
    setSubmitting(true);
    try {
      const url = editingId
        ? `/api/technology/${editingId}`
        : "/api/technology";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, yoe: yoeNum }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "İşlem başarısız.");
        return;
      }
      setFormSuccess(data.message);
      fetchTechnologies();
      setTimeout(() => closeModal(), 1000);
    } catch {
      setFormError("Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (tech: Technology) => {
    setTechToDelete(tech);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!techToDelete) return;
    setDeleting(true);
    try {
      await fetch(`/api/technology/${techToDelete.id}`, { method: "DELETE" });
      fetchTechnologies();
    } catch {
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setTechToDelete(null);
    }
  };

  const iconGlow = (color: string) =>
    ["#000000", "#0b0d0e", "#ffffff", "#FFFFFF"].includes(color?.toLowerCase())
      ? "#AAAAAA"
      : color;

  const typeColors: Record<string, string> = {
    Frontend: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    Backend: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    DevOps: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    Database: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Mobile: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    "AI/ML": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    Other: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070709]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-zinc-600 text-sm">Yükleniyor…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#070709] text-white">
        <Sidebar />
        <main
          className={`flex-1 p-5 md:p-8 transition-all ${isMobile ? "" : "md:ml-64"}`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 mt-10 md:mt-0">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <Cpu className="w-5 h-5 text-violet-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Teknolojiler
                </h1>
              </div>
              <p className="text-zinc-600 text-sm">
                {technologies.length} teknoloji listeleniyor
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-900/30"
            >
              <Plus className="w-4 h-4" /> Yeni Ekle
            </button>
          </div>

          {technologies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-4">
                <Cpu className="w-7 h-7 text-zinc-700" />
              </div>
              <p className="text-zinc-500 font-medium">
                Henüz teknoloji eklenmemiş
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              <AnimatePresence>
                {technologies.map((tech, i) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group relative bg-white/[0.02] border border-white/6 rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200"
                  >
                    {/* Actions overlay */}
                    <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(tech)}
                        className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg transition"
                      >
                        <Pencil className="w-3 h-3 text-zinc-400" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(tech)}
                        className="w-7 h-7 flex items-center justify-center bg-red-500/8 hover:bg-red-500/15 border border-red-500/15 rounded-lg transition"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>

                    {/* Icon */}
                    <div className="mb-3 w-10 h-10 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center">
                      <Image
                        src={tech.icon}
                        alt={tech.name}
                        width={22}
                        height={22}
                        className="object-contain"
                        style={{
                          filter: `drop-shadow(0 0 6px ${iconGlow(tech.color)})`,
                        }}
                      />
                    </div>

                    <p className="text-sm font-semibold text-white mb-1 truncate">
                      {tech.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${typeColors[tech.type] || typeColors.Other}`}
                      >
                        {tech.type}
                      </span>
                      <span className="text-[11px] text-zinc-600 font-mono">
                        {tech.yoe}y
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0e0e14] border border-white/8 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-base font-bold text-white">
                    {editingId ? "Teknolojiyi Güncelle" : "Yeni Teknoloji"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-white transition rounded-lg hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 flex items-center gap-2.5 px-3.5 py-3 bg-red-500/8 border border-red-500/20 rounded-xl">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-400">{formError}</p>
                  </div>
                )}
                {formSuccess && (
                  <div className="mb-4 flex items-center gap-2.5 px-3.5 py-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <p className="text-xs text-emerald-400">{formSuccess}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      İsim
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-white/3 border border-white/8 text-white text-sm placeholder-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/60 transition"
                      placeholder="React, Docker, PostgreSQL…"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Kategori
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {TECH_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({ ...p, type: t }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${formData.type === t ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "bg-white/3 text-zinc-500 border border-white/6 hover:border-zinc-600 hover:text-zinc-400"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, type: e.target.value }))
                      }
                      className="w-full bg-white/3 border border-white/8 text-white text-xs placeholder-zinc-700 rounded-xl px-4 py-2 focus:outline-none focus:border-violet-500/60 transition"
                      placeholder="Yukarıdan seçin veya özel yazın…"
                    />
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      İkon
                    </label>
                    <div className="flex gap-1.5 mb-2">
                      {(["url", "upload"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setIconMode(mode)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${iconMode === mode ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "bg-white/3 text-zinc-500 border border-white/6 hover:text-zinc-400"}`}
                        >
                          {mode === "url" ? (
                            <>
                              <Link className="w-3 h-3" /> URL
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3" /> Yükle
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      {iconMode === "url" ? (
                        <input
                          type="text"
                          value={formData.icon}
                          onChange={(e) => {
                            setFormData((p) => ({
                              ...p,
                              icon: e.target.value,
                            }));
                            setIconPreviewError(false);
                          }}
                          className="flex-1 bg-white/3 border border-white/8 text-white text-xs placeholder-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/60 transition"
                          placeholder="https://cdn.svgl.app/icons/react.svg"
                        />
                      ) : (
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleIconUpload}
                            className="hidden"
                            id="icon-upload"
                          />
                          <label
                            htmlFor="icon-upload"
                            className={`flex items-center gap-2 justify-center w-full border-2 border-dashed rounded-xl px-4 py-2.5 cursor-pointer transition text-xs ${uploadLoading ? "border-violet-500/50 text-violet-400" : "border-white/8 text-zinc-600 hover:border-zinc-700 hover:text-zinc-500"}`}
                          >
                            {uploadLoading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                                Yükleniyor…
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" /> Resim seç
                                (max 2MB)
                              </>
                            )}
                          </label>
                          {formData.icon && (
                            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Yüklendi
                            </p>
                          )}
                        </div>
                      )}
                      <div className="w-10 h-10 bg-white/3 border border-white/8 rounded-xl flex items-center justify-center flex-shrink-0">
                        {formData.icon && !iconPreviewError ? (
                          <Image
                            src={formData.icon}
                            alt="preview"
                            width={22}
                            height={22}
                            className="object-contain"
                            onError={() => setIconPreviewError(true)}
                            style={{
                              filter: formData.color
                                ? `drop-shadow(0 0 5px ${iconGlow(formData.color)})`
                                : "none",
                            }}
                          />
                        ) : (
                          <span className="text-zinc-700 text-[10px]">
                            {iconPreviewError ? "!" : "?"}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-700 mt-1">
                      İpucu:{" "}
                      <a
                        href="https://svgl.app"
                        target="_blank"
                        rel="noreferrer"
                        className="text-violet-400 hover:underline"
                      >
                        svgl.app
                      </a>
                      'dan SVG URL alabilirsiniz.
                    </p>
                  </div>

                  {/* YOE */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Deneyim{" "}
                      {formData.yoe && (
                        <span className="text-violet-400 normal-case font-bold ml-1">
                          {formData.yoe} yıl
                        </span>
                      )}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={15}
                      step={1}
                      value={formData.yoe || 0}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, yoe: e.target.value }))
                      }
                      className="w-full accent-violet-500"
                    />
                    <div className="flex justify-between text-[11px] text-zinc-700 mt-0.5">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Renk{" "}
                      {formData.color && (
                        <span
                          className="font-mono normal-case ml-1"
                          style={{ color: formData.color }}
                        >
                          {formData.color}
                        </span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2.5">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({ ...p, color: c }))
                          }
                          className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === c ? "border-white scale-110" : "border-white/10"}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={formData.color || "#8B5CF6"}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, color: e.target.value }))
                        }
                        className="w-9 h-9 rounded-lg border border-white/8 bg-white/3 cursor-pointer p-1 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, color: e.target.value }))
                        }
                        className="flex-1 bg-white/3 border border-white/8 text-white text-xs font-mono placeholder-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/60 transition"
                        placeholder="#8B5CF6"
                        maxLength={7}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-white/3 hover:bg-white/6 border border-white/8 text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting || uploadLoading}
                      className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : editingId ? (
                        "Güncelle"
                      ) : (
                        "Ekle"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0e0e14] border border-white/8 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Teknolojiyi Sil
              </DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-zinc-500 text-sm leading-relaxed">
            <span className="text-white font-medium">
              "{techToDelete?.name}"
            </span>{" "}
            kalıcı olarak silinecek. Bağlı projelerdeki ilişkiler de
            kaldırılacak.
          </p>
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              className="flex-1 border-white/8 text-zinc-400 hover:bg-white/5 bg-transparent rounded-xl"
            >
              İptal
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
