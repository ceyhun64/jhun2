import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  
  // Prisma için ekleyin
  turbopack: {},
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;