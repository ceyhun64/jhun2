// components/home/heroes.tsx  (SERVER COMPONENT)
import { getDictionary } from "@/lib/get-dictionary";
import HeroesClient from "./heroesClient";

type HeroGeometricProps = {
  locale: "tr" | "en";
  className?: string;
};

export default async function Heroes({ locale, className }: HeroGeometricProps) {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.heroes;

  return <HeroesClient dict={dict} className={className} locale={locale} />;
}
