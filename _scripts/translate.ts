import { ENGLISH_TERMS } from "../src/lib/i18n/dictionaries/englishDictionary";

import fr from "../src/lib/i18n/dictionaries/fr.json";
import AWS from "aws-sdk";

// Set up the Translate client
const translate = new AWS.Translate({
  region: "ap-southeast-2", // e.g., 'us-east-1'
});

async function translateText(text: string, targetLanguage: string) {
  const params = {
    Text: text,
    SourceLanguageCode: "en", // English
    TargetLanguageCode: targetLanguage, // e.g., 'fr' for French
  };

  try {
    const data = await translate.translateText(params).promise();
    return data.TranslatedText;
  } catch (err) {
    console.error("Error translating text:", err);
  }
}

async function main() {
  // Find terms which are missing a translation
  // For string, send to AWS API - Translate
  const translation = await translateText("Howdy Bumpkin", "fr");
  console.log({ translation });
}

main();

// Send to AWS Translate

// Update the JSON file for the translation
