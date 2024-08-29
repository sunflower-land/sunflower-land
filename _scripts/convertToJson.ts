/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";
import { LanguageCode } from "../src/lib/i18n/dictionaries/dictionary";
import { TranslationKeys } from "../src/lib/i18n/dictionaries/types";
import { ENGLISH_TERMS } from "../src/lib/i18n/dictionaries/englishDictionary";
import { TURKISH_TERMS } from "../src/lib/i18n/dictionaries/turkishDictionary";
import { getKeys } from "../src/features/game/types/craftables";

function convertToJSON(
  language: LanguageCode,
  languageTerms: Record<TranslationKeys, string>,
) {
  const filteredTerms: Partial<Record<TranslationKeys, string>> = {};
  const languageTermsKeys = getKeys(languageTerms);

  languageTermsKeys.forEach((term) => {
    if (languageTerms[term] !== ENGLISH_TERMS[term]) {
      filteredTerms[term] = languageTerms[term];
      console.log(`${filteredTerms[term]} added!`);
    }
  });

  const languageJson = path.join(__dirname, `./${language}.json`);
  fs.writeFileSync(languageJson, JSON.stringify(filteredTerms));
}

convertToJSON("tr", TURKISH_TERMS);
