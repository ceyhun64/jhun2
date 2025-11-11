// lib/db.ts
import { PrismaClient } from "@/lib/generated/prisma";

declare global {
  // Development sırasında hot-reload'da tekrar tekrar PrismaClient oluşturulmasını önler
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : [],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
