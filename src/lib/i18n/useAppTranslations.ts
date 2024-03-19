// useAppTranslation.ts
import { useTranslation as useOriginalTranslation } from "react-i18next";
import { TranslationKeys } from "./dictionaries/types";

// Define a custom hook that wraps the original useTranslation hook
export const useAppTranslation = () => {
  const { t: originalT } = useOriginalTranslation();

  // Here we cast the original t function to a more strictly typed version
  const t = (key: TranslationKeys, args?: { [key: string]: string | number }) =>
    originalT(key, args);

  return { t };
};
