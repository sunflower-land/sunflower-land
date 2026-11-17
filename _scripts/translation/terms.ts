import { getKeys } from "../../src/lib/object";

// Whether a term is in one of these maps is always checked with
// Object.hasOwn: a key such as "constructor" or "toString" would otherwise
// read as present on every object.
type Terms<K extends string> = Partial<Record<K, string>>;

export type ReturnedTranslation = { key: string; text: string };

export type RejectionReason = "missing" | "empty" | "placeholders";

/**
 * The i18next placeholders in a string, e.g. ["{{price}}", "{{item}}"].
 */
export function getPlaceholders(text: string): string[] {
  return text.match(/{{.*?}}/g) ?? [];
}

/**
 * Works out which terms a locale can keep and which need translating.
 *
 * `snapshot` is en.json: the English text as it was when the locale was last
 * translated. A term is kept only if the locale has it and its English text is
 * unchanged since then, so new terms, edited terms and terms a previous run
 * failed on are all picked up again.
 */
export function planTranslation<K extends string>({
  english,
  snapshot,
  existing,
}: {
  english: Record<K, string>;
  snapshot: Terms<K>;
  existing: Terms<K>;
}): { kept: Terms<K>; pending: K[] } {
  const kept: Terms<K> = {};

  // Keep the locale file's own key order, so a run only adds lines to it.
  getKeys(existing).forEach((key) => {
    if (
      Object.hasOwn(english, key) &&
      existing[key] &&
      snapshot[key] === english[key]
    ) {
      kept[key] = existing[key];
    }
  });

  const pending = getKeys(english).filter(
    (key) => !Object.hasOwn(kept, key) && english[key].trim() !== "",
  );

  return { kept, pending };
}

/**
 * Builds the locale file: the kept terms, then the new ones in dictionary
 * order. A term with no translation is left out, which makes the next run
 * translate it again.
 */
export function mergeTranslations<K extends string>({
  english,
  kept,
  translated,
}: {
  english: Record<K, string>;
  kept: Terms<K>;
  translated: Terms<K>;
}): Terms<K> {
  const merged: Terms<K> = { ...kept };

  getKeys(english).forEach((key) => {
    if (Object.hasOwn(merged, key)) return;

    if (english[key].trim() === "") {
      merged[key] = "";
    } else if (Object.hasOwn(translated, key)) {
      merged[key] = translated[key];
    }
  });

  return merged;
}

/**
 * Checks what the model returned against what was asked for. A translation is
 * accepted only if its key was requested, it is not empty and it uses each
 * placeholder of the English text the same number of times.
 */
export function validateTranslations<K extends string>({
  requested,
  returned,
}: {
  requested: Terms<K>;
  returned: ReturnedTranslation[];
}): { accepted: Terms<K>; rejected: { key: K; reason: RejectionReason }[] } {
  const accepted: Terms<K> = {};
  const reasons = new Map<K, RejectionReason>();

  // The keys come back from the model, so "constructor" and the like must not
  // pass as requested terms.
  const isRequested = (key: string): key is K => Object.hasOwn(requested, key);

  returned.forEach(({ key, text }) => {
    if (!isRequested(key) || Object.hasOwn(accepted, key)) return;

    const translation = text.trim();
    if (!translation) {
      reasons.set(key, "empty");
      return;
    }

    // Sorted, not de-duplicated: a placeholder the English uses twice must
    // appear twice, in any order.
    const expected = getPlaceholders(requested[key] ?? "").sort();
    const actual = getPlaceholders(translation).sort();
    const samePlaceholders =
      expected.length === actual.length &&
      expected.every((placeholder, index) => placeholder === actual[index]);
    if (!samePlaceholders) {
      reasons.set(key, "placeholders");
      return;
    }

    accepted[key] = translation;
    reasons.delete(key);
  });

  const rejected = getKeys(requested)
    .filter((key) => !Object.hasOwn(accepted, key))
    .map((key) => ({ key, reason: reasons.get(key) ?? ("missing" as const) }));

  return { accepted, rejected };
}

export type ReferenceTerm = {
  key: string;
  english: string;
  translation: string;
};

// A reference is there to show wording, so a paragraph of dialogue is not
// worth the room it takes in the prompt.
const MAX_REFERENCE_LENGTH = 200;

/**
 * Picks strings the locale has already translated to send along as context
 * for the pending ones: those whose key shares the longest prefix with a
 * pending key ("market.buy.*" before "market.*").
 *
 * They show where a new string sits and how the locale already words things.
 * New strings in the same group share their references.
 */
