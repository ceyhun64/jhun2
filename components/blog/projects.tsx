import ProjectsClient from "./projectsClient";
import { getDictionary } from "@/lib/get-dictionary";

type Props = {
  locale: "tr" | "en";
};

export default async function ProjectsServer({ locale }: Props) {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.projects;

  return <ProjectsClient dict={dict} locale={locale} />;
}
