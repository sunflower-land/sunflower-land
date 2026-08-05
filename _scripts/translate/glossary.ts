/**
 * Glossary construction.
 *
 * Two jobs:
 *
 *  1. Terminology consistency. 432 item names appear inside 1,148 dictionary
 *     values ("Love Charm" alone shows up in 47 strings). Without a glossary the
 *     translator invents a fresh rendering each time, so the sentence and the
 *     inventory chip disagree.
 *  2. Brand protection. "Sunflower Land" is a product name, not a description of
 *     agricultural real estate.
 *
 * The terminology half is *derived*, not hand-maintained: `ITEM_DETAILS` already
 * maps item names to translation keys via `translatedName: translate("...")`, so
 * the canonical rendering for any language is whatever that key resolves to in
 * that language's dictionary. As more `translatedName` entries land, the
 * glossary grows on its own.
 */

import * as fs from "fs";
import * as path from "path";

const IMAGES = path.join(__dirname, "../../src/features/game/types/images.ts");

/**
 * Terms that stay verbatim in every language. Product and world nouns, not
 * gameplay vocabulary -- keep this list tight, because everything on it is a
 * word non-English players will read in English.
 */
export const DO_NOT_TRANSLATE = [
  "Sunflower Land",
  "Bumpkin",
  "Goblin",
  "Pumpkin Plaza",
  "Sunflorea",
  "Sunflower Isles",
];

export type GlossaryEntry = { en: string; translated: string };

/**
 * Extracts `itemName -> translationKey` from ITEM_DETAILS.
 *
 * Regex rather than the TS compiler because this file is 8k lines of mostly
 * image imports and we only need one field. Entries are matched on the
 * two-space-indented key that opens each object literal.
 */
export const itemTranslationKeys = (): Map<string, string> => {
  const source = fs.readFileSync(IMAGES, "utf-8");
  const body = source.slice(source.indexOf("export const ITEM_DETAILS"));

  const keys = new Map<string, string>();
  let current: string | undefined;

  for (const line of body.split("\n")) {
    const entry = line.match(
      /^ {2}(?:"([^"]+)"|([A-Za-z][A-Za-z0-9 '-]*)):\s*\{/,
    );
    if (entry) {
      current = entry[1] ?? entry[2];
      continue;
    }

    const translated = line.match(/translatedName:\s*translate\(\s*"([^"]+)"/);
    if (translated && current) {
      keys.set(current, translated[1]);
    }
  }

  return keys;
};

/**
 * Canonical EN -> target renderings for every item whose name is already
 * localised in this language. Items still missing a `translatedName` are simply
 * absent, and the model is told to leave unknown proper nouns alone.
 */
export const buildGlossary = (
  existing: Record<string, string>,
): GlossaryEntry[] => {
  const entries: GlossaryEntry[] = [];

  for (const [itemName, key] of itemTranslationKeys()) {
    const translated = existing[key];
    if (!translated || translated === itemName) continue;
    entries.push({ en: itemName, translated });
  }

  return entries.sort((a, b) => a.en.localeCompare(b.en));
};

/**
 * Only the glossary terms that actually occur in this batch. Shipping all ~1,500
 * on every request would dwarf the strings being translated; a per-chunk subset
 * keeps the prompt proportional to the work.
 */
export const relevantGlossary = (
  glossary: GlossaryEntry[],
  sources: string[],
): GlossaryEntry[] => {
  const haystack = sources.join("\n");
  return glossary.filter(({ en }) => haystack.includes(en));
};
