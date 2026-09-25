import i18n from "lib/i18n";
import type { TOptions } from "i18next";
import type { TranslationKeys } from "./dictionaries/types";

export const translate = (
  key: TranslationKeys,
  options: TOptions = {},
): string => {
  return i18n.t(key, options);
};
