import i18n from "src/i18n";
import { TranslationKeys } from "./dictionary";
import { TOptions } from "i18next";

export const translate = (key: TranslationKeys, options?: TOptions): string => {
  return i18n.t(key, options);
};
