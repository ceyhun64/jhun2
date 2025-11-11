import Navbar from "@/components/layout/navbar";
import Heroes from "@/components/home/heroes";
import Banner from "@/components/home/banner";
import About from "@/components/home/about";
import ContactSection from "@/components/home/contact";
import Footer from "@/components/layout/footer";
import Gallery from "@/components/home/gallery";
import Scroll from "@/components/layout/scroll";

const DEFAULT_LOCALE = "tr";

export default async function Home() {
  const locale = DEFAULT_LOCALE;

  return (
    <div className="relative bg-black">
      <Navbar locale={locale} />

      <div className="pt-10">
        <Heroes locale={locale} />
        <Banner locale={locale} />
        <Gallery locale={locale} />
        <About locale={locale} />
        <ContactSection locale={locale} />
        <Footer locale={locale} />
      </div>

      <Scroll />
    </div>
  );
}
