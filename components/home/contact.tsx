import { getDictionary } from "@/lib/get-dictionary";
import ContactClient from "./contactClient";

interface ContactProps {
  locale: "tr" | "en";
  title?: string;
  description?: string;
  email?: string;
  web?: { label: string; url: string };
}

export default async function Contact({
  locale,
  email = "jhuntechofficial@gmail.com",
}: ContactProps) {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.contact;

  return <ContactClient dict={dict} email={email} />;
}
