import "server-only";

type Locale = "tr" | "en";

const dictionaries: Record<Locale, () => Promise<any>> = {
  tr: () => import("@/messages/tr.json").then((mod) => mod.default),
  en: () => import("@/messages/en.json").then((mod) => mod.default),
};

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    throw new Error(`No dictionary found for locale: ${locale}`);
  }
  return dictionaries[locale]();
};
