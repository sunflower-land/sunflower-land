/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";

import { ENGLISH_TERMS } from "../src/lib/i18n/dictionaries/englishDictionary";
import {
  LanguageCode,
  languageDetails,
} from "../src/lib/i18n/dictionaries/dictionary";
import { getKeys } from "../src/features/game/types/decorations";
import { TranslationKeys } from "../src/lib/i18n/dictionaries/types";

import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

// Set up the Translate client
const client = new TranslateClient({ region: "ap-southeast-2" });

// Utility function for sleep (backoff)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateTerms(targetLanguage: string) {
  const translatedTerms = {};

  // Check if the target language file already exists
  const languageJson = path.join(
    __dirname,
    `../src/lib/i18n/dictionaries/${targetLanguage}.json`,
  );
  if (fs.existsSync(languageJson)) {
    const existingTerms = JSON.parse(fs.readFileSync(languageJson, "utf-8"));
    for (const term of Object.keys(ENGLISH_TERMS)) {
      if (existingTerms[term]) {
        console.log(`Skipping existing term in ${targetLanguage}: ${term}`);
        translatedTerms[term] = existingTerms[term];
      }
    }
  }

  // Group terms into batches (e.g., 10 terms per batch)
  const batchSize = 10;
  const termKeys = getKeys(ENGLISH_TERMS);
  const termBatches: TranslationKeys[][] = [];
  for (let i = 0; i < termKeys.length; i += batchSize) {
    termBatches.push(termKeys.slice(i, i + batchSize));
  }

  // Sequentially process each batch
  for (const termBatch of termBatches) {
    for (const term of termBatch) {
      if (translatedTerms[term]) {
        // Term already translated (either from existing file or skipped)
        continue;
      }

      const englishText = ENGLISH_TERMS[term].trim();
      if (!englishText) {
        console.warn("Skipping empty term:", term);
        translatedTerms[term] = ""; // Return an empty string for empty terms
        continue;
      }

      const params = {
        Text: englishText,
        SourceLanguageCode: "en",
        TargetLanguageCode: targetLanguage,
      };
      const command = new TranslateTextCommand(params);

      try {
        const response = await client.send(command);
        translatedTerms[term] = response.TranslatedText;
        const translatedText = response.TranslatedText;
        console.log(`'${term}': '${translatedText}'`);
      } catch (error) {
        console.error(
          "Translation error for term",
          term,
          targetLanguage,
          ":",
          error.message,
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
              retryError.message,
            );
            retries++;
          }
        }
      }
    }
  }

  console.log(translatedTerms);
  fs.writeFile(languageJson, JSON.stringify(translatedTerms), () => undefined);
}

const languages = getKeys(languageDetails);
languages.forEach((lang) => lang !== "en" && translateTerms(lang));

// Parse the command line arguments
// const args = process.argv.slice(2); // Remove the first two arguments (node and script path)
// const targetLanguage = args[0]; // The first argument should be the language code (e.g., "fr")

// if (targetLanguage) {
//   main(targetLanguage as LanguageCode);
// } else {
//   console.error(
//     "Please provide a target language code (e.g., yarn translate fr (for french)).",
//   );
// }
