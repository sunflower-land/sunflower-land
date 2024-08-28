/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";

import { ENGLISH_TERMS } from "../src/lib/i18n/dictionaries/englishDictionary";
import { LanguageCode } from "../src/lib/i18n/dictionaries/dictionary";
import { getKeys } from "../src/features/game/types/decorations";
import { TranslationKeys } from "../src/lib/i18n/dictionaries/types";

import fr from "../src/lib/i18n/dictionaries/fr.json";
import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

// Set up the Translate client
const client = new TranslateClient({ region: "ap-southeast-2" });

async function translateTerms(targetLanguage: string) {
  const translatedTerms = {};

  // Batch translation: Group terms into batches (e.g., 10 terms per batch)
  const batchSize = 10;
  const termKeys = Object.keys(ENGLISH_TERMS);
  const termBatches: string[][] = [];
  for (let i = 0; i < termKeys.length; i += batchSize) {
    termBatches.push(termKeys.slice(i, i + batchSize));
  }

  // Parallelize translation requests
  await Promise.all(
    termBatches.map(async (batch) => {
      const batchTranslations = await Promise.all(
        batch.map(async (term) => {
          const englishText = ENGLISH_TERMS[term];
          console.log(`'${term}': '${englishText}'`);
          if (!englishText.trim()) {
            console.warn("Skipping empty term:", term);
            return ""; // Return an empty string for empty terms
          }
          try {
            const params = {
              Text: englishText,
              SourceLanguageCode: "en",
              TargetLanguageCode: targetLanguage,
            };
            const command = new TranslateTextCommand(params);
            const response = await client.send(command);
            const translatedText = response.TranslatedText;
            console.log(`'${term}': '${translatedText}'`);
            return translatedText;
          } catch (error) {
            console.error(
              "Translation error for term",
              term,
              targetLanguage,
              ":",
              error.message,
            );
            // Implement backoff and retry logic here
            await sleep(1000); // Wait for 1 second before retrying
            return ""; // Return an empty string for failed translations
          }
        }),
      );
      batch.forEach((term, index) => {
        translatedTerms[term] = batchTranslations[index];
      });
    }),
  );

  return translatedTerms;
}

// Utility function for sleep (backoff)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(language: string) {
  const translatedTerms = await translateTerms(language);
  console.log(translatedTerms);

  const languageJson = path.join(
    __dirname,
    `../src/lib/i18n/dictionaries/${language}.json`,
  );
  fs.writeFile(languageJson, JSON.stringify(translatedTerms), () => undefined);
}

main("fr");
main("zh-CN");
main("ru");
main("pt-BR");
// Parse the command line arguments
// const args = process.argv.slice(2); // Remove the first two arguments (node and script path)
// const targetLanguage = args[0]; // The first argument should be the language code (e.g., "fr")

// if (targetLanguage) {
//   main(targetLanguage);
// } else {
//   console.error(
//     "Please provide a target language code (e.g., yarn translate fr (for french)).",
//   );
// }
