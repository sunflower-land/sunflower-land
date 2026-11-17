import { getKeys } from "../../src/lib/object";

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
    (key) => kept[key] === undefined && english[key].trim() !== "",
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
    if (merged[key] !== undefined) return;

    if (english[key].trim() === "") {
      merged[key] = "";
    } else if (translated[key] !== undefined) {
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
  const reasons: Partial<Record<K, RejectionReason>> = {};

  // The keys come back from the model, so "constructor" and the like must not
  // pass as requested terms.
  const isRequested = (key: string): key is K => Object.hasOwn(requested, key);

  returned.forEach(({ key, text }) => {
    if (!isRequested(key) || accepted[key] !== undefined) return;

    const translation = text.trim();
    if (!translation) {
      reasons[key] = "empty";
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
      reasons[key] = "placeholders";
      return;
    }

    accepted[key] = translation;
    delete reasons[key];
  });

  const rejected = getKeys(requested)
    .filter((key) => accepted[key] === undefined)
    .map((key) => ({ key, reason: reasons[key] ?? ("missing" as const) }));

  return { accepted, rejected };
}
