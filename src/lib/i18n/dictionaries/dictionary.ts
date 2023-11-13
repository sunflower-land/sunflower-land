import { ENGLISH_TERMS } from "./englishDictionary";
import { PORTUGUESE_TERMS } from "./portugueseDictionary";
import { TranslationKeys } from "./types";

export type LanguageCode = "en" | "pt";

export type TranslationResource = Record<TranslationKeys, string>;

export const resources: Record<
  LanguageCode,
  { translation: TranslationResource }
> = {
  en: {
    translation: ENGLISH_TERMS,
  },
  pt: {
    translation: PORTUGUESE_TERMS,
  },
};
