/**
 * Context-aware translation pipeline.
 *
 * Replaces the per-string AWS Translate pass in `_scripts/translate.ts`. Same
 * contract -- read dictionary.json, write one JSON file per language, only touch
 * keys whose English actually changed -- but each string is translated with its
 * key, its call sites, its already-translated neighbours and a glossary in view.
 *
 * Usage:
 *   yarn translate:ai                          # all languages, changed keys only
 *   yarn translate:ai --only=ja,de             # a subset of languages
 *   yarn translate:ai --only=ja --limit=200    # sample run
 *   yarn translate:ai --only=ja --out=/tmp/x   # write elsewhere, leave src alone
 *   yarn translate:ai --all                    # ignore the delta, retranslate everything
 */

/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";

import ENGLISH_TERMS from "../../src/lib/i18n/dictionaries/dictionary.json";
import type { LanguageCode } from "../../src/lib/i18n/dictionaries/language";
import { LANGUAGE_DETAILS } from "../../src/lib/i18n/dictionaries/language";
import { getKeys } from "../../src/lib/object";

import { buildCallSiteIndex, siblingContext } from "./context";
import { buildGlossary, relevantGlossary } from "./glossary";
import { translateChunk, type TranslationRequest } from "./provider";
import { validateTranslation, type ValidationFailure } from "./validate";

const DICTIONARIES = path.join(__dirname, "../../src/lib/i18n/dictionaries");

/**
 * Languages deliberately left in English. Carried over from the legacy script
 * unchanged -- flipping this is a product decision, not a refactor.
 */
const EXCLUDED: LanguageCode[] = ["ru"];

const CHUNK_SIZE = 50;
const CONCURRENCY = 4;

type Terms = Record<string, string>;

const args = process.argv.slice(2);
const flag = (name: string): string | undefined =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const has = (name: string): boolean => args.includes(`--${name}`);

const readTerms = (file: string): Terms =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : {};

/**
 * Single write path, so --dry-run stays genuinely side-effect free.
 *
 * Serialisation deliberately matches the legacy script byte for byte (two-space
 * indent, no trailing newline). Switching pipelines should produce a diff of
 * real translation changes and nothing else.
 */
const writeTerms = (file: string, terms: Terms): void => {
  if (has("dry-run")) return;
  fs.writeFileSync(file, JSON.stringify(terms, null, 2));
};

const mapWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await fn(items[index]);
      }
    },
  );

  await Promise.all(workers);
  return results;
};

/**
 * Keys needing work: English changed since the last run, or never translated.
 * This is what keeps a routine push at a few cents instead of a full re-run.
 */
const changedKeys = (
  english: Terms,
  previousEnglish: Terms,
  existing: Terms,
): string[] =>
  getKeys(english).filter((key) => {
    if (!english[key]?.trim()) return false;
    if (!existing[key]) return true;
    return previousEnglish[key] !== english[key];
  });

/** Groups keys by top-level namespace so a chunk is thematically coherent. */
const chunkKeys = (keys: string[]): string[][] => {
  const byNamespace = new Map<string, string[]>();

  for (const key of keys) {
    // Dotless keys ("plant", "ok", "coins") are top-level UI labels. They share
    // one bucket rather than becoming a namespace each -- otherwise every such
    // key costs its own request and loses the shared-batch context.
    const namespace = key.includes(".") ? key.split(".")[0] : "(root)";
    byNamespace.set(namespace, [...(byNamespace.get(namespace) ?? []), key]);
  }

  const chunks: string[][] = [];
  for (const group of byNamespace.values()) {
    for (let i = 0; i < group.length; i += CHUNK_SIZE) {
      chunks.push(group.slice(i, i + CHUNK_SIZE));
    }
  }

  return chunks;
};

