import Technology from "@/components/admin/technology/technology";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminTechnologies() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin");
  }
  return (
    <div>
      <Technology />
    </div>
  );
}
