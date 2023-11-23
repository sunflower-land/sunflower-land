import i18n from "lib/i18n";
import { TOptions } from "i18next";
import { TranslationKeys } from "./dictionaries/types";
// added this unused import so that I can draft the PR

export const translate = (key: TranslationKeys, options?: TOptions): string => {
  return i18n.t(key, options);
};
