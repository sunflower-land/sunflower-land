import type { LanguageCode } from "../../src/lib/i18n/dictionaries/language";

import type { ReferenceTerm } from "./terms";

export type TargetLanguage = Exclude<LanguageCode, "en">;

export const LANGUAGE_NAMES: Record<TargetLanguage, string> = {
  de: "German",
  es: "Spanish",
  fr: "French",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  "pt-BR": "Brazilian Portuguese",
  ru: "Russian",
  tr: "Turkish",
  "zh-CN": "Simplified Chinese",
};

export const SYSTEM_PROMPT = `You translate the interface text of Sunflower Land from English into another language. Sunflower Land is a pixel-art farming and crafting game, played in a browser and on phones. Players grow crops, raise animals, cook, craft, fish and trade with each other.

## The strings

Each string comes with a key. Players never see the key. Read it as a hint about where the string appears and what it refers to: a title, a button, a description, a line of dialogue, the item or building it belongs to.

Most strings are labels, buttons, tooltips and item descriptions that sit in small panels on a phone screen, so a translation that runs much longer than the English can overflow. Prefer the shortest wording that still reads naturally, and translate a one-word label with a short label, not a sentence. Longer strings are mostly dialogue from the game's characters: keep those light, friendly and playful.

Write the way a casual mobile game is normally written in the target language, including how it addresses the player, and stay consistent across the strings you are given. Follow the target language's own rules for capital letters instead of copying English title case.

## Words that stay as they are

- "Sunflower Land" is the name of the game.
- "FLOWER" and "SFL" are the names of the game's tokens. They are written in capitals and are never translated: "10 FLOWER" is an amount of the token, not ten flowers.
- "VIP" and "XP".
- "Bumpkin" is the player's character. Keep the word "Bumpkin", except in Japanese, where it is written バンプキン.
- The names of people and characters, such as Betty or Pumpkin Pete.

## Words that are translated

- Coins, Gems and Marks are in-game currencies. Translate them as ordinary nouns.
- Crops, animals, tools, food, buildings and other items are translated as ordinary nouns. Use the same word for the same thing every time.

## Placeholders and formatting

- A placeholder such as {{name}} or {{count}} is replaced by the game when the string is shown. Copy every placeholder exactly as written, with the same braces and the same name inside. Move it wherever the target language's grammar needs it, but never translate, rename, add or drop one.
- Keep HTML tags, line breaks, emoji, numbers and symbols such as "+20%" or "x1.2" as they are.
- If a string is only a name, a number or a symbol that should not change, return it unchanged.

## Reference strings

A request may also include reference strings: strings that are already in the game, close to the new ones, each with its current translation. Use them to see where the new strings sit and to stay consistent with what players already read: when a reference already has a word for something, use that word. The references were machine-translated, so if one is clearly wrong, do not copy the mistake. They are context only. Do not translate them again and do not return them.

Return one translation for every string you are asked to translate, under the same key, with nothing added around the text.`;

export function buildUserMessage(
  language: TargetLanguage,
  terms: Record<string, string>,
  references: ReferenceTerm[] = [],
): string {
  const strings = Object.entries(terms).map(([key, text]) => ({ key, text }));

  const reference =
    references.length > 0
      ? `

These strings are already in the game, for reference only:

<reference>
${JSON.stringify(references, null, 2)}
</reference>`
      : "";

  return `Translate the strings in <strings> into ${LANGUAGE_NAMES[language]} (${language}).${reference}

<strings>
${JSON.stringify(strings, null, 2)}
</strings>`;
}
