import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, type LanguageCode } from "lib/i18n/dictionaries/language";
import { getKeys } from "lib/object";

if (process.env.NODE_ENV !== "metadata") {
  let lng: LanguageCode =
    (localStorage.getItem("language") as LanguageCode) || "en";
  if (!getKeys(resources).includes(lng)) {
    lng = "en";
    localStorage.setItem("language", lng);
  }

  // LanguageCode values are valid BCP-47 tags ("pt-BR", "zh-CN", …). Without
  // this the document permanently claims to be English while rendering one of
  // the other languages, which is what makes the browser offer to translate
  // the page — and browser translation moves the DOM nodes React tracks.
  // Also lets screen readers pronounce the UI correctly.
  document.documentElement.setAttribute("lang", lng);

  i18n.use(initReactI18next).init(
    {
      resources,
      lng,
      fallbackLng: "en",
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
    },
    (err, t) => {
      // eslint-disable-next-line no-console
      if (err) return console.error("Something went wrong loading", err);
      t("key"); // initialized and ready to go!
    },
  );
}

export default i18n;
