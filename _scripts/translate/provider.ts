/**
 * Model adapter.
 *
 * Everything provider-specific lives behind `translateChunk`. Swapping vendors
 * means rewriting this file and nothing else -- the chunking, context gathering,
 * glossary and validation are all plain TypeScript.
 */

/* eslint-disable no-console */
import OpenAI from "openai";

import type { GlossaryEntry } from "./glossary";
import { DO_NOT_TRANSLATE } from "./glossary";
import { LANGUAGE_BRIEFS } from "./languages";
import type { LanguageCode } from "../../src/lib/i18n/dictionaries/language";
import { LANGUAGE_DETAILS } from "../../src/lib/i18n/dictionaries/language";

export type TranslationRequest = {
  key: string;
  en: string;
  usedIn?: string[];
  siblings?: { en: string; translated: string }[];
};

/**
 * Stable across every request, so it sits at the head of the prompt where prefix
 * caching can pick it up. Nothing language- or chunk-specific belongs here.
 */
const STYLE_GUIDE = `You are localising the UI of Sunflower Land, a pixel-art farming game.

You will receive a batch of UI strings as JSON. Return a translation for every
key you are given, in the same batch.

Each string may carry context:
  - "usedIn"   : source locations where the string renders. A string inside a
                 <Button> is an action label and should be an imperative or
                 infinitive verb, not a noun. A string in a modal heading is a
                 title. Use this to disambiguate English words that are both noun
                 and verb -- "Plant", "Build", "Craft", "Order", "Trade".
  - "siblings" : neighbouring strings already translated into this language.
                 Match their register, terminology and capitalisation. These are
                 the house style; follow them over your own preference.

Hard rules:

1. PLACEHOLDERS. Tokens of the form {{name}} are runtime substitutions. Reproduce
   every one exactly, including the braces and the name inside them. Never
   translate, reorder the characters within, pluralise, or drop one. You may move
   a placeholder within the sentence if the target grammar requires it.

2. PROPER NOUNS. Terms in the "doNotTranslate" list are product and world names.
   Reproduce them verbatim in every language.

3. GLOSSARY. Terms in the "glossary" list have a canonical rendering in this
   language. Use it exactly. These names also appear on inventory chips and item
   cards, so a sentence that renders an item differently to its chip is a bug.

4. UI TEXT, NOT PROSE. These are labels, buttons, tooltips and short dialogue.
   Do not add punctuation the source lacks. Do not add politeness the source
   lacks. Do not expand an abbreviation. Match the source's capitalisation
   convention as closely as the target language allows.

5. LENGTH. This is a pixel-art UI with tight bounds. Where a language offers a
   shorter natural equivalent, take it. Never pad.

6. LEAVE UNKNOWNS ALONE. If a string contains a capitalised game term that is not
   in the glossary, reproduce it in English rather than inventing a translation.

Return only the JSON object described by the schema.`;

/** Constant across requests, which keeps the schema cacheable. */
const SCHEMA = {
  type: "object",
  properties: {
    translations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          translation: { type: "string" },
        },
        required: ["key", "translation"],
        additionalProperties: false,
      },
    },
  },
  required: ["translations"],
  additionalProperties: false,
} as const;

let client: OpenAI | undefined;

const getClient = (): OpenAI => {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is not set. This is the same secret the codex review " +
          "workflow uses; add it to the job's env block.",
      );
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const translateChunk = async ({
  targetLanguage,
  entries,
  glossary,
  // `||` not `??`: an unset GitHub Actions variable arrives as an empty string,
  // which is not nullish and would be sent to the API as a blank model name.
  model = process.env.TRANSLATE_MODEL || "gpt-4.1",
}: {
  targetLanguage: LanguageCode;
  entries: TranslationRequest[];
  glossary: GlossaryEntry[];
  model?: string;
}): Promise<Record<string, string>> => {
  const languageName = LANGUAGE_DETAILS[targetLanguage].languageName;

  const system = [
    STYLE_GUIDE,
    `Target language: ${languageName} (${targetLanguage})`,
    LANGUAGE_BRIEFS[targetLanguage],
    JSON.stringify({
      doNotTranslate: DO_NOT_TRANSLATE,
      glossary: glossary.map(({ en, translated }) => [en, translated]),
    }),
  ].join("\n\n");

  const maxAttempts = 4;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await getClient().chat.completions.create({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(entries) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "translations", strict: true, schema: SCHEMA },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("model returned no content");

      const parsed = JSON.parse(content) as {
        translations: { key: string; translation: string }[];
      };

      return Object.fromEntries(
        parsed.translations.map(({ key, translation }) => [key, translation]),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (attempt === maxAttempts - 1) {
        throw new Error(
          `translation failed for ${targetLanguage} after ${maxAttempts} attempts: ${message}`,
        );
      }
      const backoff = 2 ** attempt * 500;
      console.warn(
        `  retry ${attempt + 1}/${maxAttempts - 1} for ${targetLanguage} in ${backoff}ms: ${message}`,
      );
      await sleep(backoff);
    }
  }

  /* istanbul ignore next -- loop either returns or throws */
  return {};
};
