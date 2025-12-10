// Projects.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./sidebar";
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
  const [modalProject, setModalProject] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Projeler alınırken hata oluştu.");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Projeler alınamadı:", err);
      toast.error("Projeler yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCheckboxChange = (id: string) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p_id) => p_id !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProjects(projects.map((p) => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const openDetailModal = (id: string) => setModalProject(id);
  const closeDetailModal = () => setModalProject(null);

  const openEditModal = (project: Project) => {
    setProjectToEdit(project);
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

  const openDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız oldu.");

      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setSelectedProjects((prev) =>
        prev.filter((id) => id !== projectToDelete.id)
      );

      toast.success(`${projectToDelete.title} projesi başarıyla silindi.`);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error("Proje silinemedi:", err);
      toast.error("Proje silinirken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  const currentProject = projects.find((p) => p.id === modalProject) || null;

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
        <Sidebar />

        <main
          className={`flex-1 p-4 md:p-8 transition-all ${
            isMobile ? "" : "md:ml-64"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white ms-12 md:ms-0">
              Proje Yönetimi
            </h1>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Yeni Proje Ekle
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <p className="text-xl">Henüz proje bulunmamaktadır.</p>
              <p className="mt-2">Yeni bir proje ekleyerek başlayın.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selectedProjects.length === projects.length &&
                    projects.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
                <label className="select-none cursor-pointer">
                  Tümünü Seç ({selectedProjects.length}/{projects.length})
                </label>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:bg-white/15"
                  >
                    <div className="flex items-start gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                      <input
                        type="checkbox"
                        id={`checkbox-${project.id}`}
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => handleCheckboxChange(project.id)}
                        className="w-5 h-5 mt-2 accent-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`checkbox-${project.id}`}
                        className="cursor-pointer"
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-36 h-20 object-cover rounded-lg"
                        />
                      </label>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-1">
                          {project.title}
                        </h2>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {project.summary}
                        </p>
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span
                                key={tech.id}
                                className="text-xs px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full"
                              >
                                {tech.name}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-600/20 text-gray-300 rounded-full">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ms-auto sm:ms-0">
                      <button
                        onClick={() => openDetailModal(project.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition font-medium"
                      >
                        Detay
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition font-medium"
                        onClick={() => openEditModal(project)}
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => openDeleteDialog(project)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition font-medium"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        <ProjectModal
          isOpen={!!modalProject}
          onClose={closeDetailModal}
          project={currentProject}
        />
      </div>

      <AddProjectsModal
        trigger={<span className="sr-only">Add Trigger</span>}
        projectToEdit={null}
        onSuccess={handleAddSuccess}
        open={isAddModalOpen}
        setOpen={setIsAddModalOpen}
      />

      <AddProjectsModal
        trigger={<span className="sr-only">Edit Trigger</span>}
        projectToEdit={projectToEdit}
        onSuccess={handleEditSuccess}
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-neutral-900 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Projeyi silmek istediğinize emin misiniz?
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-400">
            Bu işlem{" "}
            <strong className="text-white">{projectToDelete?.title}</strong>{" "}
            projesini ve ilişkili tüm görsellerini{" "}
            <strong className="text-red-400">kalıcı olarak</strong> silecektir.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              onClick={() => setDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Evet, Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
