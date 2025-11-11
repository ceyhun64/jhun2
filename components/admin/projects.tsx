"use client";
import { useState, useEffect } from "react";
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

interface Technology {
  id: number;
  name: string;
}

interface Project {
  id: number;
  title: string;
  summary: string;
  image: string;
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
}

export default function Projects() {
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [modalProject, setModalProject] = useState<number | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Silme dialog kontrolü
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Projeler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCheckboxChange = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProjects(projects.map((p) => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const openDetailModal = (id: number) => setModalProject(id);
  const closeDetailModal = () => setModalProject(null);
  const openEditModal = (project: Project) => setProjectToEdit(project);
  const closeEditModal = () => {
    setProjectToEdit(null);
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
      });
      if (!res.ok) throw new Error("Silme hatası");

      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error("Proje silinemedi:", err);
      alert("Proje silinirken hata oluştu.");
    }
  };

  if (loading) return <div className="text-white p-4">Yükleniyor...</div>;

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
              Projeler
            </h1>

            <AddProjectsModal
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Yeni Proje Ekle
                </Button>
              }
              onSuccess={fetchProjects}
            />
          </div>

          <div className="mb-4 mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                selectedProjects.length === projects.length &&
                projects.length > 0
              }
              onChange={handleSelectAll}
              className="w-5 h-5 accent-blue-500"
            />
            <label>Hepsi</label>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:bg-white/10"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => handleCheckboxChange(project.id)}
                    className="w-5 h-5 mt-2 accent-blue-500"
                  />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-36 h-20 object-cover rounded-sm"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <p className="text-gray-300">{project.summary}</p>
                  </div>
                </div>

                <div className="flex gap-2 ms-auto sm:ms-0">
                  <button
                    onClick={() => openDetailModal(project.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Detay
                  </button>

                  <AddProjectsModal
                    trigger={
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => openEditModal(project)}
                      >
                        Düzenle
                      </Button>
                    }
                    projectToEdit={project}
                    onSuccess={fetchProjects}
                  />

                  <button
                    onClick={() => openDeleteDialog(project)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Detay modal */}
        <ProjectModal
          isOpen={!!modalProject}
          onClose={closeDetailModal}
          project={currentProject}
        />
      </div>

      {/* ✅ Silme onay diyaloğu */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-black border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Silmek istediğine emin misin?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400">
            Bu işlem <b>{projectToDelete?.title}</b> projesini ve tüm
            görsellerini kalıcı olarak silecektir.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-gray-500 text-gray-300"
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
