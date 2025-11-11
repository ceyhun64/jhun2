import { getDictionary } from "@/lib/get-dictionary";
import AboutClient from "./aboutClient";

type Props = {
  locale: "tr" | "en";
};

const About = async ({ locale }: Props) => {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.about;

  return <AboutClient dict={dict} />;
};

export default About;
