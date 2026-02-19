// app/data/seed.ts
import connectDB from "@/lib/mongoose";
import Admin from "@/models/admin";
import bcrypt from "bcrypt";

export async function seedAdmin() {
  await connectDB();

  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log("✅ Admin zaten mevcut, seed atlandı.");
    return;
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

  await Admin.create({
    name: process.env.ADMIN_NAME,
    surname: process.env.ADMIN_SURNAME,
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
  });

  console.log("✅ Admin seed tamamlandı:", process.env.ADMIN_EMAIL);
}
