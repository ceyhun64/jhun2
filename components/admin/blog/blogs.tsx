"use client";

import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "../sidebar";
import BlogModal from "./blogModal";
import AddBlogModal from "./addBlogModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  createdAt: string;
  updatedAt: string;
}

export default function Blogs() {
  const isMobile = useIsMobile();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [modalBlogId, setModalBlogId] = useState<string | null>(null);
  const [modalBlogData, setModalBlogData] = useState<Blog | null>(null);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Bloglar alınırken hata oluştu.");
      const result = await res.json();
      setBlogs(result.blogs || []);
    } catch (err) {
      console.error("Bloglar alınamadı:", err);
      toast.error("Bloglar yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlogDetail = useCallback(async (id: string) => {
    try {
      setModalLoading(true);
      const res = await fetch(`/api/blog/${id}`);
      if (!res.ok) throw new Error("Blog detayı alınamadı.");
      const result = await res.json();
      setModalBlogData(result.blog);
    } catch (err) {
      console.error("Blog detayı alınamadı:", err);
      toast.error("Blog detayı yüklenirken bir sorun oluştu.");
      closeDetailModal();
    } finally {
      setModalLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (modalBlogId) {
      fetchBlogDetail(modalBlogId);
    } else {
      setModalBlogData(null);
    }
  }, [modalBlogId, fetchBlogDetail]);

  const handleCheckboxChange = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((b_id) => b_id !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBlogs(blogs.map((b) => b.id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const openDetailModal = (id: string) => {
    setModalBlogId(id);
  };

  const closeDetailModal = () => {
    setModalBlogId(null);
    setModalBlogData(null);
  };

  const openEditModal = (blog: Blog) => {
    setBlogToEdit(blog);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setBlogToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    closeEditModal();
    fetchBlogs();
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchBlogs();
  };

  const openDeleteDialog = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      const res = await fetch(`/api/blog/${blogToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız oldu.");

      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      setSelectedBlogs((prev) => prev.filter((id) => id !== blogToDelete.id));

      toast.success(`${blogToDelete.title} blog yazısı başarıyla silindi.`);
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (err) {
      console.error("Blog silinemedi:", err);
      toast.error("Blog silinirken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

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
              Blog Yönetimi
            </h1>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Yeni Blog Ekle
            </Button>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <p className="text-xl">Henüz blog yazısı bulunmamaktadır.</p>
              <p className="mt-2">Yeni bir blog yazısı ekleyerek başlayın.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selectedBlogs.length === blogs.length && blogs.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
                <label className="select-none cursor-pointer">
                  Tümünü Seç ({selectedBlogs.length}/{blogs.length})
                </label>
              </div>

              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:bg-white/15"
                  >
                    <div className="flex items-start gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                      <input
                        type="checkbox"
                        id={`checkbox-${blog.id}`}
                        checked={selectedBlogs.includes(blog.id)}
                        onChange={() => handleCheckboxChange(blog.id)}
                        className="w-5 h-5 mt-2 accent-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`checkbox-${blog.id}`}
                        className="cursor-pointer"
                      >
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-36 h-20 object-cover rounded-lg"
                        />
                      </label>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-1">
                          {blog.title}
                        </h2>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {blog.summary}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(blog.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 ms-auto sm:ms-0">
                      <button
                        onClick={() => openDetailModal(blog.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition font-medium"
                      >
                        Detay
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition font-medium"
                        onClick={() => openEditModal(blog)}
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => openDeleteDialog(blog)}
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

        <BlogModal
          isOpen={!!modalBlogId}
          onClose={closeDetailModal}
          blog={modalBlogData}
          loading={modalLoading}
        />
      </div>

      <AddBlogModal
        trigger={<span className="sr-only">Add Trigger</span>}
        blogToEdit={null}
        onSuccess={handleAddSuccess}
        open={isAddModalOpen}
        setOpen={setIsAddModalOpen}
      />

      <AddBlogModal
        trigger={<span className="sr-only">Edit Trigger</span>}
        blogToEdit={blogToEdit}
        onSuccess={handleEditSuccess}
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-neutral-900 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Blog yazısını silmek istediğinize emin misiniz?
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-400">
            Bu işlem{" "}
            <strong className="text-white">{blogToDelete?.title}</strong> blog
            yazısını <strong className="text-red-400">kalıcı olarak</strong>{" "}
            silecektir.
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
