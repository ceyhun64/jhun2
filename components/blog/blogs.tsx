import BlogsClient from "./blogsClient";
import { getDictionary } from "@/lib/get-dictionary";

type Props = {
  locale: "tr" | "en";
};

export default async function BlogsServer({ locale }: Props) {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.blogs;

  return <BlogsClient dict={dict} locale={locale} />;
}
