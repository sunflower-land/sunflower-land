// useAppTranslation.ts
import { useTranslation as useOriginalTranslation } from "react-i18next";
import { TranslationKeys } from "./dictionaries/types";
import Decimal from "decimal.js-light";

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
