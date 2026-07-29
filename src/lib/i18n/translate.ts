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
// Requires at least one character so an empty translation doesn't count as
// "supported" - that would render the exact blank bubble this fixes.
const BITMAP_FONT_SUPPORTED = /^[\x20-\x7E]+$/;

const FALLBACK_BUBBLE_TEXT = "...";

/**
 * Same as `translate`, but falls back to the English string when the
 * translated text contains characters the world's bitmap speech-bubble font
 * can't render (or is empty). Only use this for text passed into
 * `BumpkinContainer.speak` (and other `speak` implementations) - regular
 * DOM/React text should keep using `translate`, since browser fonts support
 * full Unicode.
 */
export const translateForBubble = (
  key: TranslationKeys,
  options: TOptions = {},
): string => {
  const text = translate(key, options);

  if (BITMAP_FONT_SUPPORTED.test(text)) {
    return text;
  }

  const englishText = translate(key, { ...options, lng: "en" });

  return BITMAP_FONT_SUPPORTED.test(englishText)
    ? englishText
    : FALLBACK_BUBBLE_TEXT;
};
