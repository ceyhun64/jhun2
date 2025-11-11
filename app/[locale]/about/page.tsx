import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import About from "@/components/contact/about";

type Props = {
  params: { locale: "tr" | "en" };
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="bg-black">
      <Navbar locale={locale} />
      <div className="py-15">
        <About locale={locale} />
      </div>
      <Footer locale={locale}  />
    </div>
  );
}
