import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Contact from "@/components/contact/contact";

type Props = {
  params: { locale: "tr" | "en" };
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div >
      <Navbar locale={locale} />
      <div className="py-15">
        <Contact locale={locale} />
      </div>
      <Footer locale={locale}  />
    </div>
  );
}
