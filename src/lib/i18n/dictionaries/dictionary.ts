import ENGLISH_TERMS from "./dictionary.json";
import TURKISH_TERMS from "./tr.json";
import CHINESE_SIMPLIFIED_TERMS from "./zh-CN.json";
import CHINESE_TRADITIONAL_TERMS from "./zh-TW.json";
import PORTUGUESE_TERMS from "./pt-BR.json";
import FRENCH_TERMS from "./fr.json";
import RUSSIAN_TERMS from "./ru.json";
import ITALIAN_TERMS from "./it.json";
import SPANISH_TERMS from "./es.json";
import { TranslationKeys } from "./types";

import britishFlag from "assets/sfts/flags/british_flag.gif";
import usaFlag from "assets/sfts/flags/usa_flag.gif";
import brazilFlag from "assets/sfts/flags/brazil_flag.gif";
import portugalFlag from "assets/sfts/flags/portugal_flag.gif";
import franceFlag from "assets/sfts/flags/france_flag.gif";
import turkeyFlag from "assets/sfts/flags/turkey_flag.gif";
import chinaFlag from "assets/sfts/flags/china_flag.gif";
import russiaFlag from "assets/sfts/flags/russia_flag.gif";
import spainFlag from "assets/sfts/flags/spain_flag.gif";
import italyFlag from "assets/sfts/flags/italy_flag.gif";

export type LanguageCode =
  | "en"
  | "es"
  | "fr"
  | "pt-BR"
  | "tr"
  | "zh-CN"
  | "zh-TW"
  | "ru"
  | "it";

export type TranslationResource = Partial<Record<TranslationKeys, string>>;

interface LanguageDetails {
  languageName: string;
  languageImage?: string[];
  imageAlt?: string[]; // Used for the image alt, won't be shown in game
}

export const languageDetails: Record<LanguageCode, LanguageDetails> = {
  en: {
    languageName: "English",
    languageImage: [britishFlag, usaFlag],
    imageAlt: ["United Kingdom Flag", "United States of America Flag"],
  },
  fr: {
    languageName: "Français",
    languageImage: [franceFlag],
    imageAlt: ["France Flag"],
  },
  "pt-BR": {
    languageName: "Português",
    languageImage: [brazilFlag, portugalFlag],
    imageAlt: ["Brazil Flag", "Portugual Flag"],
  },
  ru: {
    languageName: "Русский",
    languageImage: [russiaFlag],
    imageAlt: ["Russia Flag"],
  },
  tr: {
    languageName: "Türkçe",
    languageImage: [turkeyFlag],
    imageAlt: ["Turkey Flag"],
  },
  "zh-CN": {
    languageName: "简体中文",
    languageImage: [chinaFlag],
    imageAlt: ["China Flag"],
  },
  es: {
    languageName: "Español",
    languageImage: [spainFlag],
    imageAlt: ["Spain Flag"],
  },
  it: {
    languageName: "Italiano",
    languageImage: [italyFlag],
    imageAlt: ["Italy Flag"],
  },
  "zh-TW": {
    languageName: "繁体中文",
  },
};

export const resources: Partial<
  Record<LanguageCode, { translation: TranslationResource }>
> = {
  en: { translation: ENGLISH_TERMS },
  es: { translation: SPANISH_TERMS },
  fr: { translation: FRENCH_TERMS },
  "pt-BR": { translation: PORTUGUESE_TERMS },
  tr: { translation: TURKISH_TERMS },
  "zh-CN": { translation: CHINESE_SIMPLIFIED_TERMS },
  "zh-TW": { translation: CHINESE_TRADITIONAL_TERMS },
  ru: { translation: RUSSIAN_TERMS },
  it: { translation: ITALIAN_TERMS },
};
