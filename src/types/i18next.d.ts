import { resources } from "lib/i18n/dictionaries/language";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
