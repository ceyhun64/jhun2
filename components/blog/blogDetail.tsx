import BlogDetailClient from "./blogDetailClient";
import { getDictionary } from "@/lib/get-dictionary";

type Props = {
  locale: "tr" | "en";
};

export default async function BlogDetail({ locale }: Props) {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.blogDetail;

  return <BlogDetailClient dict={dict} locale={locale} />;
}
