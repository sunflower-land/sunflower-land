/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";

import Anthropic from "@anthropic-ai/sdk";
// The ".mjs" is needed: vite-node cannot resolve this subpath without it.
import { betaJSONSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/beta/json-schema.mjs";

import ENGLISH_TERMS from "../src/lib/i18n/dictionaries/dictionary.json";
import { LANGUAGE_DETAILS } from "../src/lib/i18n/dictionaries/language";
import type { TranslationKeys } from "../src/lib/i18n/dictionaries/types";
import { getKeys } from "../src/lib/object";

import {
  buildUserMessage,
  LANGUAGE_NAMES,
  SYSTEM_PROMPT,
  type TargetLanguage,
} from "./translation/prompt";
import {
  mergeTranslations,
  planTranslation,
  validateTranslations,
  type ReturnedTranslation,
} from "./translation/terms";

type Terms = Partial<Record<TranslationKeys, string>>;

const MODEL = "claude-opus-5-5";

// Terms sent in one request. A normal run is a single request per language;
// this only splits a large catch-up, such as a newly added language.
const BATCH_SIZE = 100;

// How many times a language asks again for the terms it could not accept.
const MAX_ATTEMPTS = 3;

// Languages to exclude from translation (keep new terms in English)
const excludedLanguages: TargetLanguage[] = ["ru"];

const DICTIONARIES = path.join(__dirname, "../src/lib/i18n/dictionaries");

const TRANSLATIONS_FORMAT = betaJSONSchemaOutputFormat({
  type: "object",
  properties: {
    translations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          text: { type: "string" },
        },
        required: ["key", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["translations"],
  additionalProperties: false,
});

// Created on first use, so a run with nothing to translate needs no API key.
let client: Anthropic | undefined;
const getClient = () => (client ??= new Anthropic());

const usage = { input: 0, output: 0 };

function readTerms(file: string): Terms {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : {};
}

function writeTerms(file: string, terms: Terms) {
  fs.writeFileSync(file, `${JSON.stringify(terms, null, 2)}\n`);
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

// A bad key or a malformed request fails the same way every time. Anything
// else (rate limits, server errors, a response that could not be used) is
// worth another attempt.
function isFatal(error: unknown) {
  return (
    error instanceof Anthropic.BadRequestError ||
    error instanceof Anthropic.AuthenticationError ||
    error instanceof Anthropic.PermissionDeniedError ||
    error instanceof Anthropic.NotFoundError
  );
}

async function requestTranslations(
  language: TargetLanguage,
  terms: Record<string, string>,
): Promise<ReturnedTranslation[]> {
  const message = await getClient()
    .beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      // If the model declines a request, the API runs it again on its
      // default fallback model instead of returning the refusal.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      output_config: { effort: "medium", format: TRANSLATIONS_FORMAT },
      messages: [{ role: "user", content: buildUserMessage(language, terms) }],
    })
    .finalMessage();

  usage.input += message.usage.input_tokens;
  usage.output += message.usage.output_tokens;

  if (message.stop_reason !== "end_turn" || !message.parsed_output) {
    throw new Error(`Response stopped with "${message.stop_reason}"`);
  }

  return message.parsed_output.translations;
}

/**
 * Translates the terms a locale is missing and rewrites its file. Returns the
 * terms that could not be translated; they are left out of the file, so the
 * next run picks them up again.
 */
async function translateLanguage(
  language: TargetLanguage,
  snapshot: Terms,
): Promise<TranslationKeys[]> {
  const file = path.join(DICTIONARIES, `${language}.json`);

  const { kept, pending } = planTranslation({
    english: ENGLISH_TERMS,
    snapshot,
    existing: readTerms(file),
  });

  const translated: Terms = {};
  let remaining = pending;

  if (excludedLanguages.includes(language)) {
    pending.forEach((key) => {
      translated[key] = ENGLISH_TERMS[key].trim();
    });
    remaining = [];
  }

  let stopped = false;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS && !stopped; attempt++) {
    if (remaining.length === 0) break;

    for (const batch of chunk(remaining, BATCH_SIZE)) {
      const requested: Terms = {};
      batch.forEach((key) => {
        requested[key] = ENGLISH_TERMS[key].trim();
      });

      try {
        const returned = await requestTranslations(language, requested);
        const { accepted, rejected } = validateTranslations({
          requested,
          returned,
        });

        Object.assign(translated, accepted);
        getKeys(accepted).forEach((key) =>
          console.log(`[${language}] '${key}': '${accepted[key]}'`),
        );
        rejected.forEach(({ key, reason }) =>
          console.warn(
            `[${language}] Rejected '${key}' (${reason}), attempt ${attempt}`,
          ),
        );
      } catch (error) {
        console.error(
          `[${language}] Translation request failed, attempt ${attempt}:`,
          error instanceof Error ? error.message : String(error),
        );

        if (isFatal(error)) {
          stopped = true;
          break;
        }
      }
    }

    remaining = remaining.filter((key) => !Object.hasOwn(translated, key));
  }

  writeTerms(
    file,
    mergeTranslations({ english: ENGLISH_TERMS, kept, translated }),
  );

  return remaining;
}

async function runTranslations() {
  const languages = getKeys(LANGUAGE_DETAILS).filter(
    (language): language is TargetLanguage => language !== "en",
  );

  // This folder is not type-checked in CI, so a language added to
  // LANGUAGE_DETAILS without a name here would otherwise go unnoticed.
  const unnamed = languages.filter((language) => !LANGUAGE_NAMES[language]);
  if (unnamed.length > 0) {
    throw new Error(`Add ${unnamed.join(", ")} to LANGUAGE_NAMES`);
  }

  // en.json is the English text the locales were last translated from.
  const englishJson = path.join(DICTIONARIES, "en.json");
  const snapshot = readTerms(englishJson);

  const results = await Promise.all(
    languages.map(async (language) => ({
      language,
      failed: await translateLanguage(language, snapshot),
    })),
  );

  // Process English last
  writeTerms(englishJson, ENGLISH_TERMS);

  if (usage.input > 0) {
    console.log(`Tokens used: ${usage.input} in, ${usage.output} out`);
  }

  const failures = results.filter(({ failed }) => failed.length > 0);
  failures.forEach(({ language, failed }) =>
    console.error(
      `[${language}] ${failed.length} terms not translated: ${failed.join(", ")}`,
    ),
  );
  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

runTranslations().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
