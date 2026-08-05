/**
 * Context gathering.
 *
 * The legacy pipeline sent each string to the translator alone, with no key, no
 * neighbours and no idea where it renders. That is why `Plant` (a button on
 * SeedSelection) came back as ja "プラント" -- an industrial plant -- and why
 * `On` (a settings toggle) came back as de "Auf", a preposition.
 *
 * Two cheap signals fix most of that:
 *
 *  1. Call sites  -- `t("plant")` sits inside a <Button>, so it is an imperative
 *                    verb, not a noun.
 *  2. Siblings    -- neighbouring keys already translated into the target
 *                    language, which anchor register and terminology so a delta
 *                    run of three keys does not drift from the other 9,000.
 */

import * as fs from "fs";
import * as path from "path";

const SRC = path.join(__dirname, "../../src");

/** Matches t("key") and translate("key"); dynamic keys are simply not indexed. */
const KEY_CALL = /\b(?:t|translate)\(\s*"([A-Za-z0-9_.-]+)"/g;

export type CallSite = {
  /** Repo-relative path, e.g. src/features/island/plots/components/SeedSelection.tsx */
  file: string;
  line: number;
  /** The source line, trimmed and clipped -- enough to show the enclosing JSX. */
  snippet: string;
};

export type CallSiteIndex = Map<string, CallSite[]>;

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dictionaries") {
        continue;
      }
      walk(full, out);
    } else if (
      /\.tsx?$/.test(entry.name) &&
      !/\.test\.tsx?$/.test(entry.name)
    ) {
      out.push(full);
    }
  }
  return out;
};

/**
 * Scans src/ once and maps each literal translation key to where it renders.
 *
 * Roughly a third of keys resolve here; the rest are built dynamically and fall
 * back to sibling context alone. That is fine -- the statically resolvable ones
 * skew heavily towards the short, ambiguous labels that need disambiguating most.
 */
export const buildCallSiteIndex = (): CallSiteIndex => {
  const index: CallSiteIndex = new Map();

  for (const file of walk(SRC)) {
    const relative = path.relative(path.join(__dirname, "../.."), file);
    const lines = fs.readFileSync(file, "utf-8").split("\n");

    lines.forEach((text, i) => {
      for (const match of text.matchAll(KEY_CALL)) {
        const key = match[1];
        const sites = index.get(key) ?? [];
        // Two call sites are plenty of signal; more just costs tokens.
        if (sites.length < 2) {
          sites.push({
            file: relative,
            line: i + 1,
            snippet: text.trim().slice(0, 160),
          });
          index.set(key, sites);
        }
      }
    });
  }

  return index;
};

/**
 * Already-translated neighbours under the same dotted namespace, as EN -> target
 * pairs. Acts as a lightweight translation memory so incremental runs stay
 * consistent with what already shipped.
 */
export const siblingContext = (
  key: string,
  english: Record<string, string>,
  existing: Record<string, string>,
  limit = 6,
): { en: string; translated: string }[] => {
  const namespace = key.includes(".")
    ? key.slice(0, key.lastIndexOf("."))
    : undefined;
  if (!namespace) return [];

  const siblings: { en: string; translated: string }[] = [];

  for (const candidate of Object.keys(english)) {
    if (candidate === key) continue;
    if (!candidate.startsWith(`${namespace}.`)) continue;

    const translated = existing[candidate];
    if (!translated) continue;

    siblings.push({ en: english[candidate], translated });
    if (siblings.length >= limit) break;
  }

  return siblings;
};
