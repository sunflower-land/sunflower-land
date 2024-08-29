# How to add new Languages

1. In `dictionary.ts` add your language code in type `LanguageCode` (see [here](https://docs.aws.amazon.com/translate/latest/dg/what-is-languages.html#what-is-languages-supported) for supported languages)

2. Run `yarn translate` to generate the translation file for your new language. (you will need AWS credentials to run this)

3. Import your new json file in a similar format to other translation files

4. In `languageDetails` add details for the flag image, flag alt and the Language name

5. in `resources` add the translation resource you just generated

Note: If your language requires certains fonts to display, approach one of the developers so that they can help you upload and apply your fonts to your language
