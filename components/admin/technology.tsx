"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import Sidebar from "./sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

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

export default function Technology() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    icon: "",
    type: "",
    yoe: "",
    color: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const isMobile = useIsMobile();

  // Teknolojileri yükle
  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async (): Promise<void> => {
    try {
      const response = await fetch("/api/technology");
      const data = await response.json();
      setTechnologies(data.technologies || []);
    } catch (err) {
      console.error("Teknolojiler yüklenemedi:", err);
      setError("Teknolojiler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Modal aç/kapat
  const openModal = (tech: Technology | null = null): void => {
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
      setFormData({ name: "", icon: "", type: "", yoe: "", color: "" });
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const closeModal = (): void => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", icon: "", type: "", yoe: "", color: "" });
    setError("");
  };

  // Form gönderimi (Ekleme/Güncelleme)
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasyon
    if (
      !formData.name ||
      !formData.icon ||
      !formData.type ||
      !formData.yoe ||
      !formData.color
    ) {
      setError("Tüm alanlar zorunludur.");
      return;
    }

    try {
      const url = editingId
        ? `/api/technology/${editingId}`
        : "/api/technology";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          yoe: parseInt(formData.yoe),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "İşlem başarısız oldu.");
        return;
      }

      setSuccess(data.message);
      fetchTechnologies();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      console.error("Hata:", err);
      setError("Bir hata oluştu.");
    }
  };

  // Silme işlemi
  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Bu teknolojiyi silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(`/api/technology/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Silme başarısız oldu.");
        return;
      }

      setSuccess("Teknoloji silindi.");
      fetchTechnologies();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silme sırasında bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />

      <main
        className={`flex-1 p-4 md:p-8 transition-all ${
          isMobile ? "" : "md:ml-64"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white ms-12 md:ms-0">
            Teknolojiler
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Yeni Ekle
          </button>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-600 rounded-lg">{success}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-lg"
                
                  >
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={28}
                      height={28}
                      className="object-contain"
                      style={{
                        filter: `drop-shadow(0 0 8px ${
                          ["#000000", "#0b0d0e"].includes(
                            tech.color?.toLowerCase()
                          )
                            ? "#FFFFFF"
                            : tech.color
                        }) drop-shadow(0 0 4px ${
                          ["#000000", "#0b0d0e"].includes(
                            tech.color?.toLowerCase()
                          )
                            ? "#FFFFFF"
                            : tech.color
                        })`,
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{tech.name}</h3>
                    <p className="text-sm text-gray-400">{tech.type}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span
                  className="text-sm px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "black",
                    color: "#ffffff",
                  }}
                >
                  {tech.yoe} yıl
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(tech)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Düzenle"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tech.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    aria-label="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {technologies.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            Henüz teknoloji eklenmemiş.
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId ? "Teknoloji Güncelle" : "Yeni Teknoloji Ekle"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
                aria-label="Kapat"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-600 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">İsim</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="⚛️"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tip</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Frontend, Backend, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Yıl (YOE)
                </label>
                <input
                  type="number"
                  value={formData.yoe}
                  onChange={(e) =>
                    setFormData({ ...formData, yoe: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="3"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Renk (Hex)
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="#3B82F6"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  {editingId ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
