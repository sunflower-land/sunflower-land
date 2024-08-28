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
  const params = {
    Text: text,
    SourceLanguageCode: "en", // English
    TargetLanguageCode: targetLanguage, // e.g., 'fr' for French
  };
  const command = new TranslateTextCommand(params);
  const response = await client.send(command);
  return response.TranslatedText;
}

async function main() {
  // Find terms which are missing a translation
  // For string, send to AWS API - Translate
  let translatedTerms: Record<TranslationKeys, string>;
  const englishTerms = getKeys(ENGLISH_TERMS);
  englishTerms.forEach(async (name) => {
    console.log(ENGLISH_TERMS[name]);
    const translation = await translateText(ENGLISH_TERMS[name], "fr");
    console.log(translation);
  });
  // const languageJson = path.join(
  //   __dirname,
  //   `../src/lib/i18n/dictionaries/fr.json`,
  // );
  // fs.writeFile(languageJson);
}

main();

// Send to AWS Translate

// Update the JSON file for the translation
