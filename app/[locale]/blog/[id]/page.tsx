import Navbar from "@/components/layout/navbar";
import ProjectDetail from "@/components/projects/projectDetail";
import Footer from "@/components/layout/footer";

type Props = {
  params: { locale: "tr" | "en" };
};

export default async function BlogDetailPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="bg-black">
      <Navbar locale={locale} />
      <ProjectDetail locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}
