/**
 * Post-translation validation.
 *
 * The legacy AWS pipeline tokenised `{{placeholders}}` into `[0@/$]` markers and
 * swapped them back afterwards -- except on the retry path, which forgot to swap
 * them back (see `_scripts/translate.ts`). That leaked raw markers into it.json
 * and ja.json, and silently dropped placeholders from ~30 strings across the
 * other locales.
 *
 * We no longer tokenise: the model is told to preserve placeholders verbatim and
 * we verify it did. A translation that loses a placeholder is rejected rather
 * than shipped, because a missing `{{amount}}` renders as a broken sentence.
 */

const PLACEHOLDER = /{{\s*[^{}]+?\s*}}/g;

/** Legacy AWS marker; anything matching this in output is a bug leaking through. */
const LEGACY_TOKEN = /\[\d+@\/\$\]/;

export type ValidationFailure = {
  key: string;
  reason: "missing-placeholder" | "legacy-token" | "empty";
  detail: string;
};

export const placeholdersIn = (text: string): string[] =>
  text.match(PLACEHOLDER)?.map((p) => p.trim()) ?? [];

/**
 * Returns a failure when `translated` is unusable, or `undefined` when it passes.
 *
 * Placeholder comparison is order-insensitive and count-sensitive: word order
 * legitimately changes between languages, but dropping or duplicating a
 * placeholder does not.
 */
export const validateTranslation = (
  key: string,
  source: string,
  translated: string | undefined,
): ValidationFailure | undefined => {
  if (!translated?.trim()) {
    return { key, reason: "empty", detail: "model returned an empty string" };
  }

  if (LEGACY_TOKEN.test(translated)) {
    return {
      key,
      reason: "legacy-token",
      detail: `contains a legacy AWS marker: ${translated}`,
    };
  }

  const expected = placeholdersIn(source);
  const actual = placeholdersIn(translated);
  if (!expected.length && !actual.length) return undefined;

  const tally = (list: string[]) =>
    list.reduce<Record<string, number>>(
      (acc, p) => ({ ...acc, [p]: (acc[p] ?? 0) + 1 }),
      {},
    );

  const want = tally(expected);
  const got = tally(actual);

  // Compared in both directions. Checking only that every source placeholder
  // survives would let an invented one through -- a translation that adds
  // {{amount}} where the source had none renders the literal braces in-game,
  // because nothing supplies that value.
  const wrong = [
    ...new Set([...Object.keys(want), ...Object.keys(got)]),
  ].filter((p) => (want[p] ?? 0) !== (got[p] ?? 0));

  if (wrong.length) {
    return {
      key,
      reason: "missing-placeholder",
      detail: `expected ${expected.join(", ")} but got ${
        actual.length ? actual.join(", ") : "none"
      }`,
    };
  }

  return undefined;
};
