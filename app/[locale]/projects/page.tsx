import Navbar from "@/components/layout/navbar";
import Projects from "@/components/projects/projects";
import Footer from "@/components/layout/footer";

type Props = {
  params: { locale: "tr" | "en" };
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div >
      <Navbar locale={locale} />
      <Projects locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}
