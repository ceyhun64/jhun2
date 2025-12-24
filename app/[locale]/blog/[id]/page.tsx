import Navbar from "@/components/layout/navbar";
import BlogDetail from "@/components/blog/blogDetail";
import Footer from "@/components/layout/footer";

type Props = {
  params: { locale: "tr" | "en" };
};

export default async function BlogDetailPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div >
      <Navbar locale={locale} />
      <BlogDetail locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}
