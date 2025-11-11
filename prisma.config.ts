import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";

// .env dosyasını yükle
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // artık process.env üzerinden alıyoruz
    url: process.env.DATABASE_URL!,
  },
});
