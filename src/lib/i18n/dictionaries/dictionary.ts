import { ENGLISH_TERMS } from "./englishDictionary";
import { TURKISH_TERMS } from "./turkishDictionary";
import { CHINESE_SIMPLIFIED_TERMS } from "./chinese_simplifiedDictionary";
import { PORTUGUESE_TERMS } from "./portugueseDictionary";
import { FRENCH_TERMS } from "./frenchDictionary";
import { RUSSIAN_TERMS } from "./russianDictionary";
import { TranslationKeys } from "./types";

import britishFlag from "assets/sfts/flags/british_flag.gif";
import usaFlag from "assets/sfts/flags/usa_flag.gif";
import brazilFlag from "assets/sfts/flags/brazil_flag.gif";
import portugalFlag from "assets/sfts/flags/portugal_flag.gif";
import franceFlag from "assets/sfts/flags/france_flag.gif";
import turkeyFlag from "assets/sfts/flags/turkey_flag.gif";
import chinaFlag from "assets/sfts/flags/china_flag.gif";
import russiaFlag from "assets/sfts/flags/russia_flag.gif";

export type LanguageCode = "en" | "fr" | "pt" | "tk" | "zh-CN" | "ru";

export type TranslationResource = Record<TranslationKeys, string>;

interface LanguageDetails {
  languageName: string;
  languageImage: string[];
  imageAlt: string[]; // Used for the image alt, won't be shown in game
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
  pt: {
    languageName: "Português",
    languageImage: [brazilFlag, portugalFlag],
    imageAlt: ["Brazil Flag", "Portugual Flag"],
  },
  ru: {
    languageName: "Русский",
    languageImage: [russiaFlag],
    imageAlt: ["Russia Flag"],
  },
  tk: {
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
  ru: {
    translation: RUSSIAN_TERMS,
  },
};
