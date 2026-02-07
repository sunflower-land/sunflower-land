import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, LanguageCode } from "lib/i18n/dictionaries/language";
import { getKeys } from "features/game/lib/crafting";

if (process.env.NODE_ENV !== "metadata") {
  let lng: LanguageCode =
    (localStorage.getItem("language") as LanguageCode) || "en";
  if (!getKeys(resources).includes(lng)) {
    lng = "en";
    localStorage.setItem("language", lng);
  }

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
