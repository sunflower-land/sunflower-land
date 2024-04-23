import { CHINESE_SIMPLIFIED_TERMS } from "./chinese_simplifiedDictionary";
import { CHINESE_TRADITIONAL_TERMS } from "./chinese_traditionalDictionary";
import { ENGLISH_TERMS } from "./englishDictionary";
import { FRENCH_TERMS } from "./frenchDictionary";
import { PORTUGUESE_TERMS } from "./portugueseDictionary";
import { TURKISH_TERMS } from "./turkishDictionary";
import { TranslationKeys } from "./types";

export type LanguageCode = "en" | "fr" | "pt" | "tk" | "zh-CN" | "zh-TW";

export type TranslationResource = Record<TranslationKeys, string>;

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
  "zh-TW": {
    translation: CHINESE_TRADITIONAL_TERMS,
  },
};
