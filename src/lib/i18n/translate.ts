import i18n from "lib/i18n";
import { TOptions } from "i18next";
import { TranslationKeys } from "./dictionaries/types";
import { LanguageCode } from "./dictionaries/dictionary";
import { TranslatedDescriptions } from "features/game/types/images";

export const translate = (
  key: TranslationKeys,
  options: TOptions = {},
): string => {
  return i18n.t(key, options);
};

export const translateTerms = (
  translations: TranslatedDescriptions,
): string => {
  const language = (i18n.language ?? "en") as LanguageCode;

  return translations[language] ?? translations.en;
};
