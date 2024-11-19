# How to add a new term to the translation library

1. Add a new term into `dictionary.json` (e.g. "marketplace.title": "Welcome" )

2. Use the term in line

For terms that are inside React Components follow this example:

```typescript
import { useAppTranslation } from "lib/i18n/useAppTranslations";
...
export const Marketplace: React.FC = () => {
    const { t } = useAppTranslation()

    return <p>{t("marketplace.title")}</p>
}
```

For terms that are not under React Components, follow this example:

```typescript

title: translate("marketplace.title"),

```

_Do not update en.json - this is a file we use to track which terms have been translated_

Upon push to main branch, the translation script will run and add the terms to all the available dictionaries in the repository.
