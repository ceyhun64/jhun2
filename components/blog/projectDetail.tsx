import ProjectDetailClient from "./projectDetailClient";
import { getDictionary } from "@/lib/get-dictionary";

type Props = {
  locale: "tr" | "en";
};

export default async function ProjectDetail({ locale }: Props) {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.projectdetail;

  return <ProjectDetailClient dict={dict} locale={locale} />;
}
