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

async function translateText(text: string, targetLanguage: LanguageCode) {
  try {
    if (!text.trim()) {
      console.warn("Skipping empty term:", text);
      return ""; // Return an empty string for empty terms
    }

    const params = {
      Text: text,
      SourceLanguageCode: "en",
      TargetLanguageCode: targetLanguage,
    };
    const command = new TranslateTextCommand(params);
    const response = await client.send(command);
    return response.TranslatedText;
  } catch (error) {
    console.error("Translation error:", error.message);
    // You can handle the error here (e.g., retry, log, or provide a fallback)
    throw error; // Rethrow the error if needed
  }
}

async function main(language: LanguageCode) {
  // Find terms which are missing a translation
  // For string, send to AWS API - Translate
  const translatedTerms = {};
  // Iterate through each English term
  for (const term in ENGLISH_TERMS) {
    if (Object.hasOwnProperty.call(ENGLISH_TERMS, term)) {
      const englishText = ENGLISH_TERMS[term];
      console.log(englishText);
      const translatedText = await translateText(englishText, language); // Translate to French (you can change the target language)
      console.log(translatedText);
      translatedTerms[term] = translatedText;
    }
  }
  console.log(translatedTerms);
  const languageJson = path.join(
    __dirname,
    `../src/lib/i18n/dictionaries/${language}.json`,
  );
  fs.writeFile(languageJson, JSON.stringify(translatedTerms), () => undefined);
}

// main("fr");
// main("pt");
// main("ru");
// main("tk");
main("zh-CN");

// Send to AWS Translate

// Update the JSON file for the translation
