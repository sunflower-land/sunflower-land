/**
 * Pure merge helpers deciding what carries forward into a language file.
 *
 * These live apart from the orchestration so they can be tested directly. Both
 * of them have already shipped a bug: `seedFromExisting` originally iterated the
 * dictionary rather than the existing file, rewriting all 9,592 lines on every
 * run; `mirrorEnglish` originally overwrote every key, which wiped all 9,519
 * Russian strings in one commit. They are small, they are load-bearing, and they
 * are worth testing.
 */

export type Terms = Record<string, string>;

/**
 * Carries existing translations forward, dropping keys no longer in the
 * dictionary.
 *
 * Iterates the EXISTING file's key order, not the dictionary's. Rebuilding in
 * dictionary order reshuffles the whole file whenever the dictionary's own order
 * shifts, burying a handful of real changes in a whole-file diff. Keys new to
 * this language are appended by the caller as they are translated.
 */
export const seedFromExisting = (existing: Terms, english: Terms): Terms => {
  const seeded: Terms = {};
  for (const key of Object.keys(existing)) {
    if (english[key] !== undefined) seeded[key] = existing[key];
  }
  return seeded;
};

/**
 * Fills a language that is excluded from translation with English, without
 * discarding what it already has.
 *
 * Excluded languages (currently `ru`) keep new terms in English rather than
 * machine-translating them -- but they still hold thousands of human
 * translations, and those must survive. Only two cases take English: a key with
 * no existing translation, and a key whose English source has changed since the
 * last run, whose old translation now describes copy that no longer exists.
 *
 * This mirrors the legacy AWS script. Whether a changed string should really
 * lose its human translation is a product decision, not a refactor -- so the
 * behaviour is kept identical rather than quietly improved.
 */
export const mirrorEnglish = (
  seeded: Terms,
  english: Terms,
  previousEnglish: Terms,
): Terms => {
  const result: Terms = { ...seeded };

  for (const key of Object.keys(english)) {
    const untranslated = result[key] === undefined;
    const sourceChanged = previousEnglish[key] !== english[key];
    if (untranslated || sourceChanged) result[key] = english[key];
  }

  return result;
};
