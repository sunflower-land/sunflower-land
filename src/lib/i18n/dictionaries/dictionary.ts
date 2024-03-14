import { ENGLISH_TERMS } from "./englishDictionary";
import { PORTUGUESE_TERMS } from "./portugueseDictionary";
import { FRENCH_TERMS } from "./frenchDictionary";
import { TranslationKeys } from "./types";

export type LanguageCode = "en" | "fr" | "pt";

export type TranslationResource = Record<TranslationKeys, string>;
export type PartialTranslationResource = Partial<
  Record<TranslationKeys, string>
>;

export const resources: Record<
  LanguageCode,
  { translation: PartialTranslationResource }
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
};
