import i18n from "src/i18n";
import { TOptions } from "i18next";
import { TranslationKeys } from "./dictionaries/types";

export const translate = (key: TranslationKeys, options?: TOptions): string => {
  return i18n.t(key, options);
};
