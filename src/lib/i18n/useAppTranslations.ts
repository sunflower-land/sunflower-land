// useAppTranslation.ts
import { useTranslation as useOriginalTranslation } from "react-i18next";
import type { TranslationKeys } from "./dictionaries/types";
import type Decimal from "decimal.js-light";

// Define a custom hook that wraps the original useTranslation hook
export const useAppTranslation = () => {
  const { t, i18n } = useOriginalTranslation();

  return {
    t: t as (
      key: TranslationKeys,
      args?: { [key: string]: string | number | Decimal },
    ) => ReturnType<typeof t>,
    i18n,
  };
};
