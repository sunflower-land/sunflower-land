import { ENGLISH_TERMS } from "./englishDictionary";
import { CHINESE_TRADITIONAL_TERMS } from "./chinese_traditionalDictionary";
import { PORTUGUESE_TERMS } from "./portugueseDictionary";
import { TranslationKeys } from "./types";

export type LanguageCode = "en" | "zh-TW" | "pt";

export type TranslationResource = Record<TranslationKeys, string>;

export const resources: Record<
  LanguageCode,
  { translation: TranslationResource }
> = {
  en: {
    translation: ENGLISH_TERMS,
  },
  "zh-TW": {
    translation: CHINESE_TRADITIONAL_TERMS,
  },
  pt: {
    translation: PORTUGUESE_TERMS,
  },
};
