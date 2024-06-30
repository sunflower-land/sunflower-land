import { ENGLISH_TERMS } from "./englishDictionary";
import { TURKISH_TERMS } from "./turkishDictionary";
import { CHINESE_SIMPLIFIED_TERMS } from "./chinese_simplifiedDictionary";
import { PORTUGUESE_TERMS } from "./portugueseDictionary";
import { FRENCH_TERMS } from "./frenchDictionary";
import { TranslationKeys } from "./types";

// import british_flag from "public/assets/sfts/flags/british_flag.gif";
// import usaFlag from "public/assets/sfts/flags/usa_flag.gif";
// import brazilFlag from "public/assets/sfts/flags/brazil_flag.gif";
// import portugalFlag from "public/assets/sfts/flags/portugal_flag.gif";
// import franceFlag from "public/assets/sfts/flags/france_flag.gif";
// import turkeyFlag from "public/assets/sfts/flags/turkey_flag.gif";
// import chinaFlag from "public/assets/sfts/flags/china_flag.gif";

export type LanguageCode = "en" | "fr" | "pt" | "tk" | "zh-CN";

export type TranslationResource = Record<TranslationKeys, string>;

interface LanguageDetails {
  languageName: string;
  languageImage: string[];
  imageAlt: string[]; // Used for the image alt, won't be shown in game
}

export const languageDetails: Record<LanguageCode, LanguageDetails> = {
  en: {
    languageName: "English",
    languageImage: ["british_flag, usaFlag"],
    imageAlt: ["United Kingdom Flag", "United States of America Flag"],
  },
  fr: {
    languageName: "Français",
    languageImage: ["franceFlag"],
    imageAlt: ["France Flag"],
  },
  pt: {
    languageName: "Português",
    languageImage: ["brazilFlag, portugalFlag"],
    imageAlt: ["Brazil Flag", "Portugual Flag"],
  },
  tk: {
    languageName: "Türkçe",
    languageImage: ["turkeyFlag"],
    imageAlt: ["Turkey Flag"],
  },
  "zh-CN": {
    languageName: "简体中文",
    languageImage: ["chinaFlag"],
    imageAlt: ["China Flag"],
  },
};

export const resources: Record<
  LanguageCode,
  { translation: TranslationResource }
> = {
  en: {
    translation: ENGLISH_TERMS,
  },
  fr: {
    translation: FRENCH_TERMS,
  },
  pt: {
    translation: PORTUGUESE_TERMS,
  },
  tk: {
    translation: TURKISH_TERMS,
  },
  "zh-CN": {
    translation: CHINESE_SIMPLIFIED_TERMS,
  },
};
