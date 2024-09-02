// useAppTranslation.ts
import { useTranslation as useOriginalTranslation } from "react-i18next";
import { TranslationKeys } from "./dictionaries/types";
import Decimal from "decimal.js-light";
import { useCallback } from "react";

// Define a custom hook that wraps the original useTranslation hook
export const useAppTranslation = () => {
  const { t: originalT, i18n } = useOriginalTranslation();

  // Here we cast the original t function to a more strictly typed version
  const t = useCallback(
    (
      key: TranslationKeys,
      args?: { [key: string]: string | number | Decimal },
    ) => originalT(key, args),
    [originalT],
  );

  return { t, i18n };
};
