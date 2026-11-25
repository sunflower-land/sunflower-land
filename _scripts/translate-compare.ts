/* eslint-disable no-console */
// TEMPORARY: remove before merging. Translates the strings listed in
// translate-compare-keys.json into German and Japanese with the same request
// code as translate.ts, and writes the results to translate-compare/ for the
// comparison workflow to upload. It never touches the locale files.
import * as fs from "fs";
import * as path from "path";

import ENGLISH_TERMS from "../src/lib/i18n/dictionaries/dictionary.json";
import type { TranslationKeys } from "../src/lib/i18n/dictionaries/types";
import { getKeys } from "../src/lib/object";

import KEYS from "./translate-compare-keys.json";
import { MODEL, requestTranslations } from "./translation/openai";
import type { TargetLanguage } from "./translation/prompt";
import { getReferenceTerms, validateTranslations } from "./translation/terms";

type Terms = Partial<Record<TranslationKeys, string>>;

const LANGUAGES: TargetLanguage[] = ["de", "ja"];
const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 3;
const OUT_DIR = path.join(__dirname, "../translate-compare");

const usage = { input: 0, output: 0 };

async function translateLanguage(language: TargetLanguage) {
  const done: Terms = {};
  let remaining = (KEYS as TranslationKeys[])
    .filter((key) => ENGLISH_TERMS[key]?.trim())
    .sort();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (remaining.length === 0) break;

    for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
      const batch = remaining.slice(i, i + BATCH_SIZE);
      const requested: Terms = {};
      batch.forEach((key) => (requested[key] = ENGLISH_TERMS[key].trim()));

      try {
        // Same references as the Claude sample: earlier results from this run.
        const references = getReferenceTerms({
          pending: batch,
          english: ENGLISH_TERMS,
          kept: done,
        });
        const response = await requestTranslations(
          language,
          requested as Record<string, string>,
          references,
        );
        usage.input += response.inputTokens;
        usage.output += response.outputTokens;

        const { accepted, rejected } = validateTranslations({
          requested,
          returned: response.translations,
        });
        Object.assign(done, accepted);
        console.log(
          `[${language}] attempt ${attempt}: ${getKeys(accepted).length} done, ` +
            `${rejected.length} rejected` +
            (rejected.length
              ? ` (${rejected.map((r) => `${r.key}: ${r.reason}`).join(", ")})`
              : ""),
        );
      } catch (error) {
        console.error(
          `[${language}] attempt ${attempt} failed:`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    remaining = remaining.filter((key) => !Object.hasOwn(done, key));
  }

  const ordered: Terms = {};
  getKeys(ENGLISH_TERMS).forEach((key) => {
    if (Object.hasOwn(done, key)) ordered[key] = done[key];
  });
  fs.writeFileSync(
    path.join(OUT_DIR, `${language}.json`),
    `${JSON.stringify(ordered, null, 2)}\n`,
  );

  return remaining;
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(
    `Translating ${KEYS.length} strings into ${LANGUAGES.join(", ")} with ${MODEL}`,
  );

  const results = await Promise.all(
    LANGUAGES.map(async (language) => ({
      language,
      failed: await translateLanguage(language),
    })),
  );

  console.log(`Tokens: ${usage.input} in, ${usage.output} out`);
  const failures = results.filter(({ failed }) => failed.length > 0);
  failures.forEach(({ language, failed }) =>
    console.error(`[${language}] ${failed.length} strings not translated`),
  );
  if (failures.length > 0) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
