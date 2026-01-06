export type EnDictionary = (typeof import("./dictionary.json"))["default"];
export type TranslationKeys = keyof EnDictionary;
