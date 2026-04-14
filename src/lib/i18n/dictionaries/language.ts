import ENGLISH_TERMS from "./dictionary.json";
import TURKISH_TERMS from "./tr.json";
import CHINESE_SIMPLIFIED_TERMS from "./zh-CN.json";
import PORTUGUESE_TERMS from "./pt-BR.json";
import FRENCH_TERMS from "./fr.json";
import RUSSIAN_TERMS from "./ru.json";
import INDONESIAN_TERMS from "./id.json";
import ITALIAN_TERMS from "./it.json";
import SPANISH_TERMS from "./es.json";
import GERMAN_TERMS from "./de.json";
import JAPANESE_TERMS from "./ja.json";
import { TranslationKeys } from "./types";

import britishFlag from "assets/sfts/flags/british_flag.webp";
import usaFlag from "assets/sfts/flags/usa_flag.webp";
import brazilFlag from "assets/sfts/flags/brazil_flag.webp";
import portugalFlag from "assets/sfts/flags/portugal_flag.webp";
import franceFlag from "assets/sfts/flags/france_flag.webp";
import turkeyFlag from "assets/sfts/flags/turkey_flag.webp";
import chinaFlag from "assets/sfts/flags/china_flag.webp";
import russiaFlag from "assets/sfts/flags/russia_flag.webp";
import spainFlag from "assets/sfts/flags/spain_flag.webp";
import italyFlag from "assets/sfts/flags/italy_flag.webp";
import germanFlag from "assets/sfts/flags/germany_flag.webp";
import indonesiaFlag from "assets/sfts/flags/indonesia_flag.webp";
import japaneseFlag from "assets/sfts/flags/japan_flag.webp";

export type LanguageCode =
  | "en"
  | "es"
  | "de"
  | "fr"
  | "id"
  | "ja"
  | "pt-BR"
  | "tr"
  | "zh-CN"
  | "ru"
  | "it";

export type TranslationResource = Partial<Record<TranslationKeys, string>>;

interface LanguageDetails {
  languageName: string;
  languageImage: string[];
  imageAlt: string[]; // Used for the image alt, won't be shown in game
}

export const LANGUAGE_DETAILS: Record<LanguageCode, LanguageDetails> = {
  en: {
    languageName: "English",
    languageImage: [britishFlag, usaFlag],
    imageAlt: ["United Kingdom Flag", "United States of America Flag"],
  },
  de: {
    languageName: "Deutsch",
    languageImage: [germanFlag],
    imageAlt: ["Germany Flag"],
  },
  es: {
    languageName: "Español",
    languageImage: [spainFlag],
    imageAlt: ["Spain Flag"],
  },
  fr: {
    languageName: "Français",
    languageImage: [franceFlag],
    imageAlt: ["France Flag"],
  },
  id: {
    languageName: "Indonesian",
    languageImage: [indonesiaFlag],
    imageAlt: ["Indonesia Flag"],
  },
  it: {
    languageName: "Italiano",
    languageImage: [italyFlag],
    imageAlt: ["Italy Flag"],
  },
  ja: {
    languageName: "日本語",
    languageImage: [japaneseFlag],
    imageAlt: ["Japan Flag"],
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
};

export const resources: Partial<
  Record<LanguageCode, { translation: TranslationResource }>
> = {
  en: { translation: ENGLISH_TERMS },
  de: { translation: GERMAN_TERMS },
  es: { translation: SPANISH_TERMS },
  fr: { translation: FRENCH_TERMS },
  id: { translation: INDONESIAN_TERMS },
  it: { translation: ITALIAN_TERMS },
  ja: { translation: JAPANESE_TERMS },
  "pt-BR": { translation: PORTUGUESE_TERMS },
  ru: { translation: RUSSIAN_TERMS },
  tr: { translation: TURKISH_TERMS },
  "zh-CN": { translation: CHINESE_SIMPLIFIED_TERMS },
};
