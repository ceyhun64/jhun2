import prisma from "@/lib/db"; // global singleton kullanan db.ts

async function main() {
  console.log("Veritabanındaki mevcut veriler siliniyor...");

  await prisma.projectTechnology.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.technology.deleteMany({});

  console.log("Veritabanı temizlendi, seed başlıyor...");
  
  const technologies = [
    {
      name: "HTML5",
      icon: "/technologies/html5.svg",
      color: "#E34F26",
      type: "Frontend",
      yoe: 3,
    },
    {
      name: "CSS3",
      icon: "/technologies/css.svg",
      color: "#1572B6",
      type: "Frontend",
      yoe: 3,
    },
    {
      name: "JavaScript",
      icon: "/technologies/javascript.svg",
      color: "#F7DF1E",
      type: "Frontend",
      yoe: 4,
    },
    {
      name: "TypeScript",
      icon: "/technologies/typescript.svg",
      color: "#3178C6",
      type: "Frontend",
      yoe: 2,
    },
    {
      name: "React",
      icon: "/technologies/react.svg",
      color: "#61DAFB",
      type: "Frontend",
      yoe: 3,
    },
    {
      name: "Redux",
      icon: "/technologies/redux.svg",
      color: "#764ABC",
      type: "Frontend",
      yoe: 2,
    },
    {
      name: "Next.js",
      icon: "/technologies/nextdotjs.svg",
      color: "#000000",
      type: "Frontend",
      yoe: 2,
    },
    {
      name: "Vite",
      icon: "/technologies/vite.svg",
      color: "#646CFF",
      type: "Frontend",
      yoe: 1,
    },
    {
      name: "Tailwind CSS",
      icon: "/technologies/tailwindcss.svg",
      color: "#06B6D4",
      type: "Frontend",
      yoe: 2,
    },
    {
      name: "Shadcn UI",
      icon: "/technologies/shadcnui.svg",
      color: "#000000",
      type: "Frontend",
      yoe: 1,
    },
    {
      name: "Prisma",
      icon: "/technologies/prisma.svg",
      color: "#2D3748",
      type: "Database",
      yoe: 1,
    },
    {
      name: "Sequelize",
      icon: "/technologies/sequelize.svg",
      color: "#52B0E7",
      type: "Database",
      yoe: 2,
    },
    {
      name: "MySQL",
      icon: "/technologies/mysql.svg",
      color: "#4479A1",
      type: "Database",
      yoe: 3,
    },
    {
      name: "MongoDB",
      icon: "/technologies/mongodb.svg",
      color: "#47A248",
      type: "Database",
      yoe: 2,
    },
    {
      name: "Node.js",
      icon: "/technologies/nodedotjs.svg",
      color: "#339933",
      type: "Backend",
      yoe: 3,
    },
    {
      name: "Express",
      icon: "/technologies/express.svg",
      color: "#000000",
      type: "Backend",
      yoe: 3,
    },
    {
      name: "EJS",
      icon: "/technologies/ejs.svg",
      color: "#B4CA65",
      type: "Backend",
      yoe: 2,
    },
    {
      name: "Handlebars",
      icon: "/technologies/handlebarsdotjs.svg",
      color: "#000000",
      type: "Backend",
      yoe: 2,
    },
    {
      name: "Docker",
      icon: "/technologies/docker.svg",
      color: "#2496ED",
      type: "DevOps",
      yoe: 1,
    },
    {
      name: "Railway",
      icon: "/technologies/railway.svg",
      color: "#0B0D0E",
      type: "DevOps",
      yoe: 1,
    },
    {
      name: "Render",
      icon: "/technologies/render.svg",
      color: "#000000",
      type: "DevOps",
      yoe: 1,
    },
    {
      name: "Vercel",
      icon: "/technologies/vercel.svg",
      color: "#000000",
      type: "DevOps",
      yoe: 1,
    },
  ];

  for (const tech of technologies) {
    await prisma.technology.create({
      data: tech,
    });
  }

  console.log("Seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
