"use client";

import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "../sidebar";
import ProjectModal from "./projectModal";
import AddProjectsModal from "./addProjectModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  Eye,
  Pencil,
  LayoutGrid,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Technology {
  id: string;
  name: string;
  icon: string;
  type: string;
  yoe: number;
  color: string;
}
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
  createdAt: string;
  updatedAt: string;
}

export default function Projects() {
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [modalProjectId, setModalProjectId] = useState<string | null>(null);
  const [modalProjectData, setModalProjectData] = useState<Project | null>(
    null,
  );
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      toast.error("Projeler yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectDetail = useCallback(async (id: string) => {
    try {
      setModalLoading(true);
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setModalProjectData(data.project);
    } catch {
      toast.error("Proje detayı yüklenirken bir sorun oluştu.");
      closeDetailModal();
    } finally {
      setModalLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  useEffect(() => {
    if (modalProjectId) fetchProjectDetail(modalProjectId);
    else setModalProjectData(null);
  }, [modalProjectId, fetchProjectDetail]);

  const handleCheckboxChange = (id: string) =>
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedProjects(e.target.checked ? projects.map((p) => p.id) : []);

  const openDetailModal = (id: string) => setModalProjectId(id);
  const closeDetailModal = () => {
    setModalProjectId(null);
    setModalProjectData(null);
  };
  const openEditModal = (p: Project) => {
    setProjectToEdit(p);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setProjectToEdit(null);
    setIsEditModalOpen(false);
  };
  const handleEditSuccess = () => {
    closeEditModal();
    fetchProjects();
  };
  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchProjects();
  };
  const openDeleteDialog = (p: Project) => {
    setProjectToDelete(p);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setSelectedProjects((prev) =>
        prev.filter((id) => id !== projectToDelete.id),
      );
      toast.success(`"${projectToDelete.title}" silindi.`);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch {
      toast.error("Proje silinirken bir hata oluştu.");
    }
  };

  const confirmBulkDelete = async () => {
    if (!selectedProjects.length) return;
    setBulkDeleting(true);
    const errors: string[] = [];
    await Promise.all(
      selectedProjects.map(async (id) => {
        try {
          const res = await fetch(`/api/projects/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) throw new Error();
        } catch {
          errors.push(id);
        }
      }),
    );
    const deletedCount = selectedProjects.length - errors.length;
    setProjects((prev) =>
      prev.filter(
        (p) => !selectedProjects.includes(p.id) || errors.includes(p.id),
      ),
    );
    setSelectedProjects([]);
    setBulkDeleting(false);
    setBulkDeleteDialogOpen(false);
    if (!errors.length) toast.success(`${deletedCount} proje silindi.`);
    else toast.warning(`${deletedCount} silindi, ${errors.length} silinemedi.`);
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
                <LayoutGrid className="w-5 h-5 text-violet-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Proje Yönetimi
                </h1>
              </div>
              <p className="text-zinc-600 text-sm">
                {projects.length} proje listeleniyor
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-900/30"
            >
              <Plus className="w-4 h-4" />
              Yeni Proje Ekle
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-4">
                <LayoutGrid className="w-7 h-7 text-zinc-700" />
              </div>
              <p className="text-zinc-500 font-medium">Henüz proje yok</p>
              <p className="text-zinc-700 text-sm mt-1">
                Yeni bir proje ekleyerek başlayın
              </p>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <label
                  className="flex items-center gap-2.5 cursor-pointer group"
                  onClick={() =>
                    handleSelectAll({
                      target: {
                        checked: selectedProjects.length !== projects.length,
                      },
                    } as any)
                  }
                >
                  <div
                    className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedProjects.length === projects.length && projects.length > 0 ? "bg-violet-600 border-violet-500" : "border-zinc-700 bg-white/3 group-hover:border-zinc-500"}`}
                  >
                    {selectedProjects.length === projects.length &&
                      projects.length > 0 && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                  </div>
                  <span className="text-xs text-zinc-500">Tümünü seç</span>
                </label>
                <span className="text-zinc-700 text-xs">
                  {selectedProjects.length > 0
                    ? `${selectedProjects.length} seçili`
                    : `${projects.length} proje`}
                </span>
                <AnimatePresence>
                  {selectedProjects.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setBulkDeleteDialogOpen(true)}
                      className="ml-auto flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {selectedProjects.length} kaydı sil
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* List */}
              <div className="space-y-2">
                <AnimatePresence>
                  {projects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${selectedProjects.includes(project.id) ? "bg-violet-600/5 border-violet-500/30" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"}`}
                    >
                      <label
                        className="cursor-pointer flex-shrink-0"
                        onClick={() => handleCheckboxChange(project.id)}
                      >
                        <div
                          className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedProjects.includes(project.id) ? "bg-violet-600 border-violet-500" : "border-zinc-700 bg-white/3"}`}
                        >
                          {selectedProjects.includes(project.id) && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </label>

                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-16 h-11 object-cover rounded-lg flex-shrink-0 border border-white/5"
                      />

                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-white truncate">
                          {project.title}
                        </h2>
                        <p className="text-zinc-600 text-xs mt-0.5 line-clamp-1">
                          {project.summary}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech.id}
                              className="text-[11px] px-2 py-0.5 bg-violet-600/10 text-violet-400 border border-violet-500/15 rounded-md"
                            >
                              {tech.name}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="text-[11px] text-zinc-600">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-1">
                            <Calendar className="w-3 h-3 text-zinc-700" />
                            <span className="text-[11px] text-zinc-700">
                              {new Date(project.createdAt).toLocaleDateString(
                                "tr-TR",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDetailModal(project.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg text-zinc-400 hover:text-white text-xs font-medium transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detay
                        </button>
                        <button
                          onClick={() => openEditModal(project)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/8 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-medium transition"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Düzenle
                        </button>
                        <button
                          onClick={() => openDeleteDialog(project)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Sil
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </main>

        <ProjectModal
          isOpen={!!modalProjectId}
          onClose={closeDetailModal}
          project={modalProjectData}
          loading={modalLoading}
        />
      </div>

      <AddProjectsModal
        trigger={<span className="sr-only">Add</span>}
        projectToEdit={null}
        onSuccess={handleAddSuccess}
        open={isAddModalOpen}
        setOpen={setIsAddModalOpen}
      />
      <AddProjectsModal
        trigger={<span className="sr-only">Edit</span>}
        projectToEdit={projectToEdit}
        onSuccess={handleEditSuccess}
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0e0e14] border border-white/8 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Projeyi Sil
              </DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-zinc-500 text-sm leading-relaxed">
            <span className="text-white font-medium">
              "{projectToDelete?.title}"
            </span>{" "}
            projesi ve görselleri kalıcı olarak silinecek.
          </p>
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1 border-white/8 text-zinc-400 hover:bg-white/5 bg-transparent rounded-xl"
            >
              İptal
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl"
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <DialogContent className="bg-[#0e0e14] border border-white/8 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Toplu Silme
              </DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-zinc-500 text-sm leading-relaxed">
            <span className="text-white font-medium">
              {selectedProjects.length} proje
            </span>{" "}
            kalıcı olarak silinecek.
          </p>
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={bulkDeleting}
              className="flex-1 border-white/8 text-zinc-400 hover:bg-white/5 bg-transparent rounded-xl"
            >
              İptal
            </Button>
            <Button
              onClick={confirmBulkDelete}
              disabled={bulkDeleting}
              className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl"
            >
              {bulkDeleting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sil"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
