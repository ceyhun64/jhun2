import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Blog from "@/components/blog/blogs";

type Props = {
  params: { locale: "tr" | "en" };
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="bg-black">
      <Navbar locale={locale} />
      <div className="py-15">
        <Blog locale={locale} />
      </div>
      <Footer locale={locale} />
    </div>
  );
}
