import { resources } from "lib/i18n/dictionaries/dictionary";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