const translateLanguage = async (
  language: LanguageCode,
  english: Terms,
  previousEnglish: Terms,
  callSites: ReturnType<typeof buildCallSiteIndex>,
  outDir: string,
): Promise<void> => {
  const target = path.join(outDir, `${language}.json`);
  const existing = readTerms(path.join(DICTIONARIES, `${language}.json`));

  // Start from what already shipped, dropping keys no longer in the dictionary.
  //
  // Iteration order is the EXISTING file's, not the dictionary's. Rebuilding in
  // dictionary order rewrites all 9,592 lines on every run, which buries three
  // real changes in a 15,000-line reorder and makes the diff unreviewable.
  // Keys new to this language are appended as they are translated below.
  const result: Terms = {};
  for (const key of getKeys(existing)) {
    if (english[key] !== undefined) result[key] = existing[key];
  }

  if (EXCLUDED.includes(language)) {
    for (const key of getKeys(english)) result[key] = english[key];
    writeTerms(target, result);
    console.log(`${language}: excluded from translation, mirrored English`);
    return;
  }

  let pending = has("all")
    ? getKeys(english).filter((k) => english[k]?.trim())
    : changedKeys(english, previousEnglish, existing);

  // --keys targets an explicit set, bypassing the delta. Used for sampling a
  // known-bad subset without waiting for those strings to change upstream.
  const explicit = flag("keys");
  if (explicit) {
    pending = explicit.split(",").filter((key) => english[key]?.trim());
  }

  const limit = flag("limit");
  if (limit) pending = pending.slice(0, Number(limit));

  if (!pending.length) {
    writeTerms(target, result);
    console.log(`${language}: nothing to translate`);
    return;
  }

  const glossary = buildGlossary(existing);
  const chunks = chunkKeys(pending);
  console.log(
    `${language}: ${pending.length} keys in ${chunks.length} chunks ` +
      `(glossary: ${glossary.length} terms)`,
  );

  const failures: ValidationFailure[] = [];

  const toRequest = (key: string): TranslationRequest => {
    const siblings = siblingContext(key, english, existing);
    const sites = callSites
      .get(key)
      ?.map((s) => `${s.file}:${s.line} — ${s.snippet}`);
    return {
      key,
      en: english[key],
      ...(sites?.length ? { usedIn: sites } : {}),
      ...(siblings.length ? { siblings } : {}),
    };
  };

  // --dry-run prints the exact payload the model would receive and stops. The
  // whole design rests on this context being right, so make it inspectable.
  if (has("dry-run")) {
    const entries = chunks[0].map(toRequest);
    console.log(
      JSON.stringify(
        {
          language,
          glossary: relevantGlossary(
            glossary,
            entries.map((e) => e.en),
          ),
          entries,
        },
        null,
        2,
      ),
    );
    return;
  }

  const translated = await mapWithConcurrency(
    chunks,
    CONCURRENCY,
    async (chunk) => {
      const entries = chunk.map(toRequest);
      return translateChunk({
        targetLanguage: language,
        entries,
        glossary: relevantGlossary(
          glossary,
          entries.map((e) => e.en),
        ),
      });
    },
  );

  const merged: Terms = Object.assign({}, ...translated);

  // Validate, and retry anything that failed on its own -- a bad neighbour in a
  // batch is the usual cause, and a solo retry usually clears it.
  const retries: string[] = [];
  for (const key of pending) {
    const failure = validateTranslation(key, english[key], merged[key]);
    if (failure) retries.push(key);
    else result[key] = merged[key];
  }

  if (retries.length) {
    console.log(
      `${language}: retrying ${retries.length} failed keys individually`,
    );
    const repaired = await mapWithConcurrency(
      retries,
      CONCURRENCY,
      async (key) => {
        const entries = [toRequest(key)];
        const out = await translateChunk({
          targetLanguage: language,
          entries,
          glossary: relevantGlossary(glossary, [english[key]]),
        });
        return { key, translation: out[key] };
      },
    );

    for (const { key, translation } of repaired) {
      const failure = validateTranslation(key, english[key], translation);
      if (failure) {
        failures.push(failure);
        // Omit the key rather than pinning it to the English string.
        //
        // i18next is configured with fallbackLng: "en", so an absent key already
        // renders English -- identical to what the player would see either way.
        // The difference is the next run: a key pinned to English looks
        // translated, and since en.json advances at the end of this run the
        // delta never picks it up again, so it stays English forever. An absent
        // key is retried automatically.
        //
        // Deleting also matters when a previously-good translation is now stale
        // because the English changed: keeping it would ship a translation of
        // copy that no longer exists.
        delete result[key];
      } else {
        result[key] = translation;
      }
    }
  }

  writeTerms(target, result);

  if (failures.length) {
    console.warn(`${language}: ${failures.length} keys fell back to English:`);
    for (const f of failures)
      console.warn(`  ${f.key} (${f.reason}): ${f.detail}`);
  }
  console.log(`${language}: wrote ${getKeys(result).length} keys to ${target}`);
};

const run = async (): Promise<void> => {
  const outDir = flag("out") ?? DICTIONARIES;
  fs.mkdirSync(outDir, { recursive: true });

  const english = ENGLISH_TERMS as Terms;
  const previousEnglish = readTerms(path.join(DICTIONARIES, "en.json"));

  const only = flag("only")?.split(",") as LanguageCode[] | undefined;
  const languages = getKeys(LANGUAGE_DETAILS).filter(
    (l) => l !== "en" && (!only || only.includes(l)),
  );

  console.log("indexing call sites...");
  const callSites = buildCallSiteIndex();
  console.log(`indexed ${callSites.size} keys with call sites\n`);

  for (const language of languages) {
    await translateLanguage(
      language,
      english,
      previousEnglish,
      callSites,
      outDir,
    );
  }

  // English last, so a crash mid-run leaves the delta detectable on the next run.
  // Skipped when writing elsewhere -- en.json is the delta baseline, and moving
  // it forward after a sample run would hide real changes from the next real one.
  if (!flag("out")) {
    writeTerms(path.join(DICTIONARIES, "en.json"), english);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