export function getReferenceTerms<K extends string>({
  pending,
  english,
  kept,
  perTerm = 4,
  limit = 80,
}: {
  pending: K[];
  english: Record<K, string>;
  kept: Terms<K>;
  perTerm?: number;
  limit?: number;
}): ReferenceTerm[] {
  const waiting = new Set(pending);
  const candidates = getKeys(english).filter(
    (key) =>
      !waiting.has(key) &&
      Object.hasOwn(kept, key) &&
      !!kept[key] &&
      english[key].length <= MAX_REFERENCE_LENGTH,
  );

  const chosen = new Set<K>();

  for (const key of pending) {
    const parts = key.split(".");
    // A shorter prefix matches the longer one's strings again, so remember
    // which ones already count for this key.
    const found = new Set<K>();

    // Longest prefix first, then one segment shorter at a time.
    for (let depth = parts.length - 1; depth >= 1; depth--) {
      const prefix = `${parts.slice(0, depth).join(".")}.`;

      for (const candidate of candidates) {
        if (found.size >= perTerm) break;
        if (found.has(candidate) || !candidate.startsWith(prefix)) continue;

        if (!chosen.has(candidate)) {
          if (chosen.size >= limit) break;
          chosen.add(candidate);
        }
        found.add(candidate);
      }
    }
  }

  return candidates
    .filter((key) => chosen.has(key))
    .map((key) => ({
      key,
      english: english[key],
      translation: kept[key] ?? "",
    }));
}

// A name in the dictionary: an item, building or character, such as
// "Carrot Juice" or "Spaghetti al Limone". Short, starts with a capital and
// is not a sentence.
function isName(text: string): boolean {
  return (
    text.length <= 40 &&
    text.split(/\s+/).length <= 4 &&
    /^\p{Lu}/u.test(text) &&
    !/[.!?:;,{}\n]/.test(text)
  );
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Picks names that the pending strings mention ("Cook Carrot Juice 20 times"
 * mentions "Carrot Juice") and sends their current translation along, so the
 * name reads the same in the new string as everywhere else in the game.
 *
 * Matching is by whole words with the same capitals. A one-word name at the
 * very start of a string is skipped, since that capital says nothing. The
 * longest name wins over a name inside it.
 */
export function getNameReferences<K extends string>({
  pending,
  english,
  kept,
  perTerm = 6,
  limit = 40,
}: {
  pending: K[];
  english: Record<K, string>;
  kept: Terms<K>;
  perTerm?: number;
  limit?: number;
}): ReferenceTerm[] {
  const waiting = new Set(pending);

  // For each name, how often each translation is used and its first key.
  const usage = new Map<string, Map<string, { key: K; count: number }>>();
  getKeys(english).forEach((key) => {
    const name = english[key].trim();
    const translation = kept[key];
    if (waiting.has(key) || !Object.hasOwn(kept, key) || !translation) return;
    if (!isName(name)) return;

    const translations = usage.get(name) ?? new Map();
    const seen = translations.get(translation);
    translations.set(translation, {
      key: seen?.key ?? key,
      count: (seen?.count ?? 0) + 1,
    });
    usage.set(name, translations);
  });

  // Each name once, with the translation most of its entries use.
  const names = [...usage.entries()]
    .map(([name, translations]) => {
      const [translation, { key }] = [...translations.entries()].reduce(
        (best, entry) => (entry[1].count > best[1].count ? entry : best),
      );
      return { name, translation, key };
    })
    // Longest first, so "Carrot Juice" is matched before "Juice".
    .sort((a, b) => b.name.length - a.name.length);

  const chosen = new Map<K, ReferenceTerm>();

  for (const key of pending) {
    const text = english[key];
    const covered: [number, number][] = [];
    let found = 0;

    for (const { name, translation, key: nameKey } of names) {
      if (found >= perTerm) break;
      if (!text.includes(name)) continue;

      const pattern = new RegExp(
        `(?<![\\p{L}\\p{N}])${escapeRegExp(name)}(?![\\p{L}\\p{N}])`,
        "gu",
      );
      const singleWord = !/\s/.test(name);
      const match = [...text.matchAll(pattern)].find(
        ({ index }) =>
          !(singleWord && index === 0) &&
          !covered.some(
            ([start, end]) => index < end && index + name.length > start,
          ),
      );
      if (!match) continue;

      covered.push([match.index, match.index + name.length]);
      found++;
      if (!chosen.has(nameKey)) {
        if (chosen.size >= limit) break;
        chosen.set(nameKey, { key: nameKey, english: name, translation });
      }
    }
  }

  return getKeys(english)
    .filter((key) => chosen.has(key))
    .map((key) => chosen.get(key) as ReferenceTerm);
}
