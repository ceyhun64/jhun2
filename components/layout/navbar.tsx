// components/layout/navbar.tsx
import { getDictionary } from "@/lib/get-dictionary";
import NavbarClient from "./navbarClient";

type Props = {
  locale: "tr" | "en";
};

export default async function Navbar({ locale }: Props) {
  const dictAll = await getDictionary(locale);
  const dict = dictAll.navbar;
  return <NavbarClient dict={dict} />;
}
