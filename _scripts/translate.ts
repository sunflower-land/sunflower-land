/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";

import ENGLISH_TERMS from "../src/lib/i18n/dictionaries/dictionary.json";
import {
  LanguageCode,
  languageDetails,
} from "../src/lib/i18n/dictionaries/language";
import { getKeys } from "../src/features/game/types/decorations";
import { TranslationKeys } from "../src/lib/i18n/dictionaries/types";

import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

// Set up the Translate client
const client = new TranslateClient({ region: "ap-southeast-2" });

// Utility function for sleep (backoff)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Languages to exclude from translation (keep new terms in English)
const excludedLanguages: LanguageCode[] = ["ru"];

async function translateTerms(targetLanguage: LanguageCode) {
  const translatedTerms: Partial<Record<TranslationKeys, string>> = {};

  const languageJson = path.join(
    __dirname,
    `../src/lib/i18n/dictionaries/${targetLanguage}.json`,
  );

  const englishJson = path.join(
    __dirname,
    `../src/lib/i18n/dictionaries/en.json`,
  );

  const englishTermKeys = getKeys(ENGLISH_TERMS);
  const existingEnglishTerms = JSON.parse(
    fs.readFileSync(englishJson, "utf-8"),
  );
  // Check if the target language file already exists
  if (fs.existsSync(languageJson)) {
    const existingTerms = JSON.parse(fs.readFileSync(languageJson, "utf-8"));
    const existingTermKeys = getKeys(existingTerms) as TranslationKeys[];
    existingTermKeys.forEach((term) => {
      if (
        englishTermKeys.includes(term) &&
        existingTerms[term] &&
        existingEnglishTerms[term] === ENGLISH_TERMS[term]
      ) {
        translatedTerms[term] = existingTerms[term];
      }
    });
  }

  // Group terms into batches (e.g., 10 terms per batch)
  const batchSize = 10;
  const termBatches: TranslationKeys[][] = [];
  for (let i = 0; i < englishTermKeys.length; i += batchSize) {
    termBatches.push(englishTermKeys.slice(i, i + batchSize));
  }

  // Sequentially process each batch
  for (const termBatch of termBatches) {
    for (const term of termBatch) {
      if (translatedTerms[term]) {
        // Term already translated (either from existing file or skipped)
        continue;
      }

      let englishText = ENGLISH_TERMS[term].trim();
      if (!englishText) {
        console.warn("Skipping empty term:", term);
        translatedTerms[term] = ""; // Return an empty string for empty terms
        continue;
      }

      if (excludedLanguages.includes(targetLanguage)) {
        // Skip translation for excluded languages
        translatedTerms[term] = englishText;
        continue;
      }

      const regex = /{{(.*?)}}/g;
      // Extract all placeholders
      const placeholders: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = regex.exec(englishText)) !== null) {
        placeholders.push(match[0]); // match[0] contains the full placeholder, e.g., "{{name}}"
      }

      // Replace all of our placeholders with some other string that won't get translated
      placeholders.forEach((str, index) => {
        const token = `[${index}@/$]`; // [0@/$], [1@/$], [2@/$] etc.
        englishText = englishText.replace(str, token);
      });

      const params = {
        Text: englishText,
        SourceLanguageCode: "en",
        TargetLanguageCode: targetLanguage,
      };
      const command = new TranslateTextCommand(params);

      try {
        const response = await client.send(command);
        let translatedText = response.TranslatedText || "";
        placeholders.forEach((str, index) => {
          const token = `[${index}@/$]`;
          translatedText = translatedText.replace(token, str);
        });
        // Put all of our placeholders back into the string
        translatedTerms[term] = translatedText;
        console.log(`'${term}': '${translatedText}'`);
      } catch (error) {
        console.error(
          "Translation error for term",
          term,
          targetLanguage,
          ":",
          error instanceof Error ? error.message : String(error),
        );

        // Implement exponential backoff with a maximum retry count
        const maxRetries = 5;
        let retries = 0;
        while (retries < maxRetries) {
          const backoffTime = Math.pow(2, retries) * 100; // Exponential backoff
          await sleep(backoffTime);
          try {
            const response = await client.send(command);
            translatedTerms[term] = response.TranslatedText;
            break;
          } catch (retryError) {
            console.error(
              "Retry translation error for term",
              term,
              targetLanguage,
              ":",
              retryError instanceof Error
                ? retryError.message
                : String(retryError),
            );
            retries++;
          }
        }
      }
    }
  }

  fs.writeFile(
    languageJson,
    JSON.stringify(translatedTerms, null, 2),
    () => undefined,
  );
}

async function englishToJSON() {
  const languageJson = path.join(
    __dirname,
    `../src/lib/i18n/dictionaries/en.json`,
  );
  fs.writeFileSync(languageJson, JSON.stringify(ENGLISH_TERMS, null, 2));
}

async function runTranslations() {
  const languages = getKeys(languageDetails);

  // Translate all languages except English first
  for (const lang of languages) {
    if (lang !== "en") {
      await translateTerms(lang);
    }
  }

  // Process English last
  await englishToJSON();
}

runTranslations();
