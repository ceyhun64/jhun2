import { getDictionary } from "@/lib/get-dictionary";
import GalleryClient from "./galleryClient";

type Props = {
  locale: "tr" | "en";
};

export default async function Gallery({ locale }: Props) {
  // server-side dictionary fetch
  const dictAll = await getDictionary(locale);
  const dict = dictAll.gallery;

  return <GalleryClient dict={dict} locale={locale} />;
}
