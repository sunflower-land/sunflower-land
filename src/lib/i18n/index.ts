import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "lib/i18n/dictionaries/language";

if (process.env.NODE_ENV !== "metadata") {
  i18n.use(initReactI18next).init(
    {
      resources,
      lng: localStorage.getItem("language") || "en",
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
