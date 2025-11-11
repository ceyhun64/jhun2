import { getDictionary } from "@/lib/get-dictionary";
import ModernFooterClient from "./footerClient";

interface ModernFooterProps {
  locale?: "tr" | "en";
}

const ModernFooter = async ({ locale = "tr" }: ModernFooterProps) => {
  const dict = (await getDictionary(locale)).footer;
  return <ModernFooterClient dict={dict} />;
};

export default ModernFooter;
