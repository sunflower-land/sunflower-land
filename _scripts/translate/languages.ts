/**
 * Per-language briefs.
 *
 * Each brief is appended to the shared style guide. They exist to pre-empt the
 * specific failures the legacy pipeline shipped -- every "avoid" below is a real
 * string currently live in the dictionaries, not a hypothetical.
 *
 * These are a starting point, not doctrine. Community translators will know
 * better than any model or engineer what reads naturally in-game; treat this
 * file as the thing they edit.
 */

import type { LanguageCode } from "../../src/lib/i18n/dictionaries/language";

export const LANGUAGE_BRIEFS: Record<LanguageCode, string> = {
  en: "Source language; not translated.",

  de: [
    "Use du/dein, never Sie -- this is a casual farming game.",
    'Toggle states are "An"/"Aus", never "Auf"/"Zu". `on` currently ships as "Auf", which is a preposition.',
    "Button labels are imperative verbs: Bauen, Pflanzen, Ernten -- not the noun form.",
    "German compounds run long; prefer the shorter synonym when a label sits on a HUD chip.",
  ].join("\n"),

  es: [
    "Use tú, not usted.",
    "Button labels are infinitives: Plantar, Construir, Cosechar.",
    '"Land" in this game is the player\'s island, not terrain -- do not render it as "terrestre".',
  ].join("\n"),

  fr: [
    "Use tu, not vous.",
    'Do not add punctuation the source does not have. `ok` currently ships as "OK." with an invented full stop.',
    'Currency is "Pièces", not "Monnaies". Gems are "Gemmes", not "Pierres précieuses" -- the latter overflows the HUD chip.',
    "Button labels are infinitives: Planter, Construire, Récolter.",
  ].join("\n"),

  id: [
    "Use informal kamu, not Anda.",
    "Button labels are base verbs: Tanam, Bangun, Panen.",
  ].join("\n"),

  it: [
    "Use tu, not Lei.",
    "Button labels are infinitives: Piantare, Costruire, Raccogliere.",
  ].join("\n"),

  ja: [
    "Casual game register: use です/ます sparingly on labels, plainer forms on buttons.",
    "Do NOT transliterate gameplay verbs into katakana. `plant` currently ships as「プラント」(an industrial plant) and `build` as「ビルド」(a software build). Use 植える and 建てる.",
    "Katakana is correct for genuine loanwords and item names, wrong for actions the player performs.",
    "Japanese runs long in pixel-art UI; prefer the shortest natural form for labels.",
  ].join("\n"),

  "pt-BR": [
    "Brazilian Portuguese, informal você.",
    "Button labels are infinitives: Plantar, Construir, Colher.",
  ].join("\n"),

  ru: [
    "Informal ты.",
    "Watch grammatical case around {{placeholders}} -- the substituted value is usually a number or an item name in nominative form.",
    "Button labels are imperatives: Посадить, Построить, Собрать.",
  ].join("\n"),

  tr: [
    "Informal sen.",
    "Turkish agglutination makes placeholder suffixes fragile -- keep {{placeholders}} whole and place them where the suffix still reads correctly.",
    "This locale currently drops placeholders more than any other (8 strings); preserving them matters most here.",
  ].join("\n"),

  "zh-CN": [
    "Simplified Chinese, casual game register.",
    "Button labels are short verbs: 种植, 建造, 收获.",
    "Prefer two-character labels where natural -- the HUD is tight.",
  ].join("\n"),
};
