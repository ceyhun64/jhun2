import Blogs from "@/components/admin/blog/blogs";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminBlogs() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin");
  }

  return (
    <div>
      <Blogs />
    </div>
  );
}
