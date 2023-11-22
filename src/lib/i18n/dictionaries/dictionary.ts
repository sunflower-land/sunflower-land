import { ENGLISH_TERMS } from "./englishDictionary";
import { TranslationKeys } from "./types";

export type LanguageCode = "en";

export type TranslationResource = Record<TranslationKeys, string>;

export const resources: Record<
  LanguageCode,
  { translation: TranslationResource }
> = {
  en: {
    translation: ENGLISH_TERMS,
  },
};
