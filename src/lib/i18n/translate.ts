import i18n from "lib/i18n";
import type { TOptions } from "i18next";
import type { TranslationKeys } from "./dictionaries/types";

export const translate = (
  key: TranslationKeys,
  options: TOptions = {},
): string => {
  return i18n.t(key, options);
};

// The "pixelmix" bitmap font used for in-world speech bubbles (SpeechBubble.ts)
// only ships glyphs for printable ASCII (code points 0x20-0x7E). Non-English
// locales translate into scripts it can't render, leaving the bubble blank.
const BITMAP_FONT_SUPPORTED = /^[\x20-\x7E]*$/;

/**
 * Same as `translate`, but falls back to the English string when the
 * translated text contains characters the world's bitmap speech-bubble font
 * can't render. Only use this for text passed into `BumpkinContainer.speak`
 * (and other `speak` implementations) - regular DOM/React text should keep
 * using `translate`, since browser fonts support full Unicode.
 */
export const translateForBubble = (
  key: TranslationKeys,
  options: TOptions = {},
): string => {
  const text = translate(key, options);

  if (BITMAP_FONT_SUPPORTED.test(text)) {
    return text;
  }

  return translate(key, { ...options, lng: "en" });
};
