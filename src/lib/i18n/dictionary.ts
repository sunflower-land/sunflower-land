export type LanguageCode = "en" | "pt";

export type TranslationKeys =
  | "featured"
  | "otherWallets"
  | "needHelp"
  | "welcome.createAccount"
  | "connecting"
  | "loading"
  | "welcome.login";

export type TranslationResource = Record<TranslationKeys, string>;

export const resources: Record<
  LanguageCode,
  { translation: TranslationResource }
> = {
  en: {
    translation: {
      featured: "Featured",
      otherWallets: "Other wallets",
      needHelp: "Need help?",
      "welcome.createAccount": "Create account",
      connecting: "Connecting",
      loading: "Loading",
      "welcome.login": "Login",
    },
  },
  pt: {
    translation: {
      featured: "Destaque",
      otherWallets: "Outras carteiras",
      needHelp: "Ajuda?",
      "welcome.createAccount": "Criar conta",
      connecting: "Conectando",
      loading: "Carregando",
      "welcome.login": "Entrar",
    },
  },
};
